import * as THREE from 'three';

export function createTestScene(): {
  name: string;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  animation: () => void;
  callbacks: {
    mousemove?: (
      object: THREE.Object3D,
      deltaX: number,
      deltaY: number,
    ) => void;
    mousedown?: (object: THREE.Object3D) => void;
    mouseup?: () => void;
  };
} {
  const name = 'test';
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xccc9b8);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.z = 5;

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1.5, 32, 32),
    new THREE.MeshMatcapMaterial({ color: 0xff0000 }),
  );
  scene.add(sphere);

  const animation = () => {
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;
  };
  const callbacks = {
    // Push the object away from the cursor
    mousemove: (object: THREE.Object3D, deltaX: number, deltaY: number) => {
      object.position.x += deltaX * 0.02;
      object.position.y -= deltaY * 0.02;
    },
    // TODO: Placeholder for mouse down and up events
    mousedown: (object: THREE.Object3D) => {
      console.log(name, 'Object selected:', object);
    },
    // TODO: Placeholder for mouse up event
    mouseup: () => {
      console.log(name, 'Object deselected');
    },
  };

  return { name, scene, camera, animation, callbacks };
}
