import { Component } from '@angular/core';

@Component({
  selector: 'app-page-loader',
  templateUrl: './page-loader.component.html',
  styleUrl: './page-loader.component.css',
})
export class PageLoaderComponent {
  pages = [
    { label: 'About Me', url: '/' },
    { label: 'Projects', url: '/projects' },
  ];
  constructor() {}
}
