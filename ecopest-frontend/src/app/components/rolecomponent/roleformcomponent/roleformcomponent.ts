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
import { RoleDTO } from '../../../models/RoleDTO';
import { Roleservice } from '../../../services/roleservice';
import { Authservice } from '../../../services/authservice';
import { Languageservice } from '../../../i18n/languageservice';
import { TranslatePipe } from '../../../i18n/translatepipe';
import { errorMessage } from '../../../services/errormessage';
import { fromIsoDate, toIsoDate } from '../../../services/dateutil';



@Component({
  selector: 'app-roleform',
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressBarModule, TranslatePipe, MatCheckboxModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './roleformcomponent.html',
  styleUrl: './roleformcomponent.css',
})
export class Roleformcomponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  editId = 0;
  saving = signal(false);
  message = signal('');


  constructor(
    private fb: FormBuilder,
    private s: Roleservice,
    public auth: Authservice,
    private lang: Languageservice,
    private snack: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      active: [true],
    });
  }

  ngOnInit(): void {

    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.editId = Number(idParam);
      this.s.getRoleById(this.editId).subscribe({
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
    const payload: RoleDTO = {
      ...new RoleDTO(),
      ...raw,
      idRole: this.isEdit ? this.editId : null,
    };
    this.saving.set(true);
    const call = this.isEdit ? this.s.updateRole(payload) : this.s.insertRole(payload);
    call.subscribe({
      next: () => {
        this.saving.set(false);
        this.snack.open(this.lang.t('common.saved'), this.lang.t('common.close'), { duration: 3000 });
        this.router.navigate(['/roles/listar']);
      },
      error: (err) => {
        this.saving.set(false);
        this.message.set(err.status === 403 ? this.lang.t('forbidden') : errorMessage(err, this.lang.t('common.error')));
      },
    });
  }


}
