import { Component, OnInit } from '@angular/core';
import { UnderConstructionService } from './services/under-construction.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  public pages = [
    { label: 'About Me', url: '/about' },
    { label: 'Projects', url: '/projects' },
  ];

  underConstruction: boolean = false;

  constructor(private underConstructionService: UnderConstructionService) {}

  ngOnInit(): void {
    this.underConstructionService.underConstruction$.subscribe({
      next: (isRouteUnderConstruction) => {
        this.underConstruction = isRouteUnderConstruction;
      },
    });
  }
}
