import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Menucomponent } from './components/menucomponent/menucomponent';
import { Footercomponent } from './components/footercomponent/footercomponent';
import { TranslatePipe } from './i18n/translatepipe';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Menucomponent, Footercomponent, TranslatePipe],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {}
