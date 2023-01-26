import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { WeatherService } from './weather.service';
import { example } from 'src/assets/mocks/exampleForecastCampinas';
import { apiKey, baseUrl } from './openweather-constants';

describe('WeatherService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  let service: WeatherService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });

    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(WeatherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return 5days forecast for a city', () => {
    const observable = service.getForecastFor('campinas');
    observable.subscribe((data) => {
      expect(data.success).toBeTrue();
      expect(data.days.length).toBe(6);
      expect(data.days[0].minTemperature).toBe('24.04');
      expect(data.days[0].maxTemperature).toBe('29.89');
      expect(data.days[0].averageTemperature).toBe('27.51');
      expect(data.days[0].resume).toBe('Clouds');
      expect(data.days[0].formattedDate).toBe('25 de Janeiro');
      expect(data.days[0].weekDay).toBe('Quarta-Feira');
      expect(data.days[0].description).toBe(
        'Hoje vai estar nublado, mas não deixe isso estragar seu dia! Aproveite para fazer atividades indoor ou pegue um guarda-chuva para se divertir ao ar livre.'
      );
    });

    const req = httpTestingController.expectOne(
      `${baseUrl}/data/2.5/forecast?lat=-22.90556&lon=-47.06083&appid=${apiKey}`
    );
    req.flush(example);
  });
});
