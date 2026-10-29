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
import { UserDTO } from '../../../models/UserDTO';
import { Userservice } from '../../../services/userservice';
import { Authservice } from '../../../services/authservice';
import { Languageservice } from '../../../i18n/languageservice';
import { TranslatePipe } from '../../../i18n/translatepipe';
import { errorMessage } from '../../../services/errormessage';
import { Confirmdialogcomponent } from '../../shared/confirmdialogcomponent/confirmdialogcomponent';
import { Roleservice } from '../../../services/roleservice';
import { RoleDTO } from '../../../models/RoleDTO';
import { Businessservice } from '../../../services/businessservice';
import { BusinessDTO } from '../../../models/BusinessDTO';


@Component({
  selector: 'app-userlist',
  imports: [MatTableModule, MatPaginatorModule, MatFormFieldModule, MatInputModule, MatIconModule, MatButtonModule, MatTooltipModule, MatProgressBarModule, RouterLink, TranslatePipe],
  templateUrl: './userlistcomponent.html',
  styleUrl: './userlistcomponent.css',
})
export class Userlistcomponent implements OnInit {
  displayedColumns: string[] = ["idCol", "c_name", "c_email", "c_roleId", "c_businessEntityId", "c_active", "actionsCol"];
  dataSource = new MatTableDataSource<UserDTO>([]);
  loading = signal(true);
  paginator = viewChild(MatPaginator);
  roleOptions = signal<RoleDTO[]>([]);
  businessOptions = signal<BusinessDTO[]>([]);

  constructor(
    private s: Userservice,
    public auth: Authservice,
    private lang: Languageservice,
    private snack: MatSnackBar,
    private dialogConfirm: MatDialog,
    private roleS: Roleservice,
    private businessS: Businessservice,
  ) {
    effect(() => {
      const p = this.paginator();
      if (p) this.dataSource.paginator = p;
    });
  }

  ngOnInit(): void {
    this.load();
    if (this.auth.isAdmin()) {
      this.roleS.getRoles().subscribe({
      next: (data) => this.roleOptions.set(data),
      error: () => this.roleOptions.set([]),
    });
    }
    this.businessS.getBusinesses().subscribe({
      next: (data) => this.businessOptions.set(data),
      error: () => this.businessOptions.set([]),
    });
  }

  load(): void {
    this.loading.set(true);
    this.s.getUsers().subscribe({
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

  deleteUser(item: UserDTO): void {
    const ref = this.dialogConfirm.open(Confirmdialogcomponent, {
      data: { message: this.lang.t('common.confirmDelete') },
    });
    ref.afterClosed().subscribe((ok) => {
      if (!ok) return;
      this.s.deleteUser(item.idUser as number).subscribe({
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

  roleLabel(x: RoleDTO): string {
    return x.name;
  }

  businessLabel(x: BusinessDTO): string {
    return x.name + (x.companyName && x.companyName !== x.name ? ' · ' + x.companyName : '');
  }

  roleName(id: number | null): string {
    if (id === null || id === undefined) return '—';
    const found = this.roleOptions().find((o) => o.idRole === id);
    return found ? this.roleLabel(found) : '#' + id;
  }
  businessName(id: number | null): string {
    if (id === null || id === undefined) return '—';
    const found = this.businessOptions().find((o) => o.idBusinessEntity === id);
    return found ? this.businessLabel(found) : '#' + id;
  }
}
