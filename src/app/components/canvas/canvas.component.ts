import {
  Component,
  ElementRef,
  AfterViewInit,
  ViewChild,
  Input,
} from '@angular/core';
import { RenderingService } from '../../services/rendering.service';
import { SceneManagerService } from '../../services/scene-manager.service';
import { InteractionsService } from '../../services/interactions.service';
import * as Scenes from '../../scenes/index';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.css'],
})
export class CanvasComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true })
  private canvasRef!: ElementRef;
  @Input() interactMode: boolean = false;

  constructor(
    private rendering: RenderingService,
    private sceneManager: SceneManagerService,
    private interactionService: InteractionsService,
  ) {}

  ngAfterViewInit(): void {
    const canvas = this.canvasRef.nativeElement;
    this.sceneManager.registerAllScenes(Scenes);
    this.rendering.initializeRenderer(canvas);
    this.rendering.startRenderingLoop();

    window.addEventListener('resize', () => {
      this.rendering.resizeRenderer();
    });

    canvas.addEventListener('mousemove', (event: MouseEvent) => {
      this.interactionService.handleMouseMove(event);
    });
  }
}
