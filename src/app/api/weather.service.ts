import { getLocaleMonthNames } from '@angular/common';
import { Injectable } from '@angular/core';
import { example } from 'src/assets/mocks/exampleForecastCampinas';
import { ForecastStampData } from './openweather-types';

type WeatherResumeTypes =
  | 'Thunderstorm'
  | 'Clouds'
  | 'Drizzle'
  | 'Rain'
  | 'Snow'
  | 'Clear'
  | 'Clouds';

type DayForecast = {
  minTemperature: string;
  maxTemperature: string;
  averageTemperature: string;
  resume: WeatherResumeTypes;
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

  convertFromKelvinToCelsius(kelvin: number): string {
    return (kelvin - 273.15).toFixed(2);
  }

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

  formatDate(date: Date) {
    const day = date.getDate();
    const months = [
      'Janeiro',
      'Fevereiro',
      'Março',
      'Abril',
      'Maio',
      'Junho',
      'Julho',
      'Agosto',
      'Setembro',
      'Outubro',
      'Novembro',
      'Dezembro',
    ];

    return `${day < 10 ? `0${day}` : day} de ${months[date.getMonth()]}`;
  }

  formatWeekDay(date: Date) {
    const weekDays = [
      'Domingo',
      'Segunda-Feira',
      'Terça-Feira',
      'Quarta-Feira',
      'Quinta-Feira',
      'Sexta-Feira',
      'Sábado',
    ];

    return weekDays[date.getDay()];
  }

  getDescriptionFromWeather(weather: WeatherResumeTypes): string {
    console.log(weather);

    switch (weather) {
      case 'Thunderstorm':
        return 'Cuidado, hoje vai ter tempestade! Fique atento as previsões meteorológicas e evite sair se não for necessário. Se precisar sair, leve um guarda-chuva e não se exponha à raios.';
      case 'Snow':
        return 'Hoje vai nevar! Se você precisar sair, lembre-se de usar roupas quentes e calçado adequado para neve. Se possível, evite dirigir em condições de neve para garantir sua segurança.';
      case 'Rain':
        return 'Hoje vai chover, lembre-se de levar um guarda-chuva e se proteja. Se possível evite sair durante a forte chuva, e se precisar sair, evite trafegar em áreas de alagamento.';
      case 'Drizzle':
        return '';
      case 'Clouds':
        return 'Hoje vai estar nublado, mas não deixe isso estragar seu dia! Aproveite para fazer atividades indoor ou pegue um guarda-chuva para se divertir ao ar livre.';
      case 'Clear':
        return 'Hoje vai ser um dia lindo e ensolarado! Aproveite para sair e aproveitar o sol, seja dando um passeio, praticando esportes ou tendo um piquenique no parque.';
      default:
        return 'Hoje o clima será imprevisível, pode haver variações de temperatura e possíveis precipitações. É importante ficar atento as previsões meteorológicas e se preparar para qualquer eventualidade.';
    }
  }

  getForecastFor(brasilianCity: string): ForecastResponse {
    let forecast: ForecastResponse = {
      success: false,
      days: [],
    };

    const data = example;

    if (data.cod == '200') {
      forecast.success = true;
      const forecastsByDay = this.splitByDay(data.list.slice(0));
      forecast.days = forecastsByDay.map((day) => {
        const first = day.shift()!;

        const minTemp = day.reduce(
          (min, stamp) => (min < stamp.main.temp ? min : stamp.main.temp),
          first.main.temp
        );
        const maxTemp = day.reduce(
          (max, stamp) => (max > stamp.main.temp ? max : stamp.main.temp),
          first.main.temp
        );
        const totalSum = day.reduce(
          (sum, stamp) => sum + stamp.main.temp,
          first.main.temp
        );
        const averageTemperature = totalSum / (day.length + 1); //add one because we shifted firts value;

        const date = new Date(first.dt * 1000);
        const formattedDate = this.formatDate(date);
        const formattedWeekDay = this.formatWeekDay(date);

        const weather: WeatherResumeTypes = first.weather[0]
          .main as WeatherResumeTypes;
        const description: string = this.getDescriptionFromWeather(weather);

        return {
          minTemperature: this.convertFromKelvinToCelsius(minTemp),
          maxTemperature: this.convertFromKelvinToCelsius(maxTemp),
          averageTemperature:
            this.convertFromKelvinToCelsius(averageTemperature),
          resume: first.weather[0].main,
          description: description,
          formattedDate,
          weekDay: formattedWeekDay,
        } as DayForecast;
      });
    }

    return forecast;
  }
}
