import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-weatherupdatecomponent',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatSelectModule, MatDatepickerModule],
  templateUrl: './weatherupdatecomponent.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './weatherupdatecomponent.css',
})
export class Weatherupdatecomponent implements OnInit {

  id: any = null
  item: any
  form: any
  mensaje: string = ''
  empresas: any[] = []

  constructor(
    private s: Weatherservice,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
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
    // Recuperar el id desde la URL
    this.id = Number(this.route.snapshot.paramMap.get('id'))

    if (!this.id || isNaN(this.id)) {
      this.mensaje = 'ID inválido'
      return
    }
    this.businessS.getBusinesses().subscribe({
      next: data => {
        this.empresas = data
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
      }
    })

    this.buscarPorId()
  }

  buscarPorId(): void {
    this.s.getWeatherById(this.id).subscribe({
      next: (data: WeatherDataDTO) => {
        this.item = data
        this.form.patchValue({
          date: new Date(data.date + 'T00:00:00'),
          temperature: data.temperature,
          humidity: data.humidity,
          source: data.source,
          businessEntityId: data.businessEntityId
        })
        this.cdr.detectChanges()
      },
      error: (error) => {
        console.log(error)
        this.mensaje = 'No se encontró el registro!!'
        this.cdr.detectChanges()
      }
    })
  }

  actualizarClima(): void {
    if (this.form.invalid) {
      this.mensaje = 'Por favor, complete todos los campos correctamente!!'
      return
    }
    // El datepicker entrega un objeto Date, pero el backend recibe la fecha como texto (yyyy-MM-dd).
    // Por eso la convertimos a string con toISOString().substring(0, 10).
    const dto: WeatherDataDTO = {
      idWeatherData: this.id,
      date: this.form.value.date.toISOString().substring(0, 10),
      temperature: this.form.value.temperature,
      humidity: this.form.value.humidity,
      source: this.form.value.source,
      businessEntityId: this.form.value.businessEntityId,
    }

    this.s.updateWeather(dto).subscribe({
      next: () => {
        this.mensaje = 'Actualizado correctamente!!'
        this.cdr.detectChanges()
        this.router.navigate(['/clima/listar'])
      },
      error: (error) => {
        console.log(error)
        this.mensaje = 'Error al actualizar!!'
        this.cdr.detectChanges()
      }
    })
  }
}
