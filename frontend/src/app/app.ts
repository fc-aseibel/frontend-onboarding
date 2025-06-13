import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './components/header/header'; 
import { Map } from './components/map/map';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome'; 

 @Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Map, FontAwesomeModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected title: string = 'Onboarding';
}

