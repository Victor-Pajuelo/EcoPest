import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';

// Textos del paginador de Angular Material en español
@Injectable()
export class Paginadorespanol extends MatPaginatorIntl {
  override itemsPerPageLabel = 'Registros por página'
  override nextPageLabel = 'Siguiente'
  override previousPageLabel = 'Anterior'
  override firstPageLabel = 'Primera página'
  override lastPageLabel = 'Última página'

  override getRangeLabel = (page: number, pageSize: number, length: number): string => {
    if (length === 0) {
      return '0 de 0'
    }
    const inicio = page * pageSize
    const fin = Math.min(inicio + pageSize, length)
    return `${inicio + 1} – ${fin} de ${length}`
  }
}
