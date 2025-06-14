import {
  Scene,
  Color,
  BufferGeometry,
  Vector2,
  Vector3,
  PointsMaterial,
  AdditiveBlending,
  BufferAttribute,
  DynamicDrawUsage,
  Points,
  LineBasicMaterial,
  LineSegments,
  PerspectiveCamera,
} from 'three';
import { SceneDefinition, ZoomEventData, ParticleData } from '../types';
import { InteractionsServiceContract } from '../services/interactions/interactions.service.interface';
import { setVertexColor } from '../utils/color-utils';

export function animatedParticlesSceneDef(
  _interactionsService?: InteractionsServiceContract,
): SceneDefinition {
  const name = 'particles-web';
  const scene = new Scene();
  scene.background = new Color(0xb3a89d);

  // TODO:Set up a scene config object, consumed by individual scenes (may want different behaviors)
  const farPlane = 4000;
  const nearPlane = 1;
  const aspectRatio = window.innerWidth / window.innerHeight;
  const fov = 45;
  const zoomFactor = 20;
  const pinchFactor = 20;
  const maxZoom = farPlane - 1000;
  const minZoom = 50;
  const defaultZoom = 400;

  // Radius of the bounding sphere
  const diameter = 1700;
  const sphereRadius = diameter / 2;

  // Defining the particle system
  const particles = new BufferGeometry();
  const particleCount = 1000;
  const particlePositions = new Float32Array(particleCount * 3);
  const particleData: ParticleData[] = [];

  // Particle Velocity Multipliers
  const velocityMultX = 0.9;
  const velocityMultY = 0.9;
  const velocityMultZ = 0.9;

  // Particle Parameters
  let isAttracting = false;
  const mousePosition = new Vector3();
  let releaseVelocity = 0;
  let applyReleaseVelocity = false;

  // Defining segment connections
  const segmentColor = 0x000ccc; // Color of the segments
  const maxSegmentDistance = 150;
  const maxConnections = 6;
  const segmentCount = particleCount * particleCount;
  const segmentPositions = new Float32Array(segmentCount * 3);
  const colors = new Float32Array(segmentCount * 3);
  const segments = new BufferGeometry();

  // Particle Material
  const pMaterial = new PointsMaterial({
    color: 0xffffff,
    size: 2,
    blending: AdditiveBlending,
    transparent: true,
    sizeAttenuation: false,
  });

  // Segment Material
  const sMaterial = new LineBasicMaterial({
    vertexColors: true,
    blending: AdditiveBlending,
    transparent: true,
  });

  // TODO: consider creating a seperate method for creating positions

  // for each particle, create a random position (x, y, z)
  // and store in Flot32Array, reposition to the center of the scene
  for (let i = 0; i < particleCount; i++) {
    const x = Math.random() * sphereRadius * 2 - sphereRadius;
    const y = Math.random() * sphereRadius * 2 - sphereRadius;
    const z = Math.random() * sphereRadius * 2 - sphereRadius;

    particlePositions[i * 3] = x;
    particlePositions[i * 3 + 1] = y;
    particlePositions[i * 3 + 2] = z;

    // storing the particle velocity and number of connections
    particleData.push({
      velocity: new Vector3(
        -1 + Math.random() * 2 * velocityMultX,
        -1 + Math.random() * 2 * velocityMultY,
        -1 + Math.random() * 2 * velocityMultZ,
      ),
      numConnections: 0,
    });
  }

  particles.setAttribute(
    'position',
    new BufferAttribute(particlePositions, 3).setUsage(DynamicDrawUsage),
  );

  segments.setAttribute(
    'position',
    new BufferAttribute(segmentPositions, 3).setUsage(DynamicDrawUsage),
  );
  segments.setAttribute(
    'color',
    new BufferAttribute(colors, 3).setUsage(DynamicDrawUsage),
  );

  const pointCloud = new Points(particles, pMaterial);
  const lineSegments = new LineSegments(segments, sMaterial);

  scene.add(pointCloud, lineSegments);

  // Set up the camera
  const camera = new PerspectiveCamera(fov, aspectRatio, nearPlane, farPlane);
  camera.position.z = defaultZoom;

  const animation = () => {
    let vertexpos = 0;
    let colorpos = 0;
    let numConnected = 0;

    // Reset connection counts
    for (let i = 0; i < particleCount; i++) {
      particleData[i].numConnections = 0;
    }

    // Update particle positions and calculate connections
    for (let i = 0; i < particleCount; i++) {
      const particle = particleData[i];

      // Update particle position based on velocity
      particlePositions[i * 3] += particle.velocity.x;
      particlePositions[i * 3 + 1] += particle.velocity.y;
      particlePositions[i * 3 + 2] += particle.velocity.z;

      // Bounce particles off the sphere
      const x = particlePositions[i * 3];
      const y = particlePositions[i * 3 + 1];
      const z = particlePositions[i * 3 + 2];

      const distanceFromCenter = Math.sqrt(x * x + y * y + z * z);

      if (distanceFromCenter > sphereRadius) {
        const normalX = x / distanceFromCenter;
        const normalY = y / distanceFromCenter;
        const normalZ = z / distanceFromCenter;

        const velocity = particle.velocity;
        const dotProduct =
          velocity.x * normalX + velocity.y * normalY + velocity.z * normalZ;

        velocity.x -= 2 * dotProduct * normalX;
        velocity.y -= 2 * dotProduct * normalY;
        velocity.z -= 2 * dotProduct * normalZ;

        velocity.x = Math.max(-5, Math.min(2, velocity.x));
        velocity.y = Math.max(-5, Math.min(2, velocity.y));
        velocity.z = Math.max(-5, Math.min(2, velocity.z));

        const correctionFactor = sphereRadius / distanceFromCenter;
        particlePositions[i * 3] *= correctionFactor;
        particlePositions[i * 3 + 1] *= correctionFactor;
        particlePositions[i * 3 + 2] *= correctionFactor;
      }

      // Check for connections with other particles
      for (let j = i + 1; j < particleCount; j++) {
        const dx = particlePositions[i * 3] - particlePositions[j * 3];
        const dy = particlePositions[i * 3 + 1] - particlePositions[j * 3 + 1];
        const dz = particlePositions[i * 3 + 2] - particlePositions[j * 3 + 2];
        const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

        if (
          dist < maxSegmentDistance &&
          particleData[i].numConnections < maxConnections &&
          particleData[j].numConnections < maxConnections
        ) {
          particleData[i].numConnections++;
          particleData[j].numConnections++;

          // Add line segment between particles
          segmentPositions[vertexpos++] = particlePositions[i * 3];
          segmentPositions[vertexpos++] = particlePositions[i * 3 + 1];
          segmentPositions[vertexpos++] = particlePositions[i * 3 + 2];

          segmentPositions[vertexpos++] = particlePositions[j * 3];
          segmentPositions[vertexpos++] = particlePositions[j * 3 + 1];
          segmentPositions[vertexpos++] = particlePositions[j * 3 + 2];

          // Set line color based on distance,
          const alpha = 1.0 - dist / maxSegmentDistance;
          colorpos = setVertexColor(colors, colorpos, segmentColor, alpha); // First vertex of segment
          colorpos = setVertexColor(colors, colorpos, segmentColor, alpha); // Second vertex of segment

          numConnected++;
        }
      }

      if (isAttracting) {
        // Attract particles to the mouse position
        const particlePos = new Vector3(
          particlePositions[i * 3],
          particlePositions[i * 3 + 1],
          particlePositions[i * 3 + 2],
        );

        const direction = mousePosition.clone().sub(particlePos).normalize();
        const distance = direction.length(); // Calculate the distance to the mouse position
        direction.normalize();
        const attractionStrength = Math.min(0.1, 1 / (distance + 0.1)); // Adjust attraction strength
        particle.velocity.add(direction.multiplyScalar(attractionStrength));
      }
      if (applyReleaseVelocity) {
        // Apply release velocity
        particle.velocity.multiplyScalar(releaseVelocity);
      }
      if (applyReleaseVelocity) {
        applyReleaseVelocity = false; // Reset after applying
      }
    }

    // Update segment geometry
    segments.setDrawRange(0, numConnected * 2);
    segments.attributes['position'].needsUpdate = true;
    segments.attributes['color'].needsUpdate = true;

    // Update particle positions
    particles.attributes['position'].needsUpdate = true;
  };

  const callbacks = {
    wheel: (data: ZoomEventData) => {
      if (!data.delta || data.type !== 'wheel') return;
      const adjustDelta = data.delta > 0 ? zoomFactor : -zoomFactor;

      // Clamping the camera position to prevent zooming too far in or out
      camera.position.z = Math.min(
        maxZoom,
        Math.max(minZoom, camera.position.z + adjustDelta),
      );

      camera.updateProjectionMatrix();
    },
    touchmove: (data: ZoomEventData) => {
      if (!data.delta || data.type !== 'touch') return;
      // pinchDelta is a distance, it is negative when zooming in, positive when zooming out
      const adjustDelta = data.delta * pinchFactor;

      // Clamping the camera position to prevent zooming too far in or out
      camera.position.z = Math.min(
        maxZoom,
        Math.max(minZoom, camera.position.z + adjustDelta),
      );

      camera.updateProjectionMatrix();
    },
    mousedown: () => {
      isAttracting = true;
    },
    mousemove: (position: Vector2) => {
      const vector = new Vector3(position.x, position.y, 0.5);
      vector.unproject(camera);
      mousePosition.copy(vector);
    },
    mouseup: (velocity: number) => {
      releaseVelocity = Math.min(velocity, 5); // Cap velocity at a maximum value (e.g., 5)
      applyReleaseVelocity = true;
      mousePosition.set(0, 0, 0);
    },
  };

  return { name, scene, camera, animation, callbacks };
}
