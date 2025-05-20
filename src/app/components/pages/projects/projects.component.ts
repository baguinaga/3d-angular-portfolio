import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './projects.component.html',
  styleUrl: './projects.component.css',
})
export class ProjectsComponent {
  isCurrentOpen = true;
  isPastOpen = false;

  currentProjects = [
    {
      name: 'Project 1',
      description: 'A brief description of Project 1.',
      technologies: ['Angular', 'TailwindCSS', 'Firebase'],
      githubLink: 'https://github.com/username/project1',
      demoLink: 'https://project1.com',
      image: 'assets/images/project1.jpg',
    },
    {
      name: 'Project 2',
      description: 'A brief description of Project 2.',
      technologies: ['React', 'Node.js', 'MongoDB'],
      githubLink: 'https://github.com/username/project2',
      demoLink: null, // No demo link for this project
      image: 'assets/images/project2.jpg', // No image for this project
    },
  ];

  pastProjects = [
    {
      name: 'Project 3',
      description: 'A brief description of Project 3.',
      technologies: ['Vue.js', 'Express', 'PostgreSQL'],
      githubLink: 'https://github.com/username/project3',
      demoLink: 'https://project3.com',
      image: 'assets/images/project3.jpg',
    },
    {
      name: 'Project 4',
      description: 'A brief description of Project 4.',
      technologies: ['Django', 'Python', 'SQLite'],
      githubLink: 'https://github.com/username/project4',
      demoLink: null, // No demo link for this project
      image: null, // No image for this project
    },
  ];

  toggleAccordion(section: 'current' | 'past'): void {
    if (section === 'current') {
      this.isCurrentOpen = !this.isCurrentOpen;
    } else if (section === 'past') {
      this.isPastOpen = !this.isPastOpen;
    }
  }
}
