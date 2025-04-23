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
