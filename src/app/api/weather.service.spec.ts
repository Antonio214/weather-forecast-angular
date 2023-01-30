import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';

import { WeatherService } from './weather.service';
import { example } from 'src/assets/mocks/exampleForecastCampinas';
import {
  apiKey,
  baseUrl,
  urlForCampinas,
  urlForSaoPaulo,
  urlForVarginha,
} from './openweather-constants';

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

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return 5days forecast for a city', () => {
    const observable = service.getForecastFor('campinas');
    observable.subscribe((data) => {
      expect(data.success).toBeTrue();
      expect(data.days.length).toBe(6);
      expect(data.days[0].minTemperature).toBe('24');
      expect(data.days[0].maxTemperature).toBe('30');
      expect(data.days[0].averageTemperature).toBe('28');
      expect(data.days[0].resume).toBe('Clouds');
      expect(data.days[0].formattedDate).toBe('25 de Janeiro');
      expect(data.days[0].weekDay).toBe('Quarta-Feira');
      expect(data.days[0].description).toBe(
        'Hoje vai estar nublado, mas não deixe isso estragar seu dia! Aproveite para fazer atividades indoor.'
      );
    });

    const req = httpTestingController.expectOne(urlForCampinas);
    req.flush(example);
  });

  it('should return false forecast on error', () => {
    const observable = service.getForecastFor('campinas');
    observable.subscribe((data) => {
      expect(data.success).toBeFalse();
      expect(data.message).toBeDefined();
    });

    const req = httpTestingController.expectOne(urlForCampinas);
    req.flush({ cod: '400' });
  });

  it('should call correct endpoint for Campinas', () => {
    const observable = service.getForecastFor('campinas');

    observable.subscribe((data) => {
      expect(data.success).toBe(true);
      expect(data.days.length).toBeGreaterThan(0);
    });

    const req = httpTestingController.expectOne(urlForCampinas);
    req.flush(example);
  });

  it('should call correct endpoint for São Paulo', () => {
    const observable = service.getForecastFor('são paulo');

    observable.subscribe((data) => {
      expect(data.success).toBe(true);
      expect(data.days.length).toBeGreaterThan(0);
    });

    const req = httpTestingController.expectOne(urlForSaoPaulo);

    req.flush(example);
  });

  it('should call correct endpoint for Varginha', () => {
    const observable = service.getForecastFor('varginha');

    observable.subscribe((data) => {
      expect(data.success).toBe(true);
      expect(data.days.length).toBeGreaterThan(0);
    });

    const req = httpTestingController.expectOne(urlForVarginha);

    req.flush(example);
  });

  it('should not call endpoint and return false forecast for not valid name', () => {
    const observable = service.getForecastFor('');

    observable.subscribe((data) => {
      console.log(data);
      expect(data.success).toBe(false);
      expect(data.message).toBeDefined();
      expect(data.days.length).toBe(0);
    });
  });
});
