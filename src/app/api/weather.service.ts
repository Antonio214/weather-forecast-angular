import { Injectable } from '@angular/core';
import { ForecastStampData } from './openweather-types';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, map, Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs';
import { apiKey, baseUrl } from './openweather-constants';

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
  constructor(private http: HttpClient) {}

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

  returnLesserBetween(value1: number, value2: number) {
    return value1 < value2 ? value1 : value2;
  }

  returnGreatherBetween(value1: number, value2: number) {
    return value1 > value2 ? value1 : value2;
  }

  getWeatherFrom(first: ForecastStampData): WeatherResumeTypes {
    return first.weather[0].main as WeatherResumeTypes;
  }

  getDateInfoFrom(firstStamp: ForecastStampData): {
    formattedDate: string;
    formattedWeekDay: string;
  } {
    const date = new Date(firstStamp.dt * 1000);
    const formattedDate = this.formatDate(date);
    const formattedWeekDay = this.formatWeekDay(date);

    return { formattedDate, formattedWeekDay };
  }

  getMinTempFrom(day: ForecastStampData[], firstStamp: ForecastStampData) {
    return day.reduce(
      (min, stamp) => this.returnLesserBetween(min, stamp.main.temp),
      firstStamp.main.temp
    );
  }

  getMaxTempFrom(day: ForecastStampData[], firstStamp: ForecastStampData) {
    return day.reduce(
      (max, stamp) => this.returnGreatherBetween(max, stamp.main.temp),
      firstStamp.main.temp
    );
  }

  getAvarageTempFrom(
    day: ForecastStampData[],
    firstStamp: ForecastStampData,
    numOfStamps: number
  ) {
    const totalSum = day.reduce(
      (sum, stamp) => sum + stamp.main.temp,
      firstStamp.main.temp
    );
    const averageTemperature = totalSum / numOfStamps;

    return averageTemperature;
  }

  getTempInfoFrom(
    day: ForecastStampData[],
    firstStamp: ForecastStampData,
    numOfStamps: number
  ): { minTemp: any; maxTemp: any; averageTemp: any } {
    const minTemp = this.getMinTempFrom(day, firstStamp);
    const maxTemp = this.getMaxTempFrom(day, firstStamp);
    const averageTemp = this.getAvarageTempFrom(day, firstStamp, numOfStamps);

    return {
      minTemp,
      maxTemp,
      averageTemp,
    };
  }

  tranformDayStampsInDayForecast(day: ForecastStampData[]): DayForecast {
    const numOfStamps = day.length;
    const firstStamp = day.shift()!;

    const { minTemp, maxTemp, averageTemp } = this.getTempInfoFrom(
      day,
      firstStamp,
      numOfStamps
    );

    const { formattedDate, formattedWeekDay } =
      this.getDateInfoFrom(firstStamp);
    const weather: WeatherResumeTypes = this.getWeatherFrom(firstStamp);
    const description: string = this.getDescriptionFromWeather(weather);

    return {
      minTemperature: this.convertFromKelvinToCelsius(minTemp),
      maxTemperature: this.convertFromKelvinToCelsius(maxTemp),
      averageTemperature: this.convertFromKelvinToCelsius(averageTemp),
      resume: weather,
      description: description,
      formattedDate,
      weekDay: formattedWeekDay,
    };
  }

  transforResponse(response: any) {
    let forecast: ForecastResponse = {
      success: false,
      days: [],
    };

    if (response.cod == '200') {
      forecast.success = true;

      const forecastsByDay = this.splitByDay(response.list.slice(0));

      forecast.days = forecastsByDay.map((day) =>
        this.tranformDayStampsInDayForecast(day)
      );
    }

    return forecast;
  }

  getForecastFor(brasilianCity: string): Observable<ForecastResponse> {
    const forecastUrl = `${baseUrl}/data/2.5/forecast?lat=-22.90556&lon=-47.06083&appid=${apiKey}`;

    const observable = this.http
      .get<any>(forecastUrl)
      .pipe(map((response) => this.transforResponse(response)));

    return observable;
  }
}
