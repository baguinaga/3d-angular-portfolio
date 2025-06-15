import { Component, OnInit, inject } from '@angular/core';
import { UnderConstructionService } from './services/under-construction.service';
import { CanvasComponent } from './components/canvas/canvas.component';
import { SHARED_UI } from './components/shared/ui';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: true,
  imports: [CanvasComponent, SHARED_UI],
})
export class AppComponent implements OnInit {
  private underConstructionService = inject(UnderConstructionService);

  interactMode = false;
  public pages = [
    { label: 'About Me', url: '/about' },
    { label: 'Projects', url: '/projects' },
  ];

  underConstruction = false;

  ngOnInit(): void {
    this.underConstructionService.underConstruction$.subscribe({
      next: (isRouteUnderConstruction) => {
        this.underConstruction = isRouteUnderConstruction;
      },
    });
  }
  toggleInteractMode(): void {
    this.interactMode = !this.interactMode;
  }
}
