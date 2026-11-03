import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '../../i18n/translatepipe';

@Component({
  selector: 'app-notfound',
  imports: [RouterLink, MatButtonModule, TranslatePipe],
  template: `
    <section class="page">
      <h1>404 · {{ 'notfound.title' | t }}</h1>
      <p>{{ 'notfound.text' | t }}</p>
      <a mat-flat-button routerLink="/">{{ 'menu.home' | t }}</a>
    </section>
  `,
})
export class Notfoundcomponent {}
