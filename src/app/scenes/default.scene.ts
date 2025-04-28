import * as THREE from 'three';

export function createDefaultScene(): {
  name: string;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  animation: () => void;
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

  return { name, scene, camera, animation };
}
