import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable({
  providedIn: 'root',
})
export class SceneManagerService {
  private scenes: { [key: string]: THREE.Scene } = {};
  private animations: { [key: string]: () => void } = {};
  private cameras: { [key: string]: THREE.PerspectiveCamera } = {};

  // Register a scene
  registerScene(
    sceneName: string,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    animationCallback: () => void
  ): void {
    this.scenes[sceneName] = scene;
    this.cameras[sceneName] = camera;
    this.animations[sceneName] = animationCallback;
  }

  registerAllScenes(scenes: { [key: string]: Function }): void {
    Object.entries(scenes).forEach(([sceneName, createScene]) => {
      if (typeof createScene === 'function') {
        const { name, scene, camera, animation } = (createScene as Function)();
        this.registerScene(name, scene, camera, animation);
      }
    });
  }

  switchToScene(sceneName: string): boolean {
    return this.getScene(sceneName) ? true : false;
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
