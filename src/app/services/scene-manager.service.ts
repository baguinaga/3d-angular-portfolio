import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import * as THREE from 'three';
import { createInteractionCallbacks } from '../utils/interaction-callback-factory';

// TODO: move types to a separate file
type CreateSceneFunction = () => {
  name: string;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  animation: () => void;
  callbacks?: InteractiveCallbacks;
};
// TODO: move this to a separate file
// generic type for interaction callbacks
type InteractiveCallbacks = {
  [key: string]: (...args: any[]) => void;
};

@Injectable({
  providedIn: 'root',
})
export class SceneManagerService {
  private scenes: Record<string, THREE.Scene> = {};
  private animations: Record<string, () => void> = {};
  private cameras: Record<string, THREE.PerspectiveCamera> = {};
  private sceneCallbacks: Record<string, InteractiveCallbacks> = {};
  private clearCallbacks?: () => void;

  // RxJS BehaviorSubject used to emit the active scene
  // consumed by the rendering service
  private activeSceneSubject = new BehaviorSubject<string>('default');
  public activeScene$: Observable<string> =
    this.activeSceneSubject.asObservable();

  registerScene(
    sceneName: string,
    scene: THREE.Scene,
    camera: THREE.PerspectiveCamera,
    animationCallback: () => void,
    callbacks?: InteractiveCallbacks,
  ): void {
    this.scenes[sceneName] = scene;
    this.cameras[sceneName] = camera;
    this.animations[sceneName] = animationCallback;
    callbacks && this.sceneCallbacks[sceneName];
  }

  // This method is used to iterate over all imported scenes (scenes/index.ts) and register them
  registerAllScenes(scenes: Record<string, CreateSceneFunction>): void {
    Object.entries(scenes).forEach(([_sceneName, createScene]) => {
      if (typeof createScene === 'function') {
        const { name, scene, camera, animation, callbacks } = (
          createScene as CreateSceneFunction
        )();
        this.registerScene(name, scene, camera, animation, callbacks);
      }
    });
  }

  getScene(sceneName: string): THREE.Scene | undefined {
    return this.scenes[sceneName];
  }

  getActiveScene(): string {
    return this.activeSceneSubject.getValue();
  }

  // This method sets the active scene Subject which emits the activeScene$ observable
  // TODO: integrate with interaction callback factory (note key issues with current implementation in page-loader.ts)
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
