import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as THREE from 'three';

type CreateSceneFunction = () => {
  name: string;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  animation: () => void;
};

@Injectable({
  providedIn: 'root',
})
export class SceneManagerService {
  private scenes: Record<string, THREE.Scene> = {};
  private animations: Record<string, () => void> = {};
  private cameras: Record<string, THREE.PerspectiveCamera> = {};
  private activeSceneSubject = new BehaviorSubject<string>('default');
  public activeScene$ = this.activeSceneSubject.asObservable();

  // Register a scene
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

  setActiveScene(sceneName: string): void {
    this.activeSceneSubject.next(sceneName);
  }

  // Get a scene by name
  getScene(sceneName: string): THREE.Scene | undefined {
    return this.scenes[sceneName];
  }

  // Get the camera for a scene
  getCamera(sceneName: string): THREE.PerspectiveCamera | undefined {
    return this.cameras[sceneName];
  }

  // Get the animation for a scene
  getAnimation(sceneName: string): (() => void) | undefined {
    return this.animations[sceneName];
  }
}
