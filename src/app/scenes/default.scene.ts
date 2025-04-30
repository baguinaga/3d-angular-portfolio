import * as THREE from 'three';

export function createDefaultScene(): {
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
  const name = 'default';
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xccc9b8);

  const camera = new THREE.PerspectiveCamera(
    1,
    window.innerWidth / window.innerHeight,
    1,
    1000,
  );
  camera.position.z = 200;

  const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshMatcapMaterial({ color: 0xdddddd }),
  );
  scene.add(cube);

  const animation = () => {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
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
