import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AnimatedSlideBannerComponent } from './animated-slide-banner/animated-slide-banner.component';
import { AnimatedTextComponent } from './animated-text/animated-text.component';
import { AnimatedSquaresComponent } from './animated-squares/animated-squares.component';

@NgModule({
  declarations: [
    AppComponent,
    AnimatedSlideBannerComponent,
    AnimatedTextComponent,
    AnimatedSquaresComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
