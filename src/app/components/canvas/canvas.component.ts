import {
  Component,
  ElementRef,
  HostListener,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import { SceneManagerService } from '../../services/scene-manager.service';
import { createDefaultScene } from '../../scenes/default.scene';
import { createAlternateScene } from '../../scenes/test.scene';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
})
export class CanvasComponent implements AfterViewInit {
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.updateOnResize();
  }

  @ViewChild('canvas', { static: true })
  private canvasRef!: ElementRef;

  private renderer!: THREE.WebGLRenderer;
  private activeSceneName: string = 'default';

  constructor(private sceneManager: SceneManagerService) {}

  ngAfterViewInit(): void {
    this.initRenderer();

    // Register scenes
    this.registerScenes();

    // Set the initial scene
    this.switchScene('default');
    this.switchScene('test');

    // Start the rendering loop
    this.startRenderingLoop();
  }

  private initRenderer(): void {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvasRef.nativeElement,
    });
    this.renderer.setPixelRatio(devicePixelRatio);
    this.renderer.setSize(
      this.canvasRef.nativeElement.clientWidth,
      this.canvasRef.nativeElement.clientHeight
    );
  }

  private registerScenes(): void {
    // Register the default scene
    const defaultScene = createDefaultScene();
    this.sceneManager.registerScene(
      'default',
      defaultScene.scene,
      defaultScene.camera,
      defaultScene.animation
    );

    // Register the alternate scene
    const alternateScene = createAlternateScene();
    this.sceneManager.registerScene(
      'test',
      alternateScene.scene,
      alternateScene.camera,
      alternateScene.animation
    );
  }

  private switchScene(sceneName: string): void {
    if (this.sceneManager.getScene(sceneName)) {
      this.activeSceneName = sceneName;
    } else {
      console.error(`Scene "${sceneName}" not found.`);
    }
  }

  private startRenderingLoop(): void {
    const component = this;
    (function render() {
      requestAnimationFrame(render);

      const activeScene = component.sceneManager.getScene(
        component.activeSceneName
      );
      const activeCamera = component.sceneManager.getCamera(
        component.activeSceneName
      );
      const animation = component.sceneManager.getAnimation(
        component.activeSceneName
      );

      if (activeScene && activeCamera) {
        if (animation) {
          animation();
        }
        component.renderer.render(activeScene, activeCamera);
      }
    })();
  }

  private updateOnResize(): void {
    const activeCamera = this.sceneManager.getCamera(this.activeSceneName);
    if (activeCamera) {
      activeCamera.aspect = window.innerWidth / window.innerHeight;
      activeCamera.updateProjectionMatrix();
    }
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
