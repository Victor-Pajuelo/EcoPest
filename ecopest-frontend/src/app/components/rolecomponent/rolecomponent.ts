import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menucomponent } from '../menucomponent/menucomponent';

@Component({
  selector: 'app-role',
  imports: [Menucomponent, RouterOutlet],
  templateUrl: './rolecomponent.html',
  styleUrl: './rolecomponent.css',
})
export class Rolecomponent {}
