import {
  Scene,
  Color,
  BoxGeometry,
  MeshBasicMaterial,
  Mesh,
  PerspectiveCamera,
  Object3D,
} from 'three';
import {
  SceneDefinition,
  Callbacks,
  IObjectMouseDownCallback,
  IObjectMouseMoveCallback,
  IObjectMouseUpCallback,
} from '../types';

type ObjectCallbacks = Callbacks<
  IObjectMouseDownCallback,
  IObjectMouseMoveCallback,
  IObjectMouseUpCallback
>;

export function cubeSceneDef(): SceneDefinition<ObjectCallbacks> {
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

  const callbacks: ObjectCallbacks = {
    // Push the object away from the cursor
    mousemove: (object: Object3D, deltaX: number, deltaY: number) => {
      object.position.x += deltaX * 0.01;
      object.position.y -= deltaY * 0.01;
      console.log('mousemove');
    },
    // TODO: Placeholder for mouse down and up events
    mousedown: (object: Object3D) => {
      if (object) {
        console.log('mousedown', object);
      } else {
        console.log('mousedown', 'No object selected');
      }
    },
    // TODO: Placeholder for mouse up event
    mouseup: () => {
      console.log('mouseup');
    },
  };

  return { name, scene, camera, animation, callbacks };
}
