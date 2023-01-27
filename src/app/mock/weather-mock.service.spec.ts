import { TestBed } from '@angular/core/testing';

import { WeatherMockService } from './weather-mock.service';

describe('WeatherMockService', () => {
  let service: WeatherMockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WeatherMockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
