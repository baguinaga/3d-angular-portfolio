import {
  Scene,
  Color,
  PerspectiveCamera,
  Mesh,
  SphereGeometry,
  MeshMatcapMaterial,
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

export function sphereSceneDef(): SceneDefinition<ObjectCallbacks> {
  const name = 'sphere';
  const scene = new Scene();
  scene.background = new Color(0xccc9b8);

  const camera = new PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.z = 5;

  const sphere = new Mesh(
    new SphereGeometry(1.5, 32, 32),
    new MeshMatcapMaterial({ color: 0xff0000 }),
  );
  scene.add(sphere);

  const animation = () => {
    sphere.rotation.x += 0.01;
    sphere.rotation.y += 0.01;
  };

  const callbacks: ObjectCallbacks = {
    // Push the object away from the cursor
    mousemove: (object: Object3D, deltaX: number, deltaY: number) => {
      object.position.x += deltaX * 0.01;
      object.position.y -= deltaY * 0.01;
      console.log('mousemove');
    },
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
