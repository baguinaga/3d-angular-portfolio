import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { PageLoaderComponent } from './page-loader/page-loader.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';

@NgModule({
  declarations: [PageLoaderComponent, NavMenuComponent],
  imports: [CommonModule, HomeRoutingModule],
  exports: [PageLoaderComponent],
})
export class HomeModule {}
