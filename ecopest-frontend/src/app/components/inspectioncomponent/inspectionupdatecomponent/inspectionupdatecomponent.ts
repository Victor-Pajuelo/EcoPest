import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { InspectionDTO } from '../../../models/InspectionDTO';
import { Inspectionservice } from '../../../services/inspectionservice';
import { Businessservice } from '../../../services/businessservice';
import { Userservice } from '../../../services/userservice';

@Component({
  selector: 'app-inspectionupdatecomponent',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatSelectModule, MatDatepickerModule],
  templateUrl: './inspectionupdatecomponent.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './inspectionupdatecomponent.css',
})
export class Inspectionupdatecomponent implements OnInit {

  id: any = null
  item: any
  form: any
  mensaje: string = ''
  estados: any[] = [
    { value: 'PROGRAMADA', viewValue: 'Programada' },
    { value: 'REALIZADA', viewValue: 'Realizada' },
  ];

  empresas: any[] = []
  usuarios: any[] = []

  constructor(
    private s: Inspectionservice,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private businessS: Businessservice,
    private userS: Userservice
  ) {
    this.form = this.fb.group({
      inspectionDate: [new Date(), [Validators.required]],
      status: ['', [Validators.required]],
      observations: ['', [Validators.required]],
      businessEntityId: [null, [Validators.required]],
      userId: [null, [Validators.required]]
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
    this.userS.getUsers().subscribe({
      next: data => {
        this.usuarios = data
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
      }
    })

    this.buscarPorId()
  }

  buscarPorId(): void {
    this.s.getInspectionById(this.id).subscribe({
      next: (data: InspectionDTO) => {
        this.item = data
        this.form.patchValue({
          inspectionDate: new Date(data.inspectionDate + 'T00:00:00'),
          status: data.status,
          observations: data.observations,
          businessEntityId: data.businessEntityId,
          userId: data.userId
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

  actualizarInspeccion(): void {
    if (this.form.invalid) {
      this.mensaje = 'Por favor, complete todos los campos correctamente!!'
      return
    }
    // El datepicker entrega un objeto Date, pero el backend recibe la fecha como texto (yyyy-MM-dd).
    // Por eso la convertimos a string con toISOString().substring(0, 10).
    const dto: InspectionDTO = {
      idInspection: this.id,
      inspectionDate: this.form.value.inspectionDate.toISOString().substring(0, 10),
      status: this.form.value.status,
      observations: this.form.value.observations,
      businessEntityId: this.form.value.businessEntityId,
      userId: this.form.value.userId,
    }

    this.s.updateInspection(dto).subscribe({
      next: () => {
        this.mensaje = 'Actualizado correctamente!!'
        this.cdr.detectChanges()
        this.router.navigate(['/inspecciones/listar'])
      },
      error: (error) => {
        console.log(error)
        this.mensaje = 'Error al actualizar!!'
        this.cdr.detectChanges()
      }
    })
  }
}
