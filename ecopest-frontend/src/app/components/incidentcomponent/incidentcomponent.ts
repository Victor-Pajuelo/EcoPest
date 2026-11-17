import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menucomponent } from '../menucomponent/menucomponent';

@Component({
  selector: 'app-incident',
  imports: [Menucomponent, RouterOutlet],
  templateUrl: './incidentcomponent.html',
  styleUrl: './incidentcomponent.css',
})
export class Incidentcomponent {}
