import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DayForecast, ForecastResponse } from '../api/weather.service';

@Component({
  selector: 'app-forecast-page',
  templateUrl: './forecast-page.component.html',
  styleUrls: ['./forecast-page.component.scss'],
})
export class ForecastPageComponent {
  city: string = '';
  private sub: any;
  daysForecast: any[] = [];

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.daysForecast = [{}, {}, {}, {}, {}, {}];
    this.sub = this.route.params.subscribe((params) => {
      this.city = params['name'];
    });
  }
}
