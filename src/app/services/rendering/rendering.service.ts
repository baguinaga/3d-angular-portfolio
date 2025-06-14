import { Injectable, inject } from '@angular/core';
import { WebGLRenderer } from 'three';
import { SceneManagerService } from './scene-manager.service';

@Injectable({
  providedIn: 'root',
})
export class RenderingService {
  private sceneManager = inject(SceneManagerService);

  private renderer!: WebGLRenderer;
  // TODO: create a config for the default scene name and other constants
  private activeSceneName = 'particles-web';

  // Subscribe to the active scene name from the SceneManagerService,
  // trigger resize to maintain aspect ratio
  constructor() {
    this.sceneManager.activeScene$.subscribe((sceneName) => {
      this.activeSceneName = sceneName;
      //short-circuit evaluation, only resize if renderer has been initialized
      this.renderer && this.resizeRenderer();
    });
  }

  // Initialize the renderer
  initializeRenderer(canvas: HTMLCanvasElement): WebGLRenderer {
    this.renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    return this.renderer;
  }

  // Start the rendering loop
  startRenderingLoop(): void {
    const renderCycle = () => {
      // Recursively call the renderCycle function
      requestAnimationFrame(renderCycle);

      const scene = this.sceneManager.getScene(this.activeSceneName);
      const camera = this.sceneManager.getCamera(this.activeSceneName);
      const animation = this.sceneManager.getAnimation(this.activeSceneName);

      if (scene && camera) {
        if (animation) {
          animation();
        }
        this.renderer.render(scene, camera);
      }
    };

    renderCycle();
  }

  // Resize the renderer to maintain the aspect ratio if the window is resized
  // also called when the active scene changes
  resizeRenderer(): void {
    const camera = this.sceneManager.getCamera(this.activeSceneName);
    const width = window.visualViewport?.width || window.innerWidth;
    const height = window.visualViewport?.height || window.innerHeight;

    if (camera) {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    this.renderer.setSize(width, height, false);
  }
}
