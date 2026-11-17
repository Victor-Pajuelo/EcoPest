import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menucomponent } from '../menucomponent/menucomponent';

@Component({
  selector: 'app-business',
  imports: [Menucomponent, RouterOutlet],
  templateUrl: './businesscomponent.html',
  styleUrl: './businesscomponent.css',
})
export class Businesscomponent {}
