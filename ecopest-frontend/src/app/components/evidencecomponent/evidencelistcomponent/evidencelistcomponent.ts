import { Component, OnInit, effect, signal, viewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EvidenceDTO } from '../../../models/EvidenceDTO';
import { Evidenceservice } from '../../../services/evidenceservice';
import { Authservice } from '../../../services/authservice';
import { Languageservice } from '../../../i18n/languageservice';
import { TranslatePipe } from '../../../i18n/translatepipe';
import { errorMessage } from '../../../services/errormessage';
import { Confirmdialogcomponent } from '../../shared/confirmdialogcomponent/confirmdialogcomponent';
import { Incidentservice } from '../../../services/incidentservice';
import { IncidentDTO } from '../../../models/IncidentDTO';


@Component({
  selector: 'app-evidencelist',
  imports: [MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatTooltipModule, MatProgressBarModule, RouterLink, TranslatePipe, DatePipe],
  templateUrl: './evidencelistcomponent.html',
  styleUrl: './evidencelistcomponent.css',
})
export class Evidencelistcomponent implements OnInit {
  displayedColumns: string[] = ["idCol", "c_fileUrl", "c_fileType", "c_uploadDate", "c_incidentId", "actionsCol"];
  dataSource = new MatTableDataSource<EvidenceDTO>([]);
  loading = signal(true);
  paginator = viewChild(MatPaginator);
  incidentOptions = signal<IncidentDTO[]>([]);

  constructor(
    private s: Evidenceservice,
    public auth: Authservice,
    private lang: Languageservice,
    private snack: MatSnackBar,
    private dialogConfirm: MatDialog,
    private incidentS: Incidentservice,
  ) {
    effect(() => {
      const p = this.paginator();
      if (p) this.dataSource.paginator = p;
    });
  }

  ngOnInit(): void {
    this.load();
    this.incidentS.getIncidents().subscribe({
      next: (data) => this.incidentOptions.set(data),
      error: () => this.incidentOptions.set([]),
    });
  }

  load(): void {
    this.loading.set(true);
    this.s.getEvidences().subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.loading.set(false);
      },
      error: (err) => {
        this.loading.set(false);
        this.snack.open(errorMessage(err, this.lang.t('common.error')), this.lang.t('common.close'), { duration: 5000 });
      },
    });
  }

  applyFilter(event: Event): void {
    this.dataSource.filter = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.paginator?.firstPage();
  }

  deleteEvidence(item: EvidenceDTO): void {
    const ref = this.dialogConfirm.open(Confirmdialogcomponent, {
      data: { message: this.lang.t('common.confirmDelete') },
    });
    ref.afterClosed().subscribe((ok) => {
      if (!ok) return;
      this.s.deleteEvidence(item.idEvidence as number).subscribe({
        next: () => {
          this.snack.open(this.lang.t('common.deleted'), this.lang.t('common.close'), { duration: 3000 });
          this.load();
        },
        error: (err) => {
          const msg = err.status === 403 ? this.lang.t('forbidden') : errorMessage(err, this.lang.t('common.error'));
          this.snack.open(msg, this.lang.t('common.close'), { duration: 5000 });
        },
      });
    });
  }

  incidentLabel(x: IncidentDTO): string {
    return '#' + x.idIncident + ' · ' + (x.description || '').slice(0, 40);
  }

  incidentName(id: number | null): string {
    if (id === null || id === undefined) return '—';
    const found = this.incidentOptions().find((o) => o.idIncident === id);
    return found ? this.incidentLabel(found) : '#' + id;
  }
}
