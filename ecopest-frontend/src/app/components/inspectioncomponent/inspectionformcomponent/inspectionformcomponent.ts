import { Component, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { InspectionDTO } from '../../../models/InspectionDTO';
import { Inspectionservice } from '../../../services/inspectionservice';
import { Authservice } from '../../../services/authservice';
import { Languageservice } from '../../../i18n/languageservice';
import { TranslatePipe } from '../../../i18n/translatepipe';
import { errorMessage } from '../../../services/errormessage';
import { fromIsoDate, toIsoDate } from '../../../services/dateutil';
import { Businessservice } from '../../../services/businessservice';
import { BusinessDTO } from '../../../models/BusinessDTO';
import { Userservice } from '../../../services/userservice';
import { UserDTO } from '../../../models/UserDTO';


@Component({
  selector: 'app-inspectionform',
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressBarModule, TranslatePipe, MatDatepickerModule, MatSelectModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './inspectionformcomponent.html',
  styleUrl: './inspectionformcomponent.css',
})
export class Inspectionformcomponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  editId = 0;
  saving = signal(false);
  message = signal('');
  businessOptions = signal<BusinessDTO[]>([]);
  userOptions = signal<UserDTO[]>([]);

  constructor(
    private fb: FormBuilder,
    private s: Inspectionservice,
    public auth: Authservice,
    private lang: Languageservice,
    private snack: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private businessS: Businessservice,
    private userS: Userservice,
    
  ) {
    this.form = this.fb.group({
      inspectionDate: [new Date(), [Validators.required]],
      status: ['', [Validators.required]],
      observations: ['', [Validators.required]],
      businessEntityId: [null, [Validators.required]],
      userId: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.businessS.getBusinesses().subscribe({
      next: (data) => this.businessOptions.set(data),
      error: () => this.businessOptions.set([]),
    });
    if (this.auth.isAdmin()) {
      this.userS.getUsers().subscribe({
      next: (data) => this.userOptions.set(data),
      error: () => this.userOptions.set([]),
    });
    }
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.editId = Number(idParam);
      this.s.getInspectionById(this.editId).subscribe({
        next: (item) => {
          this.form.patchValue({
            ...item,
          inspectionDate: fromIsoDate(item.inspectionDate),
          });
        },
        error: (err) => this.message.set(errorMessage(err, this.lang.t('common.error'))),
      });
    }
    this.setCurrentUser();
  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.message.set(this.lang.t('common.required'));
      return;
    }
    const raw = this.form.getRawValue();
    const payload: InspectionDTO = {
      ...new InspectionDTO(),
      ...raw,
      inspectionDate: toIsoDate(raw.inspectionDate),
      idInspection: this.isEdit ? this.editId : null,
    };
    this.saving.set(true);
    const call = this.isEdit ? this.s.updateInspection(payload) : this.s.insertInspection(payload);
    call.subscribe({
      next: () => {
        this.saving.set(false);
        this.snack.open(this.lang.t('common.saved'), this.lang.t('common.close'), { duration: 3000 });
        this.router.navigate(['/inspecciones/listar']);
      },
      error: (err) => {
        this.saving.set(false);
        this.message.set(err.status === 403 ? this.lang.t('forbidden') : errorMessage(err, this.lang.t('common.error')));
      },
    });
  }

  /** Opciones del select; incluye el valor actual aunque no este en la lista (datos existentes). */
  optionsOf(field: string, base: string[]): string[] {
    const current = this.form.get(field)?.value;
    return current && !base.includes(current) ? [...base, current] : base;
  }
  /** Si el usuario no es ADMIN no puede listar usuarios: se usa su propio id. */
  private setCurrentUser(): void {
    if (this.isEdit) return;
    const apply = (id: number) => {
      if (this.form.get('userId')?.value === null) this.form.patchValue({ userId: id });
    };
    const me = this.auth.me();
    if (me) apply(me.idUser);
    else this.auth.loadMe().subscribe((m) => apply(m.idUser));
  }


  businessLabel(x: BusinessDTO): string {
    return x.name + (x.companyName && x.companyName !== x.name ? ' · ' + x.companyName : '');
  }

  userLabel(x: UserDTO): string {
    return x.name + ' (' + x.email + ')';
  }
}
