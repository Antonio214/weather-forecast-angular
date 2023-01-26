import { Injectable } from '@angular/core';
import { example } from 'src/assets/mocks/exampleForecastCampinas';
import { ForecastStampData } from './openweather-types';

type DayForecast = {
  minTemperature: number;
  maxTemperature: number;
  averageTemperature: number;
  resume: string;
  description: string;
  formattedDate: string;
  weekDay: string;
};

type ForecastResponse = {
  success: boolean;
  message?: string;
  days: DayForecast[];
};

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor() {}

  splitByDay(rawData: ForecastStampData[]): ForecastStampData[][] {
    let splitedByDay = Array();

    if (rawData.length == 0) return splitedByDay;

    const first = rawData.shift()!;
    const lastSameAsBaseDate = rawData.reduce(
      (sameAsBaseDate, current) => {
        const currentDate = new Date(current.dt * 1000);
        let baseDate = new Date(sameAsBaseDate[0].dt * 1000);

        if (currentDate.getDate() == baseDate.getDate()) {
          sameAsBaseDate.push(current);
        } else {
          splitedByDay.push(sameAsBaseDate);
          sameAsBaseDate = [];
          baseDate = currentDate;
          sameAsBaseDate.push(current);
        }

        return sameAsBaseDate;
      },
      [first]
    );

    splitedByDay.push(lastSameAsBaseDate);

    return splitedByDay;
  }

  getForecastFor(brasilianCity: string): ForecastResponse {
    let forecast: ForecastResponse = {
      success: false,
      days: [],
    };

    const data = example;

    if (data.cod == '200') {
      forecast.success = true;
    }

    return forecast;
  }
}
