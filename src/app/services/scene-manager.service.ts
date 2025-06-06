import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Scene, PerspectiveCamera } from 'three';
import { InteractionsService } from './interactions.service';
import {
  CreateSceneFunction,
  InteractiveCallbacks,
} from '../types/scene.types';
import { createInteractionCallbacks } from '../utils/interaction-callback-factory';

@Injectable({
  providedIn: 'root',
})
export class SceneManagerService {
  private scenes: Record<string, Scene> = {};
  private animations: Record<string, () => void> = {};
  private cameras: Record<string, PerspectiveCamera> = {};
  private sceneCallbacks: Record<string, InteractiveCallbacks> = {};
  private clearCallbacks?: () => void;
  private canvas?: HTMLCanvasElement;

  // RxJS BehaviorSubject used to emit the active scene
  // consumed by the rendering service
  private activeSceneSubject = new BehaviorSubject<string>('particles-web');
  public activeScene$: Observable<string> =
    this.activeSceneSubject.asObservable();

  constructor(private interactionsService: InteractionsService) {}

  setCanvas(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
  }

  registerScene(
    sceneName: string,
    scene: Scene,
    camera: PerspectiveCamera,
    animationCallback: () => void,
    callbacks?: InteractiveCallbacks,
  ): void {
    this.scenes[sceneName] = scene;
    this.cameras[sceneName] = camera;
    this.animations[sceneName] = animationCallback;
    if (callbacks) {
      this.sceneCallbacks[sceneName] = callbacks;
    }
  }

  // This method is used to iterate over all imported scenes (scenes/index.ts) and register them
  registerAllScenes(scenes: Record<string, CreateSceneFunction>): void {
    Object.entries(scenes).forEach(([_sceneName, createSceneFunction]) => {
      if (typeof createSceneFunction === 'function') {
        // Create the scene definitions using the createSceneFunction, pass along instance of InteractionsService
        const sceneDefinition = createSceneFunction(this.interactionsService);
        // Register the scene properties into scene manager
        this.registerScene(
          sceneDefinition.name,
          sceneDefinition.scene,
          sceneDefinition.camera,
          sceneDefinition.animation,
          sceneDefinition.callbacks,
        );
      }
    });
  }

  getScene(sceneName: string): Scene | undefined {
    return this.scenes[sceneName];
  }

  getActiveScene(): string {
    return this.activeSceneSubject.getValue();
  }

  // This method sets the active scene Subject which emits the activeScene$ observable
  // TODO: integrate with interaction callback factory (note key issues with current implementation in page-loader.ts)
  setActiveScene(sceneName: string): void {
    if (!!this.getScene(sceneName)) {
      // Clear previous scene callbacks
      if (this.clearCallbacks) {
        this.clearCallbacks();
        this.clearCallbacks = undefined;
      }
      // Set active and emit the new scene
      this.activeSceneSubject.next(sceneName);

      const callbacks = this.sceneCallbacks[sceneName];
      const scene = this.scenes[sceneName];
      const camera = this.cameras[sceneName];
      const canvas = this.canvas;

      // Creates scene interaction callbacks and stores the clear function
      if (callbacks && this.canvas && canvas && scene) {
        // clearCallbacks is higher order function that clears the event listeners
        // the listeners are bound by using the createInteractionCallbacks factory
        // the factory binds the events to canvas and passes the event to the interactions service

        //TODO: create a method or utility to handle loopping throught the events
        // current use of factory method is repetitive and not DRY
        this.clearCallbacks = createInteractionCallbacks(this.canvas, {
          mousemove: (event: MouseEvent) => {
            this.interactionsService.handleMouseMove(
              event,
              scene,
              camera,
              callbacks['mousemove'],
            );
          },
          mousedown: (event: MouseEvent) => {
            this.interactionsService.handleMouseDown(
              event,
              scene,
              camera,
              callbacks['mousedown'],
            );
          },
          mouseup: (event: MouseEvent) => {
            this.interactionsService.handleMouseUp(
              event,
              scene,
              camera,
              callbacks['mouseup'],
            );
          },
          wheel: (event: WheelEvent) => {
            this.interactionsService.handleWheel(
              event,
              scene,
              camera,
              callbacks['wheel'],
            );
          },
          touchmove: (event: TouchEvent) => {
            this.interactionsService.handleTouch(
              event,
              scene,
              camera,
              callbacks['touchmove'],
            );
          },
        });
      }
    }
  }

  getCamera(sceneName: string): PerspectiveCamera | undefined {
    return this.cameras[sceneName];
  }

  getAnimation(sceneName: string): (() => void) | undefined {
    return this.animations[sceneName];
  }

  setInteractMode(interactMode: boolean): void {
    this.interactionsService.setInteractMode(interactMode);
  }
}
