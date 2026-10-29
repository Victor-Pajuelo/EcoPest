import { Injectable, signal } from '@angular/core';
import { BASE_TEXTS, Lang } from './translations';
import { ENTITY_TEXTS } from './entity-texts';

const STORAGE_KEY = 'ecopest.lang';

@Injectable({ providedIn: 'root' })
export class Languageservice {
  readonly lang = signal<Lang>(this.initialLang());

  constructor() {
    this.applyHtmlLang(this.lang());
  }

  t(key: string): string {
    const l = this.lang();
    return ENTITY_TEXTS[l][key] ?? BASE_TEXTS[l][key] ?? BASE_TEXTS['es_419'][key] ?? key;
  }

  set(lang: Lang): void {
    this.lang.set(lang);
    this.applyHtmlLang(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch {
      /* almacenamiento no disponible: se ignora */
    }
  }

  toggle(): void {
    this.set(this.lang() === 'es_419' ? 'en_US' : 'es_419');
  }

  private initialLang(): Lang {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'es_419' || saved === 'en_US') return saved;
    } catch {
      /* ignorar */
    }
    return typeof navigator !== 'undefined' && navigator.language?.toLowerCase().startsWith('en')
      ? 'en_US'
      : 'es_419';
  }

  private applyHtmlLang(lang: Lang): void {
    if (typeof document !== 'undefined') {
      document.documentElement.lang = lang === 'es_419' ? 'es-419' : 'en-US';
    }
  }
}
