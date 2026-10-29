import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '../../i18n/translatepipe';

@Component({
  selector: 'app-terms',
  imports: [RouterLink, MatButtonModule, TranslatePipe],
  templateUrl: './termscomponent.html',
  styleUrl: './termscomponent.css',
})
export class Termscomponent {
  sections = [1, 2, 3, 4, 5, 6];
}
