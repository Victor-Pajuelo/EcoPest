import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
  selector: 'app-userinsertcomponent',
  imports: [ReactiveFormsModule, MatInputModule, MatFormFieldModule, MatButtonModule, MatSelectModule, MatCheckboxModule],
  templateUrl: './userinsertcomponent.html',
  styleUrl: './userinsertcomponent.css',
})
export class Userinsertcomponent implements OnInit {

  form: any
  mensaje: string = ''
  roles: any[] = []
  empresas: any[] = []

  constructor(
    private s: Userservice,
    private fb: FormBuilder,
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
  }

  insertarUsuario(): void {
    if (this.form.get('email').invalid) {
      this.mensaje = 'Escriba un correo válido, por ejemplo nombre@correo.com'
      return
    }
    if (this.form.invalid) {
      this.mensaje = 'Por favor, complete todos los campos correctamente!!'
      return
    }
    const dto: UserDTO = {
      idUser: null,
      name: this.form.value.name,
      email: this.form.value.email,
      password: this.form.value.password,
      roleId: this.form.value.roleId,
      businessEntityId: this.form.value.businessEntityId,
      active: this.form.value.active,
    }

    this.s.insertUser(dto).subscribe({
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
