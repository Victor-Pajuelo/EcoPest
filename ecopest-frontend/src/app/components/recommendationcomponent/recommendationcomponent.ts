import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menucomponent } from '../menucomponent/menucomponent';

@Component({
  selector: 'app-recommendation',
  imports: [Menucomponent, RouterOutlet],
  templateUrl: './recommendationcomponent.html',
  styleUrl: './recommendationcomponent.css',
})
export class Recommendationcomponent {}
