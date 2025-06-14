import { Component, Input } from '@angular/core';
import { NgFor, NgIf, NgClass } from '@angular/common';
import { RouterLinkActive, RouterLink } from '@angular/router';

type PagesArray = { label: string; url: string }[];

@Component({
    selector: 'app-nav-menu',
    templateUrl: './nav-menu.component.html',
    styleUrl: './nav-menu.component.css',
    imports: [NgFor, RouterLinkActive, RouterLink, NgIf, NgClass]
})
export class NavMenuComponent {
  @Input() pages: PagesArray = [];

  // State for mobile menu
  isMobileMenuOpen = false;

  // Toggle the mobile menu
  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
}
