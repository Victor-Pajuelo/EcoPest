import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menucomponent } from '../menucomponent/menucomponent';

@Component({
  selector: 'app-evidence',
  imports: [Menucomponent, RouterOutlet],
  templateUrl: './evidencecomponent.html',
  styleUrl: './evidencecomponent.css',
})
export class Evidencecomponent {}
