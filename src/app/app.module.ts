import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InitalPageComponent } from './inital-page/inital-page.component';
import { ForecastPageComponent } from './forecast-page/forecast-page.component';

@NgModule({
  declarations: [AppComponent, InitalPageComponent, ForecastPageComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
