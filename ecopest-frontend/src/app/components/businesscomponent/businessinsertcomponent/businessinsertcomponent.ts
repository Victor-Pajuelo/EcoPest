import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { BusinessDTO } from '../../../models/BusinessDTO';
import { Businessservice } from '../../../services/businessservice';

@Component({
  selector: 'app-businessinsertcomponent',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatSelectModule, MatCheckboxModule],
  templateUrl: './businessinsertcomponent.html',
  styleUrl: './businessinsertcomponent.css',
})
export class Businessinsertcomponent implements OnInit {

  form: any
  mensaje: string = ''
  empresas: any[] = []

  constructor(
    private s: Businessservice,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      type: ['', [Validators.required]],
      parentBusinessEntityId: [null, []],
      active: [true, []]
    })
  }

  ngOnInit(): void {
    this.s.getBusinesses().subscribe({
      next: data => {
        this.empresas = data
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
      }
    })
  }

  insertarEmpresa(): void {
    if (this.form.invalid) {
      this.mensaje = 'Por favor, complete todos los campos correctamente!!'
      return
    }
    const dto: BusinessDTO = {
      idBusinessEntity: null,
      name: this.form.value.name,
      type: this.form.value.type,
      parentBusinessEntityId: this.form.value.parentBusinessEntityId,
      active: this.form.value.active,
      companyName: '',
    }

    this.s.insertBusiness(dto).subscribe({
      next: () => {
        this.mensaje = 'Registro guardado correctamente!!'
        this.form.reset({active: true})
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
