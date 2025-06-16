import { Component, EventEmitter, Output, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { PoisApiService } from '../../services/pois-api-service';
import { CommonModule } from '@angular/common';

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
    this.api.getCategories().subscribe({
      next: cats => this.categories = cats,
      error: err => console.error('Fehler beim Laden der Kategorien:', err)
    });
  }

  onSubmit() {
    this.filterChanged.emit(this.form.value as { amenity: string, radius: number });
  }
}