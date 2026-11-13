import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { PestTypeDTO } from '../../../models/PestTypeDTO';
import { Pestservice } from '../../../services/pestservice';

@Component({
  selector: 'app-pestupdatecomponent',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatSelectModule],
  templateUrl: './pestupdatecomponent.html',
  styleUrl: './pestupdatecomponent.css',
})
export class Pestupdatecomponent implements OnInit {

  id: any = null
  item: any
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
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      riskLevel: ['', [Validators.required]],
      description: ['', [Validators.required]]
    })
  }

  ngOnInit(): void {
    // Recuperar el id desde la URL
    this.id = Number(this.route.snapshot.paramMap.get('id'))

    if (!this.id || isNaN(this.id)) {
      this.mensaje = 'ID inválido'
      return
    }

    this.buscarPorId()
  }

  buscarPorId(): void {
    this.s.getPestById(this.id).subscribe({
      next: (data: PestTypeDTO) => {
        this.item = data
        this.form.patchValue({
          name: data.name,
          riskLevel: data.riskLevel,
          description: data.description
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

  actualizarPlaga(): void {
    if (this.form.invalid) {
      this.mensaje = 'Por favor, complete todos los campos correctamente!!'
      return
    }
    const dto: PestTypeDTO = {
      idPestType: this.id,
      name: this.form.value.name,
      riskLevel: this.form.value.riskLevel,
      description: this.form.value.description,
    }

    this.s.updatePest(dto).subscribe({
      next: () => {
        this.mensaje = 'Actualizado correctamente!!'
        this.cdr.detectChanges()
        this.router.navigate(['/plagas/listar'])
      },
      error: (error) => {
        console.log(error)
        this.mensaje = 'Error al actualizar!!'
        this.cdr.detectChanges()
      }
    })
  }
}
