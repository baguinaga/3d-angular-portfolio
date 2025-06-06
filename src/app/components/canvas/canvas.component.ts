import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  Input,
  HostListener,
  OnChanges,
} from '@angular/core';
import { RenderingService } from '../../services/rendering.service';
import { SceneManagerService } from '../../services/scene-manager.service';
import * as Scenes from '../../scenes/index';

@Component({
    selector: 'app-canvas',
    templateUrl: './canvas.component.html',
    styleUrls: ['./canvas.component.css'],
    standalone: false
})
export class CanvasComponent implements AfterViewInit, OnChanges {
  @ViewChild('canvas', { static: true })
  private canvasRef!: ElementRef;
  @Input() interactMode: boolean = false;
  @HostListener('window:resize')
  onResize(): void {
    this.rendering.resizeRenderer();
  }

  constructor(
    private rendering: RenderingService,
    private sceneManager: SceneManagerService,
  ) {}

  ngAfterViewInit(): void {
    // Set the canvas reference in the SceneManagerService
    // and initialize the renderer
    const canvas = this.canvasRef.nativeElement;
    if (!!canvas) {
      canvas && this.sceneManager.setCanvas(canvas);
      this.sceneManager.setInteractMode(this.interactMode);
      this.sceneManager.registerAllScenes(Scenes);
      this.rendering.initializeRenderer(canvas);
      this.rendering.startRenderingLoop();
    }
  }

  ngOnChanges(): void {
    // Update the interact mode in the SceneManagerService
    this.sceneManager.setInteractMode(this.interactMode);
  }
}
