import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menucomponent } from '../menucomponent/menucomponent';

@Component({
  selector: 'app-weather',
  imports: [Menucomponent, RouterOutlet],
  templateUrl: './weathercomponent.html',
  styleUrl: './weathercomponent.css',
})
export class Weathercomponent {}
