import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Map } from './map';
import { PoisApiService } from '../../services/pois-api-service';
import { of } from 'rxjs';
import * as L from 'leaflet';

describe('Map', () => {
  let component: Map;
  let fixture: ComponentFixture<Map>;
  let poisServiceSpy: jasmine.SpyObj<PoisApiService>;

  beforeEach(async () => {
    // ✅ Spy HIER erstellen, damit du pro Test frischen Spy hast
    poisServiceSpy = jasmine.createSpyObj('PoisApiService', ['getPoisInRadius', 'getCategories']);
    poisServiceSpy.getPoisInRadius.and.returnValue(of([]));
    poisServiceSpy.getCategories.and.returnValue(of([]));

    await TestBed.configureTestingModule({
      imports: [Map],
      providers: [
        { provide: PoisApiService, useValue: poisServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(Map);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize map', () => {
    expect(component['map']).toBeDefined();
    expect(component['currentMarker']).toBeDefined();
  });

  it('should handle doubleClickHandler correctly', () => {
    const lat = 53.55;
    const lon = 9.99;
    const event = { latlng: L.latLng(lat, lon) } as L.LeafletMouseEvent;

    component.doubleClickHandler(event);

    expect(component['currentMarker'].getLatLng().lat).toBeCloseTo(lat, 5);
    expect(component['currentCircle']).toBeDefined();
    expect(poisServiceSpy.getPoisInRadius).toHaveBeenCalled();
  });

  it('should apply filter and update radius & amenity', () => {
    const filter = { amenity: 'cafe', radius: 2 };
    component.applyFilter(filter);

    expect(component['amenity']).toBe(filter.amenity);
    expect(component['radiusInKm']).toBe(filter.radius);
    expect(component['currentCircle']).toBeDefined();
    expect(poisServiceSpy.getPoisInRadius).toHaveBeenCalled();
  });

  it('should clear old markers when removePoisMarkers is called', () => {
    // Fake: Add dummy markers
    const dummy = L.marker([53.55, 9.99]);
    component['poisMarkers'] = [dummy];
    component['map'].addLayer(dummy);

    // Verify added
    expect(component['map'].hasLayer(dummy)).toBeTrue();

    // Remove
    component['removePoisMarkers']();

    expect(component['poisMarkers'].length).toBe(0);
    expect(component['map'].hasLayer(dummy)).toBeFalse();
  });
});
