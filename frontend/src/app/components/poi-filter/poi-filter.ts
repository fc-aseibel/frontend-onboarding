import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PoisApiService } from '../../services/pois-api-service';
import { CommonModule } from '@angular/common';
import { tap } from 'rxjs/internal/operators/tap';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-poi-filter',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './poi-filter.html',
  styleUrl: './poi-filter.css'
})

export class PoiFilter implements OnInit {
  private fb = inject(FormBuilder);
  private api = inject(PoisApiService);

  @Output() filterChanged = new EventEmitter<{ amenity: string, radius: number }>();

  categories: string[] = [];
  form = this.fb.group({
    amenity: [''],
    radius: [1]
  });

  ngOnInit() {
    console.log('Initializing PoiFilter ...');
    
    this.api.getCategories().pipe(
      tap(cats => console.log('Loaded categories:', cats)),
      catchError(err => {
        console.error('Fehler beim Laden der Kategorien:', err);
        return of(['lounge', 'restaurant', 'cafe', 'bar', 'fast_food', 'nightclub', 'galerie']);
      })
    ).subscribe(cats => {
      this.categories = cats;
      console.log('PoiFilter initialized with categories:', this.categories);
    });

    console.log('PoiFilter initialized with categories:', this.categories);
  }

  onSubmit() {
    this.filterChanged.emit(this.form.value as { amenity: string, radius: number });
  }
}