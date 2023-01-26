import { TestBed } from '@angular/core/testing';
import { example } from 'src/assets/mocks/exampleForecastCampinas';
import { exampleSplitted } from 'src/assets/mocks/exampleSplittedByDay';

import { WeatherService } from './weather.service';

describe('WeatherService', () => {
  let service: WeatherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeatherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should split according to date', () => {
    const rawData = example.list;

    const result = service.splitByDay(rawData);
    expect(result).toEqual(exampleSplitted);
  });

  it('should return 5days forecast for a city', () => {
    const data = service.getForecastFor('campinas');

    expect(data.success).toBeTrue();
    expect(data.days.length).toBe(6);
  });
});
