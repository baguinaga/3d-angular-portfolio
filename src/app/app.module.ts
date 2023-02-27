import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AngularFullpageModule } from '@fullpage/angular-fullpage';

import { AppComponent } from './app.component';
import { FullpageComponent } from './components/fullpage/fullpage.component';
import { CanvasComponent } from './components/canvas/canvas.component';

@NgModule({
  declarations: [AppComponent, FullpageComponent, CanvasComponent],
  imports: [BrowserModule, AppRoutingModule, AngularFullpageModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
