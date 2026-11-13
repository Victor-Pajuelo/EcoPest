import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  selector: 'app-inspectioninsertcomponent',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatSelectModule, MatDatepickerModule],
  templateUrl: './inspectioninsertcomponent.html',
  providers: [provideNativeDateAdapter()],
  styleUrl: './inspectioninsertcomponent.css',
})
export class Inspectioninsertcomponent implements OnInit {

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
  }

  insertarInspeccion(): void {
    if (this.form.invalid) {
      this.mensaje = 'Por favor, complete todos los campos correctamente!!'
      return
    }
    // El datepicker entrega un objeto Date, pero el backend recibe la fecha como texto (yyyy-MM-dd).
    // Por eso la convertimos a string con toISOString().substring(0, 10).
    const dto: InspectionDTO = {
      idInspection: null,
      inspectionDate: this.form.value.inspectionDate.toISOString().substring(0, 10),
      status: this.form.value.status,
      observations: this.form.value.observations,
      businessEntityId: this.form.value.businessEntityId,
      userId: this.form.value.userId,
    }

    this.s.insertInspection(dto).subscribe({
      next: () => {
        this.mensaje = 'Registro guardado correctamente!!'
        this.form.reset({inspectionDate: new Date()})
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
