import { Pipe, PipeTransform, inject } from '@angular/core';
import { Languageservice } from './languageservice';

/** Uso en plantillas: {{ 'menu.home' | t }} */
@Pipe({ name: 't', pure: false })
export class TranslatePipe implements PipeTransform {
  private lang = inject(Languageservice);

  transform(key: string): string {
    return this.lang.t(key);
  }
}
