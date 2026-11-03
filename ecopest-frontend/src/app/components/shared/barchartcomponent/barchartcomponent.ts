import { Component, computed, input } from '@angular/core';

export interface BarItem {
  name: string;
  quantity: number;
}

/** Colores por nivel de riesgo (se usa cuando kind = 'risk'). */
const RISK_COLORS: Record<string, string> = {
  BAJO: 'linear-gradient(90deg, #4ade80, #16a34a)',
  MEDIO: 'linear-gradient(90deg, #fcd34d, #d97706)',
  ALTO: 'linear-gradient(90deg, #fb923c, #c2410c)',
  CRITICO: 'linear-gradient(90deg, #f87171, #b91c1c)',
};

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
              <span class="bar" [style.width.%]="percent(it.quantity)" [style.background]="color(it.name)"></span>
            </span>
            <span class="value">{{ it.quantity }}</span>
          </li>
        }
      </ul>
    </figure>
  `,
  styles: `
    .chart { margin: 0; height: 100%; background: #fff; border: 1px solid var(--border, #dfe8e2); border-radius: 18px; padding: 20px 22px 22px; box-shadow: var(--shadow-sm, 0 1px 3px rgba(0,0,0,.1)); }
    figcaption { font-weight: 700; color: var(--eco-900, #0b3d22); font-size: 16px; margin-bottom: 16px; }
    ul { list-style: none; margin: 0; padding: 0; display: grid; gap: 13px; }
    li { display: grid; grid-template-columns: minmax(84px, 34%) 1fr 34px; gap: 12px; align-items: center; font-size: 14px; }
    .label { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: var(--text, #14281d); font-weight: 500; }
    .bar-track { background: #eef4f0; border-radius: 999px; height: 12px; display: block; overflow: hidden; }
    .bar { display: block; height: 100%; border-radius: 999px; min-width: 6px; transition: width .6s cubic-bezier(.2,.8,.2,1); }
    .value { text-align: right; font-weight: 700; color: var(--eco-900, #0b3d22); font-variant-numeric: tabular-nums; }
    .muted { color: var(--muted, #55665c); }
    @media (max-width: 420px) { li { grid-template-columns: minmax(70px, 38%) 1fr 30px; gap: 8px; } }
  `,
})
export class Barchartcomponent {
  title = input.required<string>();
  items = input.required<BarItem[]>();
  /** 'risk' pinta cada barra segun el nivel de riesgo; por defecto, verde. */
  kind = input<'default' | 'risk'>('default');
  private max = computed(() => Math.max(1, ...this.items().map((i) => i.quantity)));

  percent(q: number): number {
    return (q / this.max()) * 100;
  }

  color(name: string): string {
    if (this.kind() === 'risk') {
      const c = RISK_COLORS[name?.toUpperCase()];
      if (c) return c;
    }
    return 'linear-gradient(90deg, #4ade80, #15803d)';
  }
}
