import { Component, OnInit, inject, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RecommendationDTO } from '../../models/RecommendationDTO';
import { Recommendationservice } from '../../services/recommendationservice';
import { Authservice } from '../../services/authservice';
import { Languageservice } from '../../i18n/languageservice';
import { TranslatePipe } from '../../i18n/translatepipe';
import { errorMessage } from '../../services/errormessage';

/** Muestra las recomendaciones de un incidente y permite generar una nueva con IA (Gemini). */
@Component({
  selector: 'app-recommendationsdialog',
  imports: [DatePipe, MatDialogModule, MatButtonModule, MatIconModule, MatProgressBarModule, TranslatePipe],
  templateUrl: './recommendationsdialogcomponent.html',
  styleUrl: './recommendationsdialogcomponent.css',
})
export class Recommendationsdialogcomponent implements OnInit {
  data: { incidentId: number; description: string } = inject(MAT_DIALOG_DATA);
  items = signal<RecommendationDTO[]>([]);
  loading = signal(true);
  generating = signal(false);
  message = signal('');
  messageIsError = signal(false);

  constructor(
    private s: Recommendationservice,
    public auth: Authservice,
    private lang: Languageservice,
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.s.getByIncident(this.data.incidentId).subscribe({
      next: (list) => {
        this.items.set(list);
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.show(errorMessage(err, this.lang.t('common.error')), true);
      },
    });
  }

  generate(): void {
    this.generating.set(true);
    this.message.set('');
    this.s.generateWithAI(this.data.incidentId).subscribe({
      next: () => {
        this.generating.set(false);
        this.show(this.lang.t('ai.ok'), false);
        this.load();
      },
      error: (err) => {
        this.generating.set(false);
        const msg = err.status === 403 ? this.lang.t('forbidden') : errorMessage(err, this.lang.t('common.error'));
        this.show(msg, true);
      },
    });
  }

  private show(text: string, isError: boolean): void {
    this.message.set(text);
    this.messageIsError.set(isError);
  }
}
