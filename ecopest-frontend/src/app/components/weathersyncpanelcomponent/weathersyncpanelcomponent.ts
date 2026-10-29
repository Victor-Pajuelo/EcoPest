import { Component, OnInit, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BusinessDTO } from '../../models/BusinessDTO';
import { Businessservice } from '../../services/businessservice';
import { Weatherservice } from '../../services/weatherservice';
import { Languageservice } from '../../i18n/languageservice';
import { TranslatePipe } from '../../i18n/translatepipe';
import { errorMessage } from '../../services/errormessage';

/** Panel "Sincronizar clima real": llama al backend, que consulta Open-Meteo y guarda el dato. */
@Component({
  selector: 'app-weathersyncpanel',
  imports: [ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatProgressBarModule, TranslatePipe],
  templateUrl: './weathersyncpanelcomponent.html',
  styleUrl: './weathersyncpanelcomponent.css',
})
export class Weathersyncpanelcomponent implements OnInit {
  synced = output<void>();
  form: FormGroup;
  businesses = signal<BusinessDTO[]>([]);
  busy = signal(false);
  message = signal('');

  constructor(
    private fb: FormBuilder,
    private businessS: Businessservice,
    private weatherS: Weatherservice,
    private lang: Languageservice,
    private snack: MatSnackBar,
  ) {
    this.form = this.fb.group({
      businessEntityId: [null, Validators.required],
      latitude: [-12.0464, [Validators.required, Validators.min(-90), Validators.max(90)]],
      longitude: [-77.0428, [Validators.required, Validators.min(-180), Validators.max(180)]],
    });
  }

  ngOnInit(): void {
    this.businessS.getBusinesses().subscribe({ next: (d) => this.businesses.set(d) });
  }

  sync(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.value;
    this.busy.set(true);
    this.message.set('');
    this.weatherS.syncWeather(v.businessEntityId, v.latitude, v.longitude).subscribe({
      next: (w) => {
        this.busy.set(false);
        this.snack.open(
          `${this.lang.t('weather.syncOk')}: ${w.temperature} °C, ${w.humidity} %`,
          this.lang.t('common.close'),
          { duration: 5000 },
        );
        this.synced.emit();
      },
      error: (err) => {
        this.busy.set(false);
        this.message.set(errorMessage(err, this.lang.t('common.error')));
      },
    });
  }
}
