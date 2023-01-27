import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DayForecast, ForecastResponse } from '../api/weather.service';
import { WeatherServiceAbstract } from '../weather-service';

@Component({
  selector: 'app-forecast-page',
  templateUrl: './forecast-page.component.html',
  styleUrls: ['./forecast-page.component.scss'],
})
export class ForecastPageComponent {
  city: string = '';
  private routeSub: any;
  private forecastSub: any;
  forecastResponse?: ForecastResponse;

  constructor(
    private route: ActivatedRoute,
    private weatherService: WeatherServiceAbstract
  ) {}

  getTemperatureRange(day: DayForecast) {
    return `${day.minTemperature}°/${day.maxTemperature}°`;
  }

  ngOnInit() {
    this.routeSub = this.route.params.subscribe((params) => {
      this.city = params['name'];
      this.forecastSub = this.weatherService
        .getForecastFor(this.city)
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
