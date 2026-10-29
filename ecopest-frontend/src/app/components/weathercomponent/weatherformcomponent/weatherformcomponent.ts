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
import { WeatherDataDTO } from '../../../models/WeatherDataDTO';
import { Weatherservice } from '../../../services/weatherservice';
import { Authservice } from '../../../services/authservice';
import { Languageservice } from '../../../i18n/languageservice';
import { TranslatePipe } from '../../../i18n/translatepipe';
import { errorMessage } from '../../../services/errormessage';
import { fromIsoDate, toIsoDate } from '../../../services/dateutil';
import { Businessservice } from '../../../services/businessservice';
import { BusinessDTO } from '../../../models/BusinessDTO';


@Component({
  selector: 'app-weatherform',
  imports: [ReactiveFormsModule, RouterLink, MatFormFieldModule, MatInputModule, MatButtonModule, MatIconModule, MatProgressBarModule, TranslatePipe, MatDatepickerModule, MatSelectModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './weatherformcomponent.html',
  styleUrl: './weatherformcomponent.css',
})
export class Weatherformcomponent implements OnInit {
  form: FormGroup;
  isEdit = false;
  editId = 0;
  saving = signal(false);
  message = signal('');
  businessOptions = signal<BusinessDTO[]>([]);

  constructor(
    private fb: FormBuilder,
    private s: Weatherservice,
    public auth: Authservice,
    private lang: Languageservice,
    private snack: MatSnackBar,
    private route: ActivatedRoute,
    private router: Router,
    private businessS: Businessservice,
    
  ) {
    this.form = this.fb.group({
      date: [new Date(), [Validators.required]],
      temperature: [null, [Validators.required, Validators.min(-60), Validators.max(70)]],
      humidity: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      source: ['', []],
      businessEntityId: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.businessS.getBusinesses().subscribe({
      next: (data) => this.businessOptions.set(data),
      error: () => this.businessOptions.set([]),
    });
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.isEdit = true;
      this.editId = Number(idParam);
      this.s.getWeatherById(this.editId).subscribe({
        next: (item) => {
          this.form.patchValue({
            ...item,
          date: fromIsoDate(item.date),
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
    const payload: WeatherDataDTO = {
      ...new WeatherDataDTO(),
      ...raw,
      date: toIsoDate(raw.date),
      idWeatherData: this.isEdit ? this.editId : null,
    };
    this.saving.set(true);
    const call = this.isEdit ? this.s.updateWeather(payload) : this.s.insertWeather(payload);
    call.subscribe({
      next: () => {
        this.saving.set(false);
        this.snack.open(this.lang.t('common.saved'), this.lang.t('common.close'), { duration: 3000 });
        this.router.navigate(['/clima/listar']);
      },
      error: (err) => {
        this.saving.set(false);
        this.message.set(err.status === 403 ? this.lang.t('forbidden') : errorMessage(err, this.lang.t('common.error')));
      },
    });
  }


  businessLabel(x: BusinessDTO): string {
    return x.name + (x.companyName && x.companyName !== x.name ? ' · ' + x.companyName : '');
  }
}
