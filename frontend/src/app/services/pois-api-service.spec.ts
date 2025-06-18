import { TestBed } from '@angular/core/testing';
import { PoisApiService, Poi } from './pois-api-service';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

describe('PoisApiService', () => {
  let service: PoisApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        PoisApiService
      ]
    })

    service = TestBed.inject(PoisApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch all POIs', () => {
    const mockPois: Poi[] = [
      { id: 1, name: 'POI 1', lat: 1, lon: 2 },
      { id: 2, name: 'POI 2', lat: 3, lon: 4 }
    ];

    service.getPois().subscribe(pois => {
      expect(pois).toEqual(mockPois);
    });

    const req = httpMock.expectOne('/frontend/api/pois');
    expect(req.request.method).toBe('GET');
    req.flush(mockPois);
  });

  it('should fetch POIs in radius with amenity', () => {
    const mockPois: Poi[] = [{ id: 1, name: 'Cafe', lat: 1, lon: 2, amenity: 'cafe' }];

    service.getPoisInRadius('cafe', 53.5, 10.0, 1).subscribe(pois => {
      expect(pois).toEqual(mockPois);
    });

    const req = httpMock.expectOne(r =>
      r.url === '/frontend/api/pois' &&
      r.params.get('category') === 'cafe' &&
      r.params.get('center_latitude') === '53.5' &&
      r.params.get('center_longitude') === '10' &&
      r.params.get('radius') === '1'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockPois);
  });

  it('should fetch POIs in radius without amenity', () => {
    const mockPois: Poi[] = [{ id: 1, name: 'Any', lat: 1, lon: 2 }];

    service.getPoisInRadius('', 53.5, 10.0, 1).subscribe(pois => {
      expect(pois).toEqual(mockPois);
    });

    const req = httpMock.expectOne(r =>
      r.url === '/frontend/api/pois' &&
      r.params.get('category') === null &&
      r.params.get('center_latitude') === '53.5' &&
      r.params.get('center_longitude') === '10' &&
      r.params.get('radius') === '1'
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockPois);
  });

  it('should fetch categories', () => {
    const mockCats = ['cafe', 'restaurant'];

    service.getCategories().subscribe(cats => {
      expect(cats).toEqual(mockCats);
    });

    const req = httpMock.expectOne('/frontend/api/categories');
    expect(req.request.method).toBe('GET');
    req.flush(mockCats);
  });
});
