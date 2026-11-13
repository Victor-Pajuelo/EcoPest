import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { WeatherDataDTO } from '../../../models/WeatherDataDTO';
import { Weatherservice } from '../../../services/weatherservice';
import { Businessservice } from '../../../services/businessservice';

@Component({
  selector: 'app-weatherinsertcomponent',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatSelectModule, MatDatepickerModule],
  templateUrl: './weatherinsertcomponent.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './weatherinsertcomponent.css',
})
export class Weatherinsertcomponent implements OnInit {

  form: any
  mensaje: string = ''
  empresas: any[] = []

  constructor(
    private s: Weatherservice,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private businessS: Businessservice
  ) {
    this.form = this.fb.group({
      date: [new Date(), [Validators.required]],
      temperature: [null, [Validators.required, Validators.min(-60), Validators.max(70)]],
      humidity: [null, [Validators.required, Validators.min(0), Validators.max(100)]],
      source: ['', []],
      businessEntityId: [null, [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.businessS.getBusinesses().subscribe({
      next: data => {
        this.empresas = data
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
      }
    })
  }

  insertarClima(): void {
    if (this.form.invalid) {
      this.mensaje = 'Por favor, complete todos los campos correctamente!!'
      return
    }
    // El datepicker entrega un objeto Date, pero el backend recibe la fecha como texto (yyyy-MM-dd).
    // Por eso la convertimos a string con toISOString().substring(0, 10).
    const dto: WeatherDataDTO = {
      idWeatherData: null,
      date: this.form.value.date.toISOString().substring(0, 10),
      temperature: this.form.value.temperature,
      humidity: this.form.value.humidity,
      source: this.form.value.source,
      businessEntityId: this.form.value.businessEntityId,
    }

    this.s.insertWeather(dto).subscribe({
      next: () => {
        this.mensaje = 'Registro guardado correctamente!!'
        this.form.reset({date: new Date()})
        this.cdr.detectChanges()
      },
      error: (error) => {
        this.mensaje = 'Error al registrar!!'
        console.log(error)
        this.cdr.detectChanges()
      }
    })
  }
}
