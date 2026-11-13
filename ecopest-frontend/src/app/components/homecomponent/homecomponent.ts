import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Menucomponent } from '../menucomponent/menucomponent';
import { Climacomponent } from '../climacomponent/climacomponent';

@Component({
  selector: 'app-homecomponent',
  imports: [Menucomponent, MatIconModule, Climacomponent],
  templateUrl: './homecomponent.html',
  styleUrl: './homecomponent.css',
})
export class Homecomponent {

  integrantes: any[] = [
    { nombre: 'Victor Pajuelo', rol: 'Integrante' },
    { nombre: 'Nicolás Sarango', rol: 'Integrante' },
    { nombre: 'Adriano', rol: 'Integrante' },
    { nombre: 'Jordan', rol: 'Integrante' },
  ];
}
