import { Observable } from 'rxjs';
import { ForecastResponse } from './api/weather.service';

export abstract class WeatherServiceAbstract {
  public abstract getForecastFor(city: string): Observable<ForecastResponse>;
}
