import { Component, AfterViewInit } from '@angular/core';
import * as L from 'leaflet';

@Component({
  selector: 'app-map',
  imports: [],
  templateUrl: './map.html',
  styleUrl: './map.css'
})
export class Map implements AfterViewInit {
  private map!: L.Map;
  private currentMarker?: L.Marker;

  ngAfterViewInit(): void {
    this.initMap();
  }

  private initMap() {
    this.map = L.map('map', { doubleClickZoom: false }).setView([51.505, -0.09], 13);
    
    L.Icon.Default.imagePath = 'assets/images/';

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(this.map);

    // Startmarker setzen
    this.currentMarker = L.marker([51.505, -0.09]).addTo(this.map)
      .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
      .openPopup();

    // Marker bei Doppelklick setzen, alte Position entfernen
    this.map.on('dblclick', (e: L.LeafletMouseEvent) => {
      if (this.currentMarker) {
        this.map.removeLayer(this.currentMarker);
      }
      this.currentMarker = L.marker([e.latlng.lat, e.latlng.lng]).addTo(this.map)
        .bindPopup('Neue Position: ' + e.latlng.lat.toFixed(5) + ', ' + e.latlng.lng.toFixed(5))
        .openPopup();
    });
  }
}
