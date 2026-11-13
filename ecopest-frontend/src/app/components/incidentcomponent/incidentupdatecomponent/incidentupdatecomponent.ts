import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
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
  selector: 'app-incidentupdatecomponent',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatSelectModule, MatDatepickerModule],
  templateUrl: './incidentupdatecomponent.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './incidentupdatecomponent.css',
})
export class Incidentupdatecomponent implements OnInit {

  id: any = null
  item: any
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
    private router: Router,
    private route: ActivatedRoute,
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
    // Recuperar el id desde la URL
    this.id = Number(this.route.snapshot.paramMap.get('id'))

    if (!this.id || isNaN(this.id)) {
      this.mensaje = 'ID inválido'
      return
    }
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

    this.buscarPorId()
  }

  buscarPorId(): void {
    this.s.getIncidentById(this.id).subscribe({
      next: (data: IncidentDTO) => {
        this.item = data
        this.form.patchValue({
          incidentDate: new Date(data.incidentDate + 'T00:00:00'),
          description: data.description,
          status: data.status,
          inspectionId: data.inspectionId,
          pestTypeId: data.pestTypeId
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

  actualizarIncidente(): void {
    if (this.form.invalid) {
      this.mensaje = 'Por favor, complete todos los campos correctamente!!'
      return
    }
    // El datepicker entrega un objeto Date, pero el backend recibe la fecha como texto (yyyy-MM-dd).
    // Por eso la convertimos a string con toISOString().substring(0, 10).
    const dto: IncidentDTO = {
      idIncident: this.id,
      incidentDate: this.form.value.incidentDate.toISOString().substring(0, 10),
      description: this.form.value.description,
      status: this.form.value.status,
      inspectionId: this.form.value.inspectionId,
      pestTypeId: this.form.value.pestTypeId,
    }

    this.s.updateIncident(dto).subscribe({
      next: () => {
        this.mensaje = 'Actualizado correctamente!!'
        this.cdr.detectChanges()
        this.router.navigate(['/incidentes/listar'])
      },
      error: (error) => {
        console.log(error)
        this.mensaje = 'Error al actualizar!!'
        this.cdr.detectChanges()
      }
    })
  }
}
