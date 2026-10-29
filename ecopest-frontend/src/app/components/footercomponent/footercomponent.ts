import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../i18n/translatepipe';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, TranslatePipe],
  template: `
    <footer class="site-footer">
      <span>© 2026 EcoPest · {{ 'footer.rights' | t }}</span>
      <a routerLink="/terminos">{{ 'terms.link' | t }}</a>
    </footer>
  `,
  styles: `
    .site-footer { background: #1b5e20; color: #fff; padding: 16px 24px; display: flex; flex-wrap: wrap; gap: 12px 24px; justify-content: space-between; margin-top: 32px; }
    .site-footer a { color: #fff; text-decoration: underline; }
  `,
})
export class Footercomponent {}
