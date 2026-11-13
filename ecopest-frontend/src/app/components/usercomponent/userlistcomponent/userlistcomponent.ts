import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { UserDTO } from '../../../models/UserDTO';
import { Userservice } from '../../../services/userservice';
import { Roleservice } from '../../../services/roleservice';

@Component({
  selector: 'app-userlistcomponent',
  imports: [MatTableModule, MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './userlistcomponent.html',
  styleUrl: './userlistcomponent.css',
})
export class Userlistcomponent implements OnInit {

  displayedColumns: string[] = ['C1', 'C2', 'C3', 'C4']
  dataSource: UserDTO[] = []
  mensaje: string = ''
  roles: any[] = []

  constructor(
    private s: Userservice,
    private cdr: ChangeDetectorRef,
    private roleS: Roleservice
  ) { }

  ngOnInit(): void {
    this.obtenerUsuarios()
    this.roleS.getRoles().subscribe({
      next: data => {
        this.roles = data
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
      }
    })
  }

  obtenerUsuarios(): void {
    this.s.getUsers().subscribe({
      next: data => {
        this.dataSource = data
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
        this.cdr.detectChanges()
      }
    })
  }

  eliminarUsuario(id: number): void {
    this.s.deleteUser(id).subscribe({
      next: () => {
        this.mensaje = ''
        this.obtenerUsuarios()
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
        this.mensaje = 'No se pudo eliminar: el registro está siendo usado por otro.'
        this.cdr.detectChanges()
      }
    })
  }

  nombreRol(id: number | null): string {
    const x = this.roles.find(item => item.idRole === id)
    return x ? x.name : ''
  }
}
