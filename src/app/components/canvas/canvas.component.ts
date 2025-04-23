import {
  Component,
  ElementRef,
  HostListener,
  AfterViewInit,
  ViewChild,
} from '@angular/core';
import * as THREE from 'three';
import { SceneManagerService } from '../../services/scene-manager.service';
import { SceneSwitcherService } from '../../services/scene-switcher.service';
import * as Scenes from '../../scenes/index';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.css',
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

  constructor(
    private sceneManager: SceneManagerService,
    private sceneSwitcher: SceneSwitcherService
  ) {}

  ngAfterViewInit(): void {
    this.initRenderer();
    this.registerScenes();
    this.sceneSwitcher.activeScene$.subscribe((sceneName) => {
      this.switchScene(sceneName);
    });
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
    Object.entries(Scenes).forEach(([sceneName, createScene]) => {
      if (typeof createScene === 'function') {
        const { name, scene, camera, animation } = (createScene as Function)();
        this.sceneManager.registerScene(name, scene, camera, animation);
      }
    });
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
