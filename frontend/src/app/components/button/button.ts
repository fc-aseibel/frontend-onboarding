import { Component, EventEmitter, Input, Output } from '@angular/core';
import { faCoffee } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
  selector: 'app-button',
  imports: [FontAwesomeModule],
  templateUrl: './button.html',
  styleUrl: './button.css'
})

export class Button {
  faCoffee = faCoffee;
  @Input() label: string = 'Click Me';
  @Output() btnClick = new EventEmitter<void>();

  onClick() {
    this.btnClick.emit();
  }
}
