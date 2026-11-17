import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RoleDTO } from '../../../models/RoleDTO';
import { Roleservice } from '../../../services/roleservice';

@Component({
  selector: 'app-roleinsertcomponent',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatCheckboxModule],
  templateUrl: './roleinsertcomponent.html',
  styleUrl: './roleinsertcomponent.css',
})
export class Roleinsertcomponent {

  form: any
  mensaje: string = ''

  constructor(
    private s: Roleservice,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      active: [true, []]
    })
  }

  insertarRol(): void {
    if (this.form.invalid) {
      this.mensaje = 'Por favor, complete todos los campos correctamente!!'
      return
    }
    const dto: RoleDTO = {
      idRole: null,
      name: this.form.value.name,
      description: this.form.value.description,
      active: this.form.value.active,
    }

    this.s.insertRole(dto).subscribe({
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
