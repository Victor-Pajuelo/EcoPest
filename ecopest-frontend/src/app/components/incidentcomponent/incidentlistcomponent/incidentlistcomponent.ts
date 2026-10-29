import { Component, OnInit, effect, signal, viewChild } from '@angular/core';

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
import { IncidentDTO } from '../../../models/IncidentDTO';
import { Incidentservice } from '../../../services/incidentservice';
import { Authservice } from '../../../services/authservice';
import { Languageservice } from '../../../i18n/languageservice';
import { TranslatePipe } from '../../../i18n/translatepipe';
import { errorMessage } from '../../../services/errormessage';
import { Confirmdialogcomponent } from '../../shared/confirmdialogcomponent/confirmdialogcomponent';
import { Inspectionservice } from '../../../services/inspectionservice';
import { InspectionDTO } from '../../../models/InspectionDTO';
import { Pestservice } from '../../../services/pestservice';
import { PestTypeDTO } from '../../../models/PestTypeDTO';
import { Recommendationsdialogcomponent } from '../../recommendationsdialogcomponent/recommendationsdialogcomponent';

@Component({
  selector: 'app-incidentlist',
  imports: [MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatTooltipModule, MatProgressBarModule, RouterLink, TranslatePipe],
  templateUrl: './incidentlistcomponent.html',
  styleUrl: './incidentlistcomponent.css',
})
export class Incidentlistcomponent implements OnInit {
  displayedColumns: string[] = ["idCol", "c_incidentDate", "c_description", "c_status", "c_inspectionId", "c_pestTypeId", "actionsCol"];
  dataSource = new MatTableDataSource<IncidentDTO>([]);
  loading = signal(true);
  paginator = viewChild(MatPaginator);
  inspectionOptions = signal<InspectionDTO[]>([]);
  pestOptions = signal<PestTypeDTO[]>([]);

  constructor(
    private s: Incidentservice,
    public auth: Authservice,
    private lang: Languageservice,
    private snack: MatSnackBar,
    private dialogConfirm: MatDialog,
    private inspectionS: Inspectionservice,
    private pestS: Pestservice,
  ) {
    effect(() => {
      const p = this.paginator();
      if (p) this.dataSource.paginator = p;
    });
  }

  ngOnInit(): void {
    this.load();
    this.inspectionS.getInspections().subscribe({
      next: (data) => this.inspectionOptions.set(data),
      error: () => this.inspectionOptions.set([]),
    });
    this.pestS.getPests().subscribe({
      next: (data) => this.pestOptions.set(data),
      error: () => this.pestOptions.set([]),
    });
  }

  load(): void {
    this.loading.set(true);
    this.s.getIncidents().subscribe({
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

  deleteIncident(item: IncidentDTO): void {
    const ref = this.dialogConfirm.open(Confirmdialogcomponent, {
      data: { message: this.lang.t('common.confirmDelete') },
    });
    ref.afterClosed().subscribe((ok) => {
      if (!ok) return;
      this.s.deleteIncident(item.idIncident as number).subscribe({
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

  inspectionLabel(x: InspectionDTO): string {
    return '#' + x.idInspection + ' · ' + x.inspectionDate;
  }

  pestLabel(x: PestTypeDTO): string {
    return x.name;
  }

  inspectionName(id: number | null): string {
    if (id === null || id === undefined) return '—';
    const found = this.inspectionOptions().find((o) => o.idInspection === id);
    return found ? this.inspectionLabel(found) : '#' + id;
  }
  pestName(id: number | null): string {
    if (id === null || id === undefined) return '—';
    const found = this.pestOptions().find((o) => o.idPestType === id);
    return found ? this.pestLabel(found) : '#' + id;
  }

  openRecommendations(incident: IncidentDTO): void {
    this.dialogConfirm.open(Recommendationsdialogcomponent, {
      data: { incidentId: incident.idIncident, description: incident.description },
      width: '720px',
      maxWidth: '95vw',
    });
  }
}
