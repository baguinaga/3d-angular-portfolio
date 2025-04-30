import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as THREE from 'three';

type CreateSceneFunction = () => {
  name: string;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  animation: () => void;
  callbacks?: {
    mousemove?: (
      object: THREE.Object3D,
      deltaX: number,
      deltaY: number,
    ) => void;
    mousedown?: (object: THREE.Object3D) => void;
    mouseup?: () => void;
  };
};

@Injectable({
  providedIn: 'root',
})
export class SceneManagerService {
  private scenes: Record<string, THREE.Scene> = {};
  private animations: Record<string, () => void> = {};
  private cameras: Record<string, THREE.PerspectiveCamera> = {};
  private activeSceneSubject = new BehaviorSubject<string>('default');
  public activeScene$: Observable<string> =
    this.activeSceneSubject.asObservable();

  registerScene(
    sceneName: string,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    animationCallback: () => void,
  ): void {
    this.scenes[sceneName] = scene;
    this.cameras[sceneName] = camera;
    this.animations[sceneName] = animationCallback;
  }

  // Is used to register all scenes from index.ts imported in the canvas component
  registerAllScenes(scenes: Record<string, CreateSceneFunction>): void {
    Object.entries(scenes).forEach(([_sceneName, createScene]) => {
      if (typeof createScene === 'function') {
        const { name, scene, camera, animation } = (
          createScene as CreateSceneFunction
        )();
        this.registerScene(name, scene, camera, animation);
      }
    });
  }

  getScene(sceneName: string): THREE.Scene | undefined {
    return this.scenes[sceneName];
  }

  getActiveScene(): string {
    return this.activeSceneSubject.getValue();
  }

  // If the scene exists, set it as the active scene
  // and trigger the activeScene$ observable
  setActiveScene(sceneName: string): void {
    if (!!this.getScene(sceneName)) {
      this.activeSceneSubject.next(sceneName);
    }
  }

  getCamera(sceneName: string): THREE.PerspectiveCamera | undefined {
    return this.cameras[sceneName];
  }

  getAnimation(sceneName: string): (() => void) | undefined {
    return this.animations[sceneName];
  }
}
