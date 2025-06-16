import { Component, AfterViewInit } from '@angular/core';
import { PoisApiService } from '../../services/pois-api-service';
import { PoiFilter } from '../poi-filter/poi-filter';


import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  imports: [PoiFilter],
  templateUrl: './map.html',
  styleUrl: './map.css'
})

export class Map implements AfterViewInit {

  private map!: L.Map;
  private currentMarker: L.Marker = new L.Marker([53.5511, 9.9937]);
  private currentCircle?: L.Circle;
  private poisMarkers: L.Marker[] = [];
  private amenity: string = 'restaurant'; // Beispielwert, kann angepasst werden
  private radiusInKm: number = 1;

  constructor(private poisService: PoisApiService) {}

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap() {
    this.map = L.map('map', { doubleClickZoom: false }).setView(this.currentMarker.getLatLng(), 13);
    
    L.Icon.Default.imagePath = 'assets/images/';

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Startmarker setzen
    this.currentMarker.addTo(this.map)
      .bindPopup('Your current position: ' + this.currentMarker.getLatLng().lat.toFixed(5) + ', ' + this.currentMarker.getLatLng().lng.toFixed(5))
      .openPopup();

    // Marker bei Doppelklick setzen, alte Position entfernen
    this.map.on('dblclick', (e: L.LeafletMouseEvent) => {
      this.doubleClickHandler(e);
    });
  }

  public doubleClickHandler(e: L.LeafletMouseEvent) {
    if (this.currentMarker) {
      this.map.removeLayer(this.currentMarker);
    }

    if (this.currentCircle) {
      this.map.removeLayer(this.currentCircle);
    }

    this.removePoisMarkers();

    this.currentMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(this.map)
      .bindPopup('Neue Position: ' + e.latlng.lat.toFixed(5) + ', ' + e.latlng.lng.toFixed(5))
      .openPopup();

    this.setCircleMarker(e.latlng.lat, e.latlng.lng, this.radiusInKm);

    this.loadPois(this.amenity, e.latlng.lat, e.latlng.lng, this.radiusInKm); 
  }


  private removePoisMarkers() {
    this.poisMarkers.forEach(marker => {
      this.map.removeLayer(marker);
    });
    this.poisMarkers = [];
  }

  private setCircleMarker(lat: number, lon: number, radiusInKm: number) {
    if (this.currentCircle) {
      this.map.removeLayer(this.currentCircle);
    }
    
    this.currentCircle = L.circle([lat, lon], {
      radius: radiusInKm * 1000,  // km ➜ m
      color: '#007bff',
      fillColor: '#007bff',
      fillOpacity: 0.1
    }).addTo(this.map);
  }	


  applyFilter(filter: { amenity: string, radius: number }) {
    this.amenity = filter.amenity;
    this.radiusInKm = filter.radius;

    const lat = this.currentMarker?.getLatLng().lat ?? 53.5511;
    const lon = this.currentMarker?.getLatLng().lng ?? 9.9937;

    this.removePoisMarkers();
    this.poisService.getPoisInRadius(filter.amenity, lat, lon, filter.radius).subscribe(pois => {
      pois.forEach(poi => {
        const marker = L.marker([poi.lat, poi.lon])
          .addTo(this.map)
          .bindPopup(`${poi.name} (${poi.lat.toFixed(5)}, ${poi.lon.toFixed(5)})`);
        this.poisMarkers.push(marker);
      });
    });

    this.setCircleMarker(lat, lon, filter.radius);
  }

  private loadPois(amenity: string, lat: number, lon: number, radiusInKm: number) {
    this.poisService.getPoisInRadius(amenity, lat, lon, radiusInKm).subscribe({
      next: pois => {
        pois.forEach(poi => {
          const marker = L.marker([poi.lat, poi.lon])
            .addTo(this.map)
            .bindPopup(`${poi.name} (${poi.lat.toFixed(5)}, ${poi.lon.toFixed(5)})`);
          this.poisMarkers.push(marker);
        });
      },
      error: err => {
        console.error('Error loading POIs:', err);
      }
    });
  }
}


