import { Injectable } from '@angular/core';
import * as THREE from 'three';
import { SceneManagerService } from './scene-manager.service';

@Injectable({
  providedIn: 'root',
})
export class RenderingService {
  private renderer!: THREE.WebGLRenderer;
  private activeSceneName: string = 'default';

  // Subscribe to the active scene name from the SceneManagerService,
  // trigger resize to maintain aspect ratio
  constructor(private sceneManager: SceneManagerService) {
    this.sceneManager.activeScene$.subscribe((sceneName) => {
      this.activeSceneName = sceneName;
      //short-circuit evaluation, only resize if renderer is initialized
      this.renderer && this.resizeRenderer();
    });
  }

  // Initialize the renderer
  initializeRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
    this.renderer = new THREE.WebGLRenderer({ canvas });
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

  // Resize the renderer
  resizeRenderer(): void {
    const camera = this.sceneManager.getCamera(this.activeSceneName);

    if (camera) {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    }

    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
