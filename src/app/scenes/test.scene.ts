import * as THREE from 'three';

export function createAlternateScene(): {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  animation: () => void;
} {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xccc9b8);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 5;

  const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(1, 32, 32),
    new THREE.MeshMatcapMaterial({ color: 0xff0000 })
  );
  scene.add(sphere);

  const animation = () => {
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;
  };

  return { scene, camera, animation };
}
