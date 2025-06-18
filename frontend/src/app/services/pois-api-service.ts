import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, switchMap, take } from 'rxjs';

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
  constructor(private http: HttpClient) {}

  getPois(): Observable<Poi[]>{
    return this.http.get<Poi[]>('/frontend/api/pois');
  }

  getPoisInRadius(
    amenity: string,
    lat: number,
    lon: number,
    radius: number
  ): Observable<Poi[]> {
    let params = new HttpParams()
      .set('center_latitude', lat.toString())
      .set('center_longitude', lon.toString())
      .set('radius', radius.toString());

    if (amenity) {
      params = params.set('category', amenity);
    }

    return this.http.get<Poi[]>('/frontend/api/pois', { params });
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>('/frontend/api/categories');
  }
}
