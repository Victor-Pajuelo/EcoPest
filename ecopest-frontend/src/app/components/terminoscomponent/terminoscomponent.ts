import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';

// Pagina publica con los terminos y condiciones de uso de EcoPest
@Component({
  selector: 'app-terminoscomponent',
  imports: [RouterLink, MatButtonModule],
  templateUrl: './terminoscomponent.html',
  styleUrl: './terminoscomponent.css',
})
export class Terminoscomponent {}
