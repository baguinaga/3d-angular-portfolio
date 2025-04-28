import {
  Component,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ViewChild,
} from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import * as THREE from 'three';
import { SceneManagerService } from '../../services/scene-manager.service';
import { SceneSwitcherService } from '../../services/scene-switcher.service';
import * as Scenes from '../../scenes/index';

const DEFAULT_SCENE = 'default';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrl: './canvas.component.css',
})
export class CanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('canvas', { static: true })
  private canvasRef!: ElementRef;

  private renderer!: THREE.WebGLRenderer;
  private activeSceneName: string = DEFAULT_SCENE;
  private subscriptions = new Subscription();

  constructor(
    private sceneManager: SceneManagerService,
    private sceneSwitcher: SceneSwitcherService
  ) {}

  ngAfterViewInit(): void {
    this.initRenderer();
    this.registerScenes();
    this.setupEventHandlers();
    this.sceneSwitcher.activeScene$.subscribe((sceneName) => {
      this.switchScene(sceneName);
    });
    this.startRenderingLoop();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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

  private setupEventHandlers(): void {
    const resize$ = fromEvent(window, 'resize');
    this.subscriptions.add(resize$.subscribe(() => this.updateOnResize()));
  }

  private registerScenes(): void {
    this.sceneManager.registerAllScenes(Scenes);
  }

  private switchScene(sceneName: string): void {
    if (this.sceneManager.switchToScene(sceneName)) {
      this.activeSceneName = sceneName;
      this.updateOnResize();
    }
  }

  private startRenderingLoop(): void {
    const render = () => {
      requestAnimationFrame(render);
      const activeScene = this.sceneManager.getScene(this.activeSceneName);
      const activeCamera = this.sceneManager.getCamera(this.activeSceneName);
      const animation = this.sceneManager.getAnimation(this.activeSceneName);
      if (activeScene && activeCamera) {
        if (animation) {
          animation();
        }
        this.renderer.render(activeScene, activeCamera);
      }
    };
    render();
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
