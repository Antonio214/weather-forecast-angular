import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { ForecastResponse } from '../api/weather.service';
import { WeatherServiceAbstract } from '../weather-service';

@Injectable({
  providedIn: 'root',
})
export class WeatherMockService implements WeatherServiceAbstract {
  constructor() {}

  private sequenceSubscriber(observer: Observer<ForecastResponse>) {
    const data: ForecastResponse = {
      success: true,
      days: [
        {
          formattedDate: '25 de Janeiro',
          weekDay: 'Terca-Feira',
          minTemperature: '25',
          maxTemperature: '27',
          averageTemperature: '26',
          resume: 'Thunderstorm',
          description:
            'Cuidado, hoje vai ter tempestade! Fique atento as previsões meteorológicas e evite sair se não for necessário.',
        },
        {
          formattedDate: '26 de Janeiro',
          weekDay: 'Quarta-Feira',
          minTemperature: '25',
          maxTemperature: '27',
          averageTemperature: '26',
          resume: 'Snow',
          description:
            'Hoje vai nevar! Se você precisar sair, lembre-se de usar roupas quentes e calçado adequado para neve.',
        },
        {
          formattedDate: '27 de Janeiro',
          weekDay: 'Quinta-Feira',
          minTemperature: '25',
          maxTemperature: '27',
          averageTemperature: '26',
          resume: 'Rain',
          description:
            'Hoje vai chover, lembre-se de levar um guarda-chuva e se proteja. Se possível evite sair durante a forte chuva.',
        },
        {
          formattedDate: '28 de Janeiro',
          weekDay: 'Sexta-Feira',
          minTemperature: '25',
          maxTemperature: '27',
          averageTemperature: '26',
          resume: 'Drizzle',
          description:
            'Hoje vai chover levemente, lembre-se de levar um guarda-chuva, mas não precisa se preocupar muito, as chuvas serão leves.',
        },
        {
          formattedDate: '29 de Janeiro',
          weekDay: 'Sábado',
          minTemperature: '25',
          maxTemperature: '27',
          averageTemperature: '26',
          resume: 'Clouds',
          description:
            'Hoje vai estar nublado, mas não deixe isso estragar seu dia! Aproveite para fazer atividades indoor.',
        },
        {
          formattedDate: '30 de Janeiro',
          weekDay: 'Domingo',
          minTemperature: '25',
          maxTemperature: '27',
          averageTemperature: '26',
          resume: 'Clear',
          description:
            'Hoje vai ser um dia lindo e ensolarado! Aproveite para sair e aproveitar o sol, lembre-se do protetor solar.',
        },
      ],
    };

    const dataError: ForecastResponse = {
      success: false,
      message:
        'Infelizmente algo deu errado com sua requisição. Mas não se preocupe, já estamos trabalhando para corrigir.',
      days: [],
    };

    observer.next(data);
    // observer.next(dataError);
    observer.complete();

    return {
      unsubscribe() {},
    };
  }

  public getForecastFor(city: string): Observable<ForecastResponse> {
    return new Observable(this.sequenceSubscriber);
  }
}
