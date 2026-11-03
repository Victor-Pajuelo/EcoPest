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
import { IncidentDTO } from '../../../models/IncidentDTO';
import { Incidentservice } from '../../../services/incidentservice';
import { Authservice } from '../../../services/authservice';
import { Languageservice } from '../../../i18n/languageservice';
import { TranslatePipe } from '../../../i18n/translatepipe';
import { errorMessage } from '../../../services/errormessage';
import { fromIsoDate, toIsoDate } from '../../../services/dateutil';
import { Inspectionservice } from '../../../services/inspectionservice';
import { InspectionDTO } from '../../../models/InspectionDTO';
import { Pestservice } from '../../../services/pestservice';
import { PestTypeDTO } from '../../../models/PestTypeDTO';


@Component({
  selector: 'app-incidentform',
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressBarModule, TranslatePipe, MatDatepickerModule, MatSelectModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './incidentformcomponent.html',
  styleUrl: './incidentformcomponent.css',
})
export class Incidentformcomponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  editId = 0;
  saving = signal(false);
  message = signal('');
  inspectionOptions = signal<InspectionDTO[]>([]);
  pestOptions = signal<PestTypeDTO[]>([]);

  constructor(
    private fb: FormBuilder,
    private s: Incidentservice,
    public auth: Authservice,
    private lang: Languageservice,
    private snack: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private inspectionS: Inspectionservice,
    private pestS: Pestservice,
    
  ) {
    this.form = this.fb.group({
      incidentDate: [new Date(), [Validators.required]],
      description: ['', [Validators.required]],
      status: ['', [Validators.required]],
      inspectionId: [null, [Validators.required]],
      pestTypeId: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.inspectionS.getInspections().subscribe({
      next: (data) => this.inspectionOptions.set(data),
      error: () => this.inspectionOptions.set([]),
    });
    this.pestS.getPests().subscribe({
      next: (data) => this.pestOptions.set(data),
      error: () => this.pestOptions.set([]),
    });
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.editId = Number(idParam);
      this.s.getIncidentById(this.editId).subscribe({
        next: (item) => {
          this.form.patchValue({
            ...item,
          incidentDate: fromIsoDate(item.incidentDate),
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
    const payload: IncidentDTO = {
      ...new IncidentDTO(),
      ...raw,
      incidentDate: toIsoDate(raw.incidentDate),
      idIncident: this.isEdit ? this.editId : null,
    };
    this.saving.set(true);
    const call = this.isEdit ? this.s.updateIncident(payload) : this.s.insertIncident(payload);
    call.subscribe({
      next: () => {
        this.saving.set(false);
        this.snack.open(this.lang.t('common.saved'), this.lang.t('common.close'), { duration: 3000 });
        this.router.navigate(['/incidentes/listar']);
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

  inspectionLabel(x: InspectionDTO): string {
    return '#' + x.idInspection + ' · ' + x.inspectionDate;
  }

  pestLabel(x: PestTypeDTO): string {
    return x.name;
  }
}
