import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutMeComponent } from '../pages/about-me/about-me.component';
import { ProjectsComponent } from '../pages/projects/projects.component';

const routes: Routes = [
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

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SharedRoutingModule {}
