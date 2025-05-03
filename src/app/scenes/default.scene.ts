import * as THREE from 'three';
// TODO: create a more specific type for callbacks
type InteractiveCallbacks = {
  [key: string]: (...args: any[]) => void;
};

export function createDefaultScene(): {
  name: string;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  animation: () => void;
  callbacks: InteractiveCallbacks;
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
  // TODO: create a file that contains generic types of interaction callbacks
  // for example: "push" "rotate" "scale" "select" "deselect"

  const callbacks = {
    // Push the object away from the cursor
    mousemove: (object: THREE.Object3D, deltaX: number, deltaY: number) => {
      object.position.x += deltaX * 0.01;
      object.position.y -= deltaY * 0.01;
      console.log('mousemove');
    },
    // TODO: Placeholder for mouse down and up events
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
