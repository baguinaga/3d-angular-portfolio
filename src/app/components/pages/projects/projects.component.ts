import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
})
export class ProjectsComponent implements OnInit {
  isCurrentOpen = true;
  isPastOpen = false;

  currentProjects: any[] = [];
  pastProjects: any[] = [];
  placeholderImage = 'assets/images/placeholder.png';

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.http.get('assets/projects.json').subscribe((data: any) => {
      this.currentProjects = data.currentProjects;
      this.pastProjects = data.pastProjects;
    });
  }

  toggleAccordion(section: 'current' | 'past'): void {
    if (section === 'current') {
      this.isCurrentOpen = !this.isCurrentOpen;
    } else if (section === 'past') {
      this.isPastOpen = !this.isPastOpen;
    }
  }
}
