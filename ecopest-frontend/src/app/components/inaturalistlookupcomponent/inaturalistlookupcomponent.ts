import { Component, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Inaturalistservice, TaxonResult } from '../../services/inaturalistservice';
import { Languageservice } from '../../i18n/languageservice';
import { TranslatePipe } from '../../i18n/translatepipe';

/** Buscador iNaturalist dentro del formulario de plagas: foto + nombre cientifico. */
@Component({
  selector: 'app-inaturalistlookup',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressBarModule, TranslatePipe],
  templateUrl: './inaturalistlookupcomponent.html',
  styleUrl: './inaturalistlookupcomponent.css',
})
export class Inaturalistlookupcomponent {
  initialQuery = input<string>('');
  useText = output<string>();

  query = '';
  results = signal<TaxonResult[]>([]);
  loading = signal(false);
  searched = signal(false);
  failed = signal(false);

  constructor(private nat: Inaturalistservice, private lang: Languageservice) {}

  search(): void {
    const q = (this.query || this.initialQuery() || '').trim();
    if (!q) return;
    this.query = q;
    this.loading.set(true);
    this.failed.set(false);
    const locale = this.lang.lang() === 'es_419' ? 'es' : 'en';
    this.nat.searchTaxa(q, locale).subscribe({
      next: (list) => {
        this.results.set(list);
        this.searched.set(true);
        this.loading.set(false);
      },
      error: () => {
        this.failed.set(true);
        this.loading.set(false);
      },
    });
  }

  use(t: TaxonResult): void {
    const common = t.commonName ? ` (${t.commonName})` : '';
    this.useText.emit(`${t.scientificName}${common}`);
  }
}
