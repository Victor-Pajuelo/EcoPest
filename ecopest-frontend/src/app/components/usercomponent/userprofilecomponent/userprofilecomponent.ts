import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserDTO } from '../../../models/UserDTO';
import { Userservice } from '../../../services/userservice';
import { Roleservice } from '../../../services/roleservice';
import { Businessservice } from '../../../services/businessservice';

@Component({
  selector: 'app-userprofilecomponent',
  imports: [MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './userprofilecomponent.html',
  styleUrl: './userprofilecomponent.css',
})
export class Userprofilecomponent implements OnInit {

  usuario: UserDTO = new UserDTO()
  rol: string = ''
  empresa: string = ''
  mensaje: string = ''

  constructor(
    private s: Userservice,
    private roleS: Roleservice,
    private businessS: Businessservice,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'))

    this.s.getUserById(id).subscribe({
      next: data => {
        this.usuario = data
        this.buscarRol()
        this.buscarEmpresa()
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
        this.mensaje = 'No se encontró el usuario!!'
        this.cdr.detectChanges()
      }
    })
  }

  buscarRol(): void {
    this.roleS.getRoles().subscribe({
      next: data => {
        const r = data.find(item => item.idRole === this.usuario.roleId)
        this.rol = r ? r.name : ''
        this.cdr.detectChanges()
      }, error: err => console.log(err)
    })
  }

  buscarEmpresa(): void {
    this.businessS.getBusinesses().subscribe({
      next: data => {
        const b = data.find(item => item.idBusinessEntity === this.usuario.businessEntityId)
        this.empresa = b ? b.name : ''
        this.cdr.detectChanges()
      }, error: err => console.log(err)
    })
  }
}
