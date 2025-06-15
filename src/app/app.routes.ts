import { Routes } from '@angular/router';

import { AboutMeComponent } from './components/pages/about-me/about-me.component';
import { ProjectsComponent } from './components/pages/projects/projects.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'about',
    pathMatch: 'full',
  },
  {
    path: 'about',
    component: AboutMeComponent,
    data: { scene: 'particles-web' },
  },
  {
    path: 'projects',
    component: ProjectsComponent,
    data: { scene: 'particles-web' },
  },
  { path: '**', redirectTo: 'about' },
];
