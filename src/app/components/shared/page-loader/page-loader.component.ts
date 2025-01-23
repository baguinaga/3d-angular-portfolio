import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { routeTransition } from '../../../animations/animations';

@Component({
  selector: 'app-page-loader',
  templateUrl: './page-loader.component.html',
  styleUrl: './page-loader.component.css',
  animations: [routeTransition],
})
export class PageLoaderComponent {
  constructor(protected route: ActivatedRoute) {}
}
