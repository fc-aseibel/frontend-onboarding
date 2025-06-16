import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PoiFilter } from './poi-filter';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PoisApiService } from '../../services/pois-api-service';
import { of, throwError } from 'rxjs';

describe('PoiFilter', () => {
  let component: PoiFilter;
  let fixture: ComponentFixture<PoiFilter>;
  let apiSpy: jasmine.SpyObj<PoisApiService>;

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('PoisApiService', ['getCategories']);

    await TestBed.configureTestingModule({
      imports: [PoiFilter, HttpClientTestingModule],
      providers: [
        { provide: PoisApiService, useValue: apiSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PoiFilter);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories on init', () => {
    const mockCats = ['cafe', 'restaurant'];
    apiSpy.getCategories.and.returnValue(of(mockCats));

    component.ngOnInit();

    expect(apiSpy.getCategories).toHaveBeenCalled();
    expect(component.categories).toEqual(mockCats);
  });

  it('should handle error on getCategories', () => {
    const consoleSpy = spyOn(console, 'error');
    apiSpy.getCategories.and.returnValue(throwError(() => new Error('API Error')));

    component.ngOnInit();

    expect(apiSpy.getCategories).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith(
      'Fehler beim Laden der Kategorien:',
      jasmine.any(Error)
    );
  });

  it('should emit filterChanged on submit', () => {
    const emitSpy = spyOn(component.filterChanged, 'emit');

    // Simuliere User-Werte
    component.form.setValue({ amenity: 'cafe', radius: 5 });
    component.onSubmit();

    expect(emitSpy).toHaveBeenCalledWith({ amenity: 'cafe', radius: 5 });
  });
});
