import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedRoutingModule } from './shared-routing.module';
import { PageLoaderComponent } from './page-loader/page-loader.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';

@NgModule({
    imports: [CommonModule, SharedRoutingModule, PageLoaderComponent, NavMenuComponent],
    exports: [PageLoaderComponent, NavMenuComponent],
})
export class SharedModule {}
