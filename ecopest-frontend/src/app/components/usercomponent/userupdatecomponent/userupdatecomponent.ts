import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { UserDTO } from '../../../models/UserDTO';
import { Userservice } from '../../../services/userservice';
import { Roleservice } from '../../../services/roleservice';
import { Businessservice } from '../../../services/businessservice';

@Component({
  selector: 'app-userupdatecomponent',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatSelectModule, MatCheckboxModule],
  templateUrl: './userupdatecomponent.html',
  styleUrl: './userupdatecomponent.css',
})
export class Userupdatecomponent implements OnInit {

  id: any = null
  item: any
  form: any
  mensaje: string = ''
  roles: any[] = []
  empresas: any[] = []

  constructor(
    private s: Userservice,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    private roleS: Roleservice,
    private businessS: Businessservice
  ) {
    this.form = this.fb.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[^@\\s]+@[^@\\s]+\\.[a-zA-Z]{2,}$')]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      roleId: [null, [Validators.required]],
      businessEntityId: [null, [Validators.required]],
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
    this.roleS.getRoles().subscribe({
      next: data => {
        this.roles = data
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
      }
    })
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
    this.s.getUserById(this.id).subscribe({
      next: (data: UserDTO) => {
        this.item = data
        this.form.patchValue({
          name: data.name,
          email: data.email,
          roleId: data.roleId,
          businessEntityId: data.businessEntityId,
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

  actualizarUsuario(): void {
    if (this.form.get('email').invalid) {
      this.mensaje = 'Escriba un correo válido, por ejemplo nombre@correo.com'
      return
    }
    if (this.form.invalid) {
      this.mensaje = 'Por favor, complete todos los campos correctamente!!'
      return
    }
    const dto: UserDTO = {
      idUser: this.id,
      name: this.form.value.name,
      email: this.form.value.email,
      password: this.form.value.password,
      roleId: this.form.value.roleId,
      businessEntityId: this.form.value.businessEntityId,
      active: this.form.value.active,
    }

    this.s.updateUser(dto).subscribe({
      next: () => {
        this.mensaje = 'Actualizado correctamente!!'
        this.cdr.detectChanges()
        this.router.navigate(['/usuarios/listar'])
      },
      error: (error) => {
        console.log(error)
        this.mensaje = 'Error al actualizar!!'
        this.cdr.detectChanges()
      }
    })
  }
}
