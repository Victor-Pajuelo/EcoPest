import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '../../i18n/translatepipe';

@Component({
  selector: 'app-footer',
  imports: [RouterLink, TranslatePipe],
  template: `
    <footer class="site-footer">
      <div class="inner">
        <span class="copy">© 2026 EcoPest · {{ 'footer.rights' | t }}</span>
        <a routerLink="/terminos">{{ 'terms.link' | t }}</a>
      </div>
    </footer>
  `,
  styles: `
    .site-footer { background: linear-gradient(120deg, #0b3d22, #14532d); color: #fff; margin-top: 40px; }
    .inner { max-width: 1240px; margin: 0 auto; padding: 20px 24px; display: flex; flex-wrap: wrap; gap: 8px 24px; justify-content: space-between; align-items: center; font-size: 14px; }
    .copy { color: rgba(255,255,255,.85); }
    a { color: #bbf7d0; font-weight: 500; text-underline-offset: 3px; }
    a:hover { color: #fff; }
  `,
})
export class Footercomponent {}
