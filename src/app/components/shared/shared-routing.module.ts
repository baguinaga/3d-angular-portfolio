import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutMeComponent } from '../pages/about-me/about-me.component';
import { ProjectsComponent } from '../pages/projects/projects.component';
import { UnderConstructionComponent } from '../pages/under-construction/under-construction.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'under-construction',
    pathMatch: 'full',
  },
  {
    path: 'under-construction',
    component: UnderConstructionComponent,
    data: { scene: 'test' },
  },
  {
    path: 'about',
    component: AboutMeComponent,
    data: { scene: 'default' },
  },
  {
    path: 'projects',
    component: ProjectsComponent,
    data: { scene: 'test' },
  },
  { path: '**', redirectTo: 'under-construction' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SharedRoutingModule {}
