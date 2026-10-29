import { Component, OnInit, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Inaturalistservice, TaxonResult } from '../../services/inaturalistservice';
import { Languageservice } from '../../i18n/languageservice';
import { TranslatePipe } from '../../i18n/translatepipe';

/** Foto y nombre cientifico de una plaga consultados a iNaturalist (API externa). */
@Component({
  selector: 'app-pestphotodialog',
  imports: [MatDialogModule, MatButtonModule, MatProgressBarModule, TranslatePipe],
  templateUrl: './pestphotodialogcomponent.html',
  styleUrl: './pestphotodialogcomponent.css',
})
export class Pestphotodialogcomponent implements OnInit {
  data: { name: string } = inject(MAT_DIALOG_DATA);
  result = signal<TaxonResult | null>(null);
  loading = signal(true);
  failed = signal(false);

  constructor(private nat: Inaturalistservice, public lang: Languageservice) {}

  ngOnInit(): void {
    const locale = this.lang.lang() === 'es_419' ? 'es' : 'en';
    this.nat.searchTaxa(this.data.name, locale).subscribe({
      next: (list) => {
        this.result.set(list.find((t) => t.photoUrl) ?? list[0] ?? null);
        this.loading.set(false);
      },
      error: () => {
        this.failed.set(true);
        this.loading.set(false);
      },
    });
  }
}
