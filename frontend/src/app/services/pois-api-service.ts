import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Poi {
  id: number;
  name: string;
  lat: number;
  lon: number;
  amenity?: string;
}

@Injectable({
  providedIn: 'root', // This makes the service available application-wide
})
export class PoisApiService {
  private readonly BASE_URL = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  getPois() {
    return this.http.get<Poi[]>(`${this.BASE_URL}/pois`);
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

    return this.http.get<Poi[]>(`${this.BASE_URL}/pois-in-radius`, { params });
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.BASE_URL}/categories`);
  }
}
