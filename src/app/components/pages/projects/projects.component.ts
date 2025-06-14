import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ProjectsData, Project, ProjectSection } from '../../../types';

@Component({
  selector: 'app-projects',
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
})
export class ProjectsComponent implements OnInit {
  private http = inject(HttpClient);

  isCurrentOpen = true;
  isPastOpen = true;

  currentProjects: Project[] = [];
  pastProjects: Project[] = [];
  sections: ProjectSection[] = [];

  placeholderImage = 'assets/images/placeholder.png';

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.http.get<ProjectsData>('assets/projects.json').subscribe((data) => {
      this.currentProjects = data.currentProjects;
      this.pastProjects = data.pastProjects;

      if (this.currentProjects && this.currentProjects.length > 0) {
        this.sections = [
          {
            title: 'Current Projects',
            id: 'current-projects',
            projects: this.currentProjects,
            isOpen: () => this.isCurrentOpen,
            toggle: () => (this.isCurrentOpen = !this.isCurrentOpen),
          },
          {
            title: 'Archived Projects',
            id: 'archived-projects',
            projects: this.pastProjects,
            isOpen: () => this.isPastOpen,
            toggle: () => (this.isPastOpen = !this.isPastOpen),
          },
        ];
      }
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
