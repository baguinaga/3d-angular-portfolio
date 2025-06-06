import { Component, OnInit } from '@angular/core';
import { UnderConstructionService } from './services/under-construction.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    standalone: false
})
export class AppComponent implements OnInit {
  interactMode: boolean = false;
  public pages = [
    { label: 'About Me', url: '/about' },
    { label: 'Projects', url: '/projects' },
  ];

  underConstruction = false;

  constructor(private underConstructionService: UnderConstructionService) {}

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
