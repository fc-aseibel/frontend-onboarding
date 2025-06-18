import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, switchMap, take } from 'rxjs';
import { AppConfigService } from './app-config-service';

export interface Poi {
  id: number;
  name: string;
  lat: number;
  lon: number;
  amenity?: string;
}

@Injectable({
  providedIn: 'root',
})
export class PoisApiService {
  constructor(private http: HttpClient, private config: AppConfigService) {}

  private getBaseUrl(): Observable<string> {
    return this.config.apiBaseUrl$.pipe(take(1));
  }

  getPois() {
    return this.getBaseUrl().pipe(
      switchMap(baseUrl => this.http.get<Poi[]>(`${baseUrl}/pois`))
    );
  }

  getPoisInRadius(
    amenity: string,
    lat: number,
    lon: number,
    radius: number
  ): Observable<Poi[]> {
    let params = new HttpParams()
      .set('lat', lat.toString())
      .set('lon', lon.toString())
      .set('radius', radius.toString());

    if (amenity) {
      params = params.set('amenity', amenity);
    }

    return this.getBaseUrl().pipe(
      switchMap(baseUrl => this.http.get<Poi[]>(`${baseUrl}/pois-in-radius`, { params }))
    );
  }

  getCategories(): Observable<string[]> {
    return this.getBaseUrl().pipe(
      switchMap(baseUrl => this.http.get<string[]>(`${baseUrl}/categories`))
    );
  }
}
