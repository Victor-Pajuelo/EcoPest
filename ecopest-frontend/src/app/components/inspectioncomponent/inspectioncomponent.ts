import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menucomponent } from '../menucomponent/menucomponent';

@Component({
  selector: 'app-inspection',
  imports: [Menucomponent, RouterOutlet],
  templateUrl: './inspectioncomponent.html',
  styleUrl: './inspectioncomponent.css',
})
export class Inspectioncomponent {}
