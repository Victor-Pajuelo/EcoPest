import { Component, computed, input } from '@angular/core';

export interface BarItem {
  name: string;
  quantity: number;
}

/** Grafico de barras horizontal accesible (sin librerias): cada barra muestra su valor en texto. */
@Component({
  selector: 'app-barchart',
  template: `
    <figure class="chart">
      <figcaption>{{ title() }}</figcaption>
      @if (items().length === 0) {
        <p class="muted">—</p>
      }
      <ul>
        @for (it of items(); track it.name) {
          <li>
            <span class="label" [title]="it.name">{{ it.name }}</span>
            <span class="bar-track" aria-hidden="true">
              <span class="bar" [style.width.%]="percent(it.quantity)"></span>
            </span>
            <span class="value">{{ it.quantity }}</span>
          </li>
        }
      </ul>
    </figure>
  `,
  styles: `
    .chart { margin: 0; background: #fff; border-radius: 8px; padding: 12px 16px; box-shadow: 0 1px 4px rgba(0,0,0,.25); }
    figcaption { font-weight: 500; color: #1b5e20; margin-bottom: 8px; }
    ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
    li { display: grid; grid-template-columns: minmax(80px, 38%) 1fr 36px; gap: 8px; align-items: center; font-size: 14px; }
    .label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
    .bar-track { background: #e8f5e9; border-radius: 4px; height: 16px; display: block; }
    .bar { display: block; height: 100%; background: #2e7d32; border-radius: 4px; min-width: 2px; }
    .value { text-align: right; font-weight: 500; }
    .muted { color: #424242; }
  `,
})
export class Barchartcomponent {
  title = input.required<string>();
  items = input.required<BarItem[]>();
  private max = computed(() => Math.max(1, ...this.items().map((i) => i.quantity)));

  percent(q: number): number {
    return (q / this.max()) * 100;
  }
}
