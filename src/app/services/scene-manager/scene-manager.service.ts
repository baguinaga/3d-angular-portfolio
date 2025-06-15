import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Scene, PerspectiveCamera } from 'three';
import { InteractionsService } from '../interactions/interactions.service';
import { CreateSceneFunction, Callbacks } from '../../types';
import { createInteractionCallbacks } from '../../utils/interaction-callback-factory';

@Injectable({
  providedIn: 'root',
})
export class SceneManagerService {
  private interactionsService = inject(InteractionsService);

  private scenes: Record<string, Scene> = {};
  private animations: Record<string, () => void> = {};
  private cameras: Record<string, PerspectiveCamera> = {};
  private sceneCallbacks: Record<string, unknown> = {};
  private clearCallbacks?: () => void;
  private canvas?: HTMLCanvasElement;

  // RxJS BehaviorSubject used to emit the active scene
  // consumed by the rendering service
  private activeSceneSubject = new BehaviorSubject<string>('particles-web');
  public activeScene$: Observable<string> =
    this.activeSceneSubject.asObservable();

  setCanvas(canvas: HTMLCanvasElement): void {
    this.canvas = canvas;
  }

  registerScene(
    sceneName: string,
    scene: Scene,
    camera: PerspectiveCamera,
    animationCallback: () => void,
    callbacks?: unknown,
  ): void {
    this.scenes[sceneName] = scene;
    this.cameras[sceneName] = camera;
    this.animations[sceneName] = animationCallback;
    if (callbacks) {
      this.sceneCallbacks[sceneName] = callbacks;
    }
  }

  // This method is used to iterate over all imported scenes (scenes/index.ts) and register them
  registerAllScenes(
    scenes: Record<string, CreateSceneFunction<unknown>>,
  ): void {
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
  setActiveScene(sceneName: string): void {
    if (this.getScene(sceneName)) {
      // Clear previous scene callbacks
      if (this.clearCallbacks) {
        this.clearCallbacks();
        this.clearCallbacks = undefined;
      }
      // Set active and emit the new scene
      this.activeSceneSubject.next(sceneName);

      const callbacks = this.sceneCallbacks[sceneName] as Callbacks | undefined;
      const scene = this.scenes[sceneName];
      const camera = this.cameras[sceneName];
      const canvas = this.canvas;

      // Creates scene interaction callbacks and stores the clear function
      if (callbacks && canvas && scene && camera) {
        const handlers: Partial<Record<keyof DocumentEventMap, EventListener>> =
          {};

        // Build strongly-typed handlers for each callback type
        if (callbacks.mousedown) {
          handlers.mousedown = (event: Event) => {
            this.interactionsService.handleMouseDown(
              event as MouseEvent,
              scene,
              camera,
              callbacks.mousedown,
            );
          };
        }

        if (callbacks.mouseup) {
          handlers.mouseup = (event: Event) => {
            this.interactionsService.handleMouseUp(
              event as MouseEvent,
              scene,
              camera,
              callbacks.mouseup,
            );
          };
        }

        if (callbacks.mousemove) {
          handlers.mousemove = (event: Event) => {
            this.interactionsService.handleMouseMove(
              event as MouseEvent,
              scene,
              camera,
              callbacks.mousemove,
            );
          };
        }

        if (callbacks.wheel) {
          handlers.wheel = (event: Event) => {
            this.interactionsService.handleWheel(
              event as WheelEvent,
              scene,
              camera,
              callbacks.wheel,
            );
          };
        }

        if (callbacks.touchmove) {
          handlers.touchmove = (event: Event) => {
            this.interactionsService.handleTouch(
              event as TouchEvent,
              scene,
              camera,
              callbacks.touchmove,
            );
          };
        }

        this.clearCallbacks = createInteractionCallbacks(canvas, handlers);
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
