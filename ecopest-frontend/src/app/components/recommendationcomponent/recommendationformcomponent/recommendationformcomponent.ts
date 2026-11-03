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
import { RecommendationDTO } from '../../../models/RecommendationDTO';
import { Recommendationservice } from '../../../services/recommendationservice';
import { Authservice } from '../../../services/authservice';
import { Languageservice } from '../../../i18n/languageservice';
import { TranslatePipe } from '../../../i18n/translatepipe';
import { errorMessage } from '../../../services/errormessage';
import { fromIsoDate, toIsoDate } from '../../../services/dateutil';
import { Incidentservice } from '../../../services/incidentservice';
import { IncidentDTO } from '../../../models/IncidentDTO';
import { Userservice } from '../../../services/userservice';
import { UserDTO } from '../../../models/UserDTO';


@Component({
  selector: 'app-recommendationform',
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressBarModule, TranslatePipe, MatSelectModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './recommendationformcomponent.html',
  styleUrl: './recommendationformcomponent.css',
})
export class Recommendationformcomponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  editId = 0;
  saving = signal(false);
  message = signal('');
  incidentOptions = signal<IncidentDTO[]>([]);
  userOptions = signal<UserDTO[]>([]);

  constructor(
    private fb: FormBuilder,
    private s: Recommendationservice,
    public auth: Authservice,
    private lang: Languageservice,
    private snack: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private incidentS: Incidentservice,
    private userS: Userservice,
    
  ) {
    this.form = this.fb.group({
      description: ['', [Validators.required]],
      origin: ['', [Validators.required]],
      status: ['', [Validators.required]],
      incidentId: [null, [Validators.required]],
      responsibleUserId: [null, []],
    });
  }

  ngOnInit(): void {
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
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.editId = Number(idParam);
      this.s.getRecommendationById(this.editId).subscribe({
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
    const payload: RecommendationDTO = {
      ...new RecommendationDTO(),
      ...raw,
      idRecommendation: this.isEdit ? this.editId : null,
    };
    this.saving.set(true);
    const call = this.isEdit ? this.s.updateRecommendation(payload) : this.s.insertRecommendation(payload);
    call.subscribe({
      next: () => {
        this.saving.set(false);
        this.snack.open(this.lang.t('common.saved'), this.lang.t('common.close'), { duration: 3000 });
        this.router.navigate(['/recomendaciones/listar']);
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

  incidentLabel(x: IncidentDTO): string {
    return '#' + x.idIncident + ' · ' + (x.description || '').slice(0, 40);
  }

  userLabel(x: UserDTO): string {
    return x.name + ' (' + x.email + ')';
  }
}
