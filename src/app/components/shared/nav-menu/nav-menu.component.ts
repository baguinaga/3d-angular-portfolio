import { Component, Input } from '@angular/core';

type PagesArray = { label: string; url: string }[];

@Component({
  selector: 'app-nav-menu',
  templateUrl: './nav-menu.component.html',
  styleUrl: './nav-menu.component.css',
})
export class NavMenuComponent {
  @Input() pages: PagesArray = [];
}
