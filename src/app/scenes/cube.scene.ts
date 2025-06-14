import * as THREE from 'three';
import {
  Scene,
  Color,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  PerspectiveCamera,
} from 'three';
import { SceneDefinition } from '../types';

export function cubeSceneDef(): SceneDefinition {
  const name = 'cube';
  const scene = new Scene();
  scene.background = new Color(0xabcdef);

  // create a cube
  const geometry = new BoxGeometry(1, 1, 1);
  const material = new MeshBasicMaterial({ color: 0x00ff00 });
  const cube = new Mesh(geometry, material);
  scene.add(cube);

  // set up the camera
  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.z = 5;

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
