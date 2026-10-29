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
import { RoleDTO } from '../../../models/RoleDTO';
import { Roleservice } from '../../../services/roleservice';
import { Authservice } from '../../../services/authservice';
import { Languageservice } from '../../../i18n/languageservice';
import { TranslatePipe } from '../../../i18n/translatepipe';
import { errorMessage } from '../../../services/errormessage';
import { Confirmdialogcomponent } from '../../shared/confirmdialogcomponent/confirmdialogcomponent';



@Component({
  selector: 'app-rolelist',
  imports: [MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatTooltipModule, MatProgressBarModule, RouterLink, TranslatePipe],
  templateUrl: './rolelistcomponent.html',
  styleUrl: './rolelistcomponent.css',
})
export class Rolelistcomponent implements OnInit {
  displayedColumns: string[] = ["idCol", "c_name", "c_description", "actionsCol"];
  dataSource = new MatTableDataSource<RoleDTO>([]);
  loading = signal(true);
  paginator = viewChild(MatPaginator);


  constructor(
    private s: Roleservice,
    public auth: Authservice,
    private lang: Languageservice,
    private snack: MatSnackBar,
    private dialogConfirm: MatDialog,
  ) {
    effect(() => {
      const p = this.paginator();
      if (p) this.dataSource.paginator = p;
    });
  }

  ngOnInit(): void {
    this.load();

  }

  load(): void {
    this.loading.set(true);
    this.s.getRoles().subscribe({
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

  deleteRole(item: RoleDTO): void {
    const ref = this.dialogConfirm.open(Confirmdialogcomponent, {
      data: { message: this.lang.t('common.confirmDelete') },
    });
    ref.afterClosed().subscribe((ok) => {
      if (!ok) return;
      this.s.deleteRole(item.idRole as number).subscribe({
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


}
