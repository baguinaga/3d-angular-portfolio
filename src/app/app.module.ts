import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonModule } from '@angular/common';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanvasComponent } from './components/canvas/canvas.component';
import { SharedModule } from './components/shared/shared.module';
import { provideHttpClient } from '@angular/common/http';

@NgModule({
    imports: [
        SharedModule,
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule,
        CommonModule,
        AppComponent, CanvasComponent,
    ],
    providers: [provideHttpClient()],
    bootstrap: [AppComponent],
})
export class AppModule {}
