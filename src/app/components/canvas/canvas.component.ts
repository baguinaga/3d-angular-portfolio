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
import { RenderingService } from '../../services/rendering/rendering.service';
import { SceneManagerService } from '../../services/scene-manager/scene-manager.service';
import * as Scenes from '../../scenes';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
  standalone: true,
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
    this.sceneManager.setInteractMode(this.interactMode);
  }
}
