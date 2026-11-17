import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menucomponent } from '../menucomponent/menucomponent';

@Component({
  selector: 'app-pest',
  imports: [Menucomponent, RouterOutlet],
  templateUrl: './pestcomponent.html',
  styleUrl: './pestcomponent.css',
})
export class Pestcomponent {}
