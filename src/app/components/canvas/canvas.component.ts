import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  Input,
  HostListener,
  OnChanges,
  inject,
} from '@angular/core';
import { RenderingService } from '../../services/rendering.service';
import { SceneManagerService } from '../../services/scene-manager.service';
import * as Scenes from '../../scenes/index';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
})
export class CanvasComponent implements AfterViewInit, OnChanges {
  private rendering = inject(RenderingService);
  private sceneManager = inject(SceneManagerService);

  @ViewChild('canvas', { static: true })
  private canvasRef!: ElementRef;
  @Input() interactMode = false;
  @HostListener('window:resize')
  onResize(): void {
    this.rendering.resizeRenderer();
  }

  ngAfterViewInit(): void {
    // Set the canvas reference in the SceneManagerService
    // and initialize the renderer
    const canvas = this.canvasRef.nativeElement;
    if (canvas) {
      this.sceneManager.setCanvas(canvas);
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
