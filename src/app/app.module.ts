import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { InitalPageComponent } from './inital-page/inital-page.component';
import { ForecastPageComponent } from './forecast-page/forecast-page.component';
import { WeatherServiceAbstract } from './weather-service';
import { WeatherService } from './api/weather.service';
import { WeatherMockService } from './mock/weather-mock.service';

const production = [
  { provide: WeatherServiceAbstract, useClass: WeatherService },
];

const development = [
  {
    provide: WeatherServiceAbstract,
    useClass: WeatherMockService,
  },
];

@NgModule({
  declarations: [AppComponent, InitalPageComponent, ForecastPageComponent],
  imports: [BrowserModule, AppRoutingModule, HttpClientModule],
  providers: [...development],
  bootstrap: [AppComponent],
})
export class AppModule {}
