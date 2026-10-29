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
import { RecommendationDTO } from '../../../models/RecommendationDTO';
import { Recommendationservice } from '../../../services/recommendationservice';
import { Authservice } from '../../../services/authservice';
import { Languageservice } from '../../../i18n/languageservice';
import { TranslatePipe } from '../../../i18n/translatepipe';
import { errorMessage } from '../../../services/errormessage';
import { Confirmdialogcomponent } from '../../shared/confirmdialogcomponent/confirmdialogcomponent';
import { Incidentservice } from '../../../services/incidentservice';
import { IncidentDTO } from '../../../models/IncidentDTO';
import { Userservice } from '../../../services/userservice';
import { UserDTO } from '../../../models/UserDTO';


@Component({
  selector: 'app-recommendationlist',
  imports: [MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatTooltipModule, MatProgressBarModule, RouterLink, TranslatePipe, DatePipe],
  templateUrl: './recommendationlistcomponent.html',
  styleUrl: './recommendationlistcomponent.css',
})
export class Recommendationlistcomponent implements OnInit {
  displayedColumns: string[] = ["idCol", "c_description", "c_origin", "c_status", "c_generationDate", "c_incidentId", "actionsCol"];
  dataSource = new MatTableDataSource<RecommendationDTO>([]);
  loading = signal(true);
  paginator = viewChild(MatPaginator);
  incidentOptions = signal<IncidentDTO[]>([]);
  userOptions = signal<UserDTO[]>([]);

  constructor(
    private s: Recommendationservice,
    public auth: Authservice,
    private lang: Languageservice,
    private snack: MatSnackBar,
    private dialogConfirm: MatDialog,
    private incidentS: Incidentservice,
    private userS: Userservice,
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
    if (this.auth.isAdmin()) {
      this.userS.getUsers().subscribe({
      next: (data) => this.userOptions.set(data),
      error: () => this.userOptions.set([]),
    });
    }
  }

  load(): void {
    this.loading.set(true);
    this.s.getRecommendations().subscribe({
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

  deleteRecommendation(item: RecommendationDTO): void {
    const ref = this.dialogConfirm.open(Confirmdialogcomponent, {
      data: { message: this.lang.t('common.confirmDelete') },
    });
    ref.afterClosed().subscribe((ok) => {
      if (!ok) return;
      this.s.deleteRecommendation(item.idRecommendation as number).subscribe({
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

  userLabel(x: UserDTO): string {
    return x.name + ' (' + x.email + ')';
  }

  incidentName(id: number | null): string {
    if (id === null || id === undefined) return '—';
    const found = this.incidentOptions().find((o) => o.idIncident === id);
    return found ? this.incidentLabel(found) : '#' + id;
  }
  userName(id: number | null): string {
    if (id === null || id === undefined) return '—';
    const found = this.userOptions().find((o) => o.idUser === id);
    return found ? this.userLabel(found) : '#' + id;
  }
}
