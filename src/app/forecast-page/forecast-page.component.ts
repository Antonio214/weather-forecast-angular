import { Component, Type } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  DayForecast,
  ForecastResponse,
  WeatherResumeTypes,
} from '../api/weather.service';
import { WeatherServiceAbstract } from '../weather-service';

@Component({
  selector: 'app-forecast-page',
  templateUrl: './forecast-page.component.html',
  styleUrls: ['./forecast-page.component.scss'],
})
export class ForecastPageComponent {
  cityValue: string = '';
  private routeSub: any;
  private forecastSub: any;
  forecastResponse?: ForecastResponse;

  constructor(
    private route: ActivatedRoute,
    private weatherService: WeatherServiceAbstract
  ) {}

  get city() {
    const cityNames = {
      '': '',
      campinas: 'Campinas, SP',
      'são paulo': 'São Paulo, SP',
      varginha: 'Varginha, MG',
    };

    return Object.keys(cityNames).includes(this.cityValue)
      ? cityNames[this.cityValue as keyof typeof cityNames]
      : this.cityValue;
  }

  getTemperatureRange(day: DayForecast) {
    return `${day.minTemperature}°/${day.maxTemperature}°`;
  }

  getWeatherImage(weather: WeatherResumeTypes) {
    const weatherToImage = {
      Thunderstorm: 'StormWeatherImg.png',
      Clouds: 'CloudsWeatherImg.png',
      Drizzle: 'DrizzleWeatherImg.png',
      Rain: 'RainWeatherImg.png',
      Snow: 'SnowWeatherImg.png',
      Clear: 'SunWeatherImg.png',
    };

    const url = `/assets/images/${weatherToImage[weather]}`;
    return url;
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params) => {
      this.cityValue = params['name'];
      this.forecastSub = this.weatherService
        .getForecastFor(this.cityValue)
        .subscribe((data) => {
          console.log(data);
          this.forecastResponse = data;
        });
    });
  }

  ngOnDestroy() {
    this.routeSub.unsubscribe();
    this.forecastSub.unsubscribe();
  }
}
