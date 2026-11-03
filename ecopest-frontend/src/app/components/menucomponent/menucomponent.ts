import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { Authservice } from '../../services/authservice';
import { Languageservice } from '../../i18n/languageservice';
import { TranslatePipe } from '../../i18n/translatepipe';

interface MenuItem {
  route: string;
  labelKey: string;
  icon: string;
}
interface MenuGroup {
  labelKey: string;
  icon: string;
  adminOnly?: boolean;
  items: MenuItem[];
}

@Component({
  selector: 'app-menucomponent',
  imports: [RouterLink, RouterLinkActive, MatIconModule, MatButtonModule, MatToolbarModule, MatMenuModule, TranslatePipe],
  templateUrl: './menucomponent.html',
  styleUrl: './menucomponent.css',
})
export class Menucomponent {
  mobileOpen = signal(false);

  groups: MenuGroup[] = [
    {
      labelKey: 'menu.operations',
      icon: 'assignment',
      items: [
        { route: '/inspecciones', labelKey: 'inspection.title', icon: 'fact_check' },
        { route: '/incidentes', labelKey: 'incident.title', icon: 'report_problem' },
        { route: '/evidencias', labelKey: 'evidence.title', icon: 'photo_library' },
        { route: '/recomendaciones', labelKey: 'recommendation.title', icon: 'lightbulb' },
        { route: '/clima', labelKey: 'weather.title', icon: 'cloud' },
      ],
    },
    {
      labelKey: 'menu.catalogs',
      icon: 'category',
      items: [
        { route: '/empresas', labelKey: 'business.title', icon: 'business' },
        { route: '/plagas', labelKey: 'pest.title', icon: 'bug_report' },
      ],
    },
    {
      labelKey: 'menu.admin',
      icon: 'admin_panel_settings',
      adminOnly: true,
      items: [
        { route: '/usuarios', labelKey: 'user.title', icon: 'group' },
        { route: '/roles', labelKey: 'role.title', icon: 'admin_panel_settings' },
      ],
    },
  ];

  constructor(
    public auth: Authservice,
    public lang: Languageservice,
  ) {}

  visibleGroups(): MenuGroup[] {
    return this.groups.filter((g) => !g.adminOnly || this.auth.isAdmin());
  }

  closeMobile(): void {
    this.mobileOpen.set(false);
  }

  logout(): void {
    this.closeMobile();
    this.auth.logout();
  }

  /** Iniciales del usuario para el avatar de la barra superior. */
  initials(): string {
    const name = (this.auth.me()?.name ?? '').trim();
    if (!name) return '?';
    const parts = name.split(/\s+/).filter(Boolean);
    return ((parts[0]?.[0] ?? '') + (parts.length > 1 ? parts[parts.length - 1][0] : '')).toUpperCase();
  }
}
