import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { RoleDTO } from '../../../models/RoleDTO';
import { Roleservice } from '../../../services/roleservice';

@Component({
  selector: 'app-roleupdatecomponent',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatCheckboxModule],
  templateUrl: './roleupdatecomponent.html',
  styleUrl: './roleupdatecomponent.css',
})
export class Roleupdatecomponent implements OnInit {

  id: any = null
  item: any
  form: any
  mensaje: string = ''

  constructor(
    private s: Roleservice,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      description: ['', [Validators.required]],
      active: [true, []]
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
    this.s.getRoleById(this.id).subscribe({
      next: (data: RoleDTO) => {
        this.item = data
        this.form.patchValue({
          name: data.name,
          description: data.description,
          active: data.active
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

  actualizarRol(): void {
    if (this.form.invalid) {
      this.mensaje = 'Por favor, complete todos los campos correctamente!!'
      return
    }
    const dto: RoleDTO = {
      idRole: this.id,
      name: this.form.value.name,
      description: this.form.value.description,
      active: this.form.value.active,
    }

    this.s.updateRole(dto).subscribe({
      next: () => {
        this.mensaje = 'Actualizado correctamente!!'
        this.cdr.detectChanges()
        this.router.navigate(['/roles/listar'])
      },
      error: (error) => {
        console.log(error)
        this.mensaje = 'Error al actualizar!!'
        this.cdr.detectChanges()
      }
    })
  }
}
