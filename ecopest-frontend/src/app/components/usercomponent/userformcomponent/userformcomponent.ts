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
import { UserDTO } from '../../../models/UserDTO';
import { Userservice } from '../../../services/userservice';
import { Authservice } from '../../../services/authservice';
import { Languageservice } from '../../../i18n/languageservice';
import { TranslatePipe } from '../../../i18n/translatepipe';
import { errorMessage } from '../../../services/errormessage';
import { fromIsoDate, toIsoDate } from '../../../services/dateutil';
import { Roleservice } from '../../../services/roleservice';
import { RoleDTO } from '../../../models/RoleDTO';
import { Businessservice } from '../../../services/businessservice';
import { BusinessDTO } from '../../../models/BusinessDTO';


@Component({
  selector: 'app-userform',
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressBarModule, TranslatePipe, MatSelectModule, MatCheckboxModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './userformcomponent.html',
  styleUrl: './userformcomponent.css',
})
export class Userformcomponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  editId = 0;
  saving = signal(false);
  message = signal('');
  roleOptions = signal<RoleDTO[]>([]);
  businessOptions = signal<BusinessDTO[]>([]);

  constructor(
    private fb: FormBuilder,
    private s: Userservice,
    public auth: Authservice,
    private lang: Languageservice,
    private snack: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private roleS: Roleservice,
    private businessS: Businessservice,
    
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      roleId: [null, [Validators.required]],
      businessEntityId: [null, [Validators.required]],
      active: [true],
    });
  }

  ngOnInit(): void {
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
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.editId = Number(idParam);
      this.s.getUserById(this.editId).subscribe({
        next: (item) => {
          this.form.patchValue({
            ...item,
          });
        },
        error: (err) => this.message.set(errorMessage(err, this.lang.t('common.error'))),
      });
    }

  }

  save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.message.set(this.lang.t('common.required'));
      return;
    }
    const raw = this.form.getRawValue();
    const payload: UserDTO = {
      ...new UserDTO(),
      ...raw,
      idUser: this.isEdit ? this.editId : null,
    };
    this.saving.set(true);
    const call = this.isEdit ? this.s.updateUser(payload) : this.s.insertUser(payload);
    call.subscribe({
      next: () => {
        this.saving.set(false);
        this.snack.open(this.lang.t('common.saved'), this.lang.t('common.close'), { duration: 3000 });
        this.router.navigate(['/usuarios/listar']);
      },
      error: (err) => {
        this.saving.set(false);
        this.message.set(err.status === 403 ? this.lang.t('forbidden') : errorMessage(err, this.lang.t('common.error')));
      },
    });
  }


  roleLabel(x: RoleDTO): string {
    return x.name;
  }

  businessLabel(x: BusinessDTO): string {
    return x.name + (x.companyName && x.companyName !== x.name ? ' · ' + x.companyName : '');
  }
}
