import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, switchMap, take } from 'rxjs';
import { environment } from '../../environments/environment';

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
readonly targetUrl = environment.targetUrl;
constructor(private http: HttpClient) {}

  getPois(): Observable<Poi[]>{
    return this.http.get<Poi[]>(`${this.targetUrl}/pois`);
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

    return this.http.get<Poi[]>(`${this.targetUrl}/pois`, { params });
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.targetUrl}/categories`);
  }
}
