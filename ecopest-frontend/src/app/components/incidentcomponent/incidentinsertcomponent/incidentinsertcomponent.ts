import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { IncidentDTO } from '../../../models/IncidentDTO';
import { Incidentservice } from '../../../services/incidentservice';
import { Inspectionservice } from '../../../services/inspectionservice';
import { Pestservice } from '../../../services/pestservice';

@Component({
  selector: 'app-incidentinsertcomponent',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatSelectModule, MatDatepickerModule],
  templateUrl: './incidentinsertcomponent.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './incidentinsertcomponent.css',
})
export class Incidentinsertcomponent implements OnInit {

  form: any
  mensaje: string = ''
  estados: any[] = [
    { value: 'PENDIENTE', viewValue: 'Pendiente' },
    { value: 'EN_PROCESO', viewValue: 'En proceso' },
    { value: 'RESUELTO', viewValue: 'Resuelto' },
  ];

  inspecciones: any[] = []
  plagas: any[] = []

  constructor(
    private s: Incidentservice,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
    private inspectionS: Inspectionservice,
    private pestS: Pestservice
  ) {
    this.form = this.fb.group({
      incidentDate: [new Date(), [Validators.required]],
      description: ['', [Validators.required]],
      status: ['', [Validators.required]],
      inspectionId: [null, [Validators.required]],
      pestTypeId: [null, [Validators.required]]
    })
  }

  ngOnInit(): void {
    this.inspectionS.getInspections().subscribe({
      next: data => {
        this.inspecciones = data
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
      }
    })
    this.pestS.getPests().subscribe({
      next: data => {
        this.plagas = data
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
      }
    })
  }

  insertarIncidente(): void {
    if (this.form.invalid) {
      this.mensaje = 'Por favor, complete todos los campos correctamente!!'
      return
    }
    // El datepicker entrega un objeto Date, pero el backend recibe la fecha como texto (yyyy-MM-dd).
    // Por eso la convertimos a string con toISOString().substring(0, 10).
    const dto: IncidentDTO = {
      idIncident: null,
      incidentDate: this.form.value.incidentDate.toISOString().substring(0, 10),
      description: this.form.value.description,
      status: this.form.value.status,
      inspectionId: this.form.value.inspectionId,
      pestTypeId: this.form.value.pestTypeId,
    }

    this.s.insertIncident(dto).subscribe({
      next: () => {
        this.mensaje = 'Registro guardado correctamente!!'
        this.form.reset({incidentDate: new Date()})
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
