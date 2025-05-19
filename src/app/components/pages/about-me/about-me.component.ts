import { Component, HostListener, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-about-me',
  standalone: true,
  imports: [],
  templateUrl: './about-me.component.html',
  styleUrl: './about-me.component.css',
})
export class AboutMeComponent implements AfterViewInit {
  private prevViewportWidth: number =
    window.visualViewport?.width || window.innerWidth;
  isExpanded = false;

  @HostListener('window:resize')
  onResize(): void {
    const currViewportWidth = window.visualViewport?.width || window.innerWidth;

    if (currViewportWidth !== this.prevViewportWidth) {
      this.updateScrollState();
      this.isExpanded = false;
    }
  }

  isScrollable(): boolean {
    const container = document.getElementById('about-me-container');
    if (!container) return false;

    // Check if the container has vertical overflow
    return container.scrollHeight > container.clientHeight;
  }

  updateScrollState(): void {
    const container = document.getElementById('about-me-container');
    const button = document.getElementById('read-more-btn');
    this.prevViewportWidth = window.visualViewport?.width || window.innerWidth;

    if (!container || !button) return;

    if (this.isScrollable()) {
      button.classList.remove('hidden');
      button.setAttribute('aria-hidden', 'false');
      container.classList.add('fade-overlay');
      button!.textContent = 'Read More';
    } else {
      button.classList.add('hidden');
      button.setAttribute('aria-hidden', 'true');
      container.classList.remove('fade-overlay');
      button!.textContent = 'Read Less';
    }
  }

  toggleReadMore(): void {
    this.isExpanded = !this.isExpanded;

    const container = document.getElementById('about-me-container');
    const button = document.getElementById('read-more-btn');

    if (this.isExpanded) {
      // Enable scrolling inside the container
      container?.classList.remove('fade-overlay');
      container?.classList.add('overflow-y-auto');
      button!.textContent = 'Read Less';
      button?.setAttribute('aria-expanded', this.isExpanded.toString());
      button?.setAttribute('aria-label', 'Read Less');
    } else {
      // Restrict height and hide overflow
      container?.classList.add('fade-overlay');
      container?.classList.remove('overflow-y-auto');
      button!.textContent = 'Read More';
      button?.setAttribute('aria-expanded', this.isExpanded.toString());
      button?.setAttribute('aria-label', 'Read More');
    }
  }

  ngAfterViewInit(): void {
    this.updateScrollState();
  }
}
