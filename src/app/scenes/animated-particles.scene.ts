import * as THREE from 'three';
import { SceneDefinition } from '../types/scene.types';
import { setVertexColor } from '../utils/color-utils';

export function animatedParticlesSceneDef(): SceneDefinition {
  const name = 'particles-web';
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x5d5f75);

  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    4000,
  );
  camera.position.z = 600;

  // Radius of the bounding box
  const r = 800;
  const rHalf = r / 2;

  // Defining the particle system
  const particles = new THREE.BufferGeometry();
  const particleCount = 300;
  const particlePositions = new Float32Array(particleCount * 3);
  const particleData: any = [];

  // Particle Velocity Multipliers
  const velocityMultX = 0.6;
  const velocityMultY = 0.6;
  const velocityMultZ = 0.6;

  // Defining segment connections
  const segmentColor = 0x000ccc; // Color of the segments
  const maxSegmentDistance = 150;
  const maxConnections = 8;
  const segmentCount = particleCount * particleCount;
  const segmentPositions = new Float32Array(segmentCount * 3);
  const colors = new Float32Array(segmentCount * 3);
  const segments = new THREE.BufferGeometry();

  // Particle Material
  const pMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2,
    blending: THREE.AdditiveBlending,
    transparent: true,
    sizeAttenuation: false,
  });

  // Segment Material
  const sMaterial = new THREE.LineBasicMaterial({
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    transparent: true,
  });

  // TODO: consider creating a seperate method for creating positions

  // for each particle, create a random position (x, y, z)
  // and store in Flot32Array, reposition to the center of the scene with radius r
  for (let i = 0; i < particleCount; i++) {
    const x = Math.random() * r - rHalf;
    const y = Math.random() * r - rHalf;
    const z = Math.random() * r - rHalf;

    particlePositions[i * 3] = x;
    particlePositions[i * 3 + 1] = y;
    particlePositions[i * 3 + 2] = z;

    // storing the particle velocity and number of connections
    particleData.push({
      velocity: new THREE.Vector3(
        -1 + Math.random() * 2 * velocityMultX,
        -1 + Math.random() * 2 * velocityMultY,
        -1 + Math.random() * 2 * velocityMultZ,
      ),
      numConnections: 0,
    });
  }

  particles.setAttribute(
    'position',
    new THREE.BufferAttribute(particlePositions, 3).setUsage(
      THREE.DynamicDrawUsage,
    ),
  );

  segments.setAttribute(
    'position',
    new THREE.BufferAttribute(segmentPositions, 3).setUsage(
      THREE.DynamicDrawUsage,
    ),
  );
  segments.setAttribute(
    'color',
    new THREE.BufferAttribute(colors, 3).setUsage(THREE.DynamicDrawUsage),
  );

  const pointCloud = new THREE.Points(particles, pMaterial);
  const lineSegments = new THREE.LineSegments(segments, sMaterial);

  scene.add(pointCloud, lineSegments);

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

      // Bounce particles off the bounding box
      if (
        particlePositions[i * 3 + 1] < -rHalf ||
        particlePositions[i * 3 + 1] > rHalf
      ) {
        particle.velocity.y = -particle.velocity.y;
      }
      if (
        particlePositions[i * 3] < -rHalf ||
        particlePositions[i * 3] > rHalf
      ) {
        particle.velocity.x = -particle.velocity.x;
      }
      if (
        particlePositions[i * 3 + 2] < -rHalf ||
        particlePositions[i * 3 + 2] > rHalf
      ) {
        particle.velocity.z = -particle.velocity.z;
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
    }

    // Update segment geometry
    segments.setDrawRange(0, numConnected * 2);
    segments.attributes['position'].needsUpdate = true;
    segments.attributes['color'].needsUpdate = true;

    // Update particle positions
    particles.attributes['position'].needsUpdate = true;
  };

  return { name, scene, camera, animation };
}
