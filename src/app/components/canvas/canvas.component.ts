import { Component, ElementRef, AfterViewInit, ViewChild } from '@angular/core';
import { RenderingService } from '../../services/rendering.service';
import { SceneManagerService } from '../../services/scene-manager.service';
import * as Scenes from '../../scenes/index';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true })
  private canvasRef!: ElementRef;

  constructor(
    private renderingService: RenderingService,
    private sceneManager: SceneManagerService,
  ) {}

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.sceneManager.registerAllScenes(Scenes);
    this.renderingService.initializeRenderer(canvas);
    this.renderingService.startRenderingLoop();

    window.addEventListener('resize', () => {
      this.renderingService.resizeRenderer();
    });
  }
}
