import { ChangeDetectorRef, Component } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { PestTypeDTO } from '../../../models/PestTypeDTO';
import { Pestservice } from '../../../services/pestservice';

@Component({
  selector: 'app-pestinsertcomponent',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatSelectModule],
  templateUrl: './pestinsertcomponent.html',
  styleUrl: './pestinsertcomponent.css',
})
export class Pestinsertcomponent {

  form: any
  mensaje: string = ''
  riesgos: any[] = [
    { value: 'BAJO', viewValue: 'Bajo' },
    { value: 'MEDIO', viewValue: 'Medio' },
    { value: 'ALTO', viewValue: 'Alto' },
    { value: 'CRITICO', viewValue: 'Crítico' },
  ];


  constructor(
    private s: Pestservice,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      riskLevel: ['', [Validators.required]],
      description: ['', [Validators.required]]
    })
  }

  insertarPlaga(): void {
    if (this.form.invalid) {
      this.mensaje = 'Por favor, complete todos los campos correctamente!!'
      return
    }
    const dto: PestTypeDTO = {
      idPestType: null,
      name: this.form.value.name,
      riskLevel: this.form.value.riskLevel,
      description: this.form.value.description,
    }

    this.s.insertPest(dto).subscribe({
      next: () => {
        this.mensaje = 'Registro guardado correctamente!!'
        this.form.reset()
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
