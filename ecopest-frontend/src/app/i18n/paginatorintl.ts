import { Injectable, effect } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Languageservice } from './languageservice';

/** Traduce los textos del paginador de Angular Material segun el idioma elegido. */
@Injectable()
export class Paginatorintl extends MatPaginatorIntl {
  constructor(private lang: Languageservice) {
    super();
    effect(() => {
      const es = this.lang.lang() === 'es_419';
      this.itemsPerPageLabel = es ? 'Filas por página:' : 'Rows per page:';
      this.nextPageLabel = es ? 'Página siguiente' : 'Next page';
      this.previousPageLabel = es ? 'Página anterior' : 'Previous page';
      this.firstPageLabel = es ? 'Primera página' : 'First page';
      this.lastPageLabel = es ? 'Última página' : 'Last page';
      this.getRangeLabel = (page, pageSize, length) => {
        if (length === 0) return es ? '0 de 0' : '0 of 0';
        const start = page * pageSize;
        const end = Math.min(start + pageSize, length);
        return `${start + 1} – ${end} ${es ? 'de' : 'of'} ${length}`;
      };
      this.changes.next();
    });
  }
}
