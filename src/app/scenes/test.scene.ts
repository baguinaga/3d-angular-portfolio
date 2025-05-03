import * as THREE from 'three';

type InteractiveCallbacks = {
  [key: string]: (...args: any[]) => void;
};

export function createTestScene(): {
  name: string;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  animation: () => void;
  callbacks: InteractiveCallbacks;
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
      object.position.x += deltaX * 0.01;
      object.position.y -= deltaY * 0.01;
      console.log('mousemove');
    },
    mousedown: (object: THREE.Object3D) => {
      object
        ? console.log('mousedown', object)
        : console.log('mousedown', 'No object selected');
    },
    // TODO: Placeholder for mouse up event
    mouseup: () => {
      console.log('mouseup');
    },
  };

  return { name, scene, camera, animation, callbacks };
}
