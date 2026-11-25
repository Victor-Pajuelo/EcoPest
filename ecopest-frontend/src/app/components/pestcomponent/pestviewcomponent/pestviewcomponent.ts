import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PestTypeDTO } from '../../../models/PestTypeDTO';
import { Pestservice } from '../../../services/pestservice';

@Component({
  selector: 'app-pestviewcomponent',
  imports: [MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './pestviewcomponent.html',
  styleUrl: './pestviewcomponent.css',
})
export class Pestviewcomponent implements OnInit {

  plaga: PestTypeDTO = new PestTypeDTO()
  mensaje: string = ''
  foto: string = ''

  constructor(
    private s: Pestservice,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'))

    this.s.getPestById(id).subscribe({
      next: data => {
        this.plaga = data
        this.buscarFoto()
        this.cdr.detectChanges()
      }, error: err => {
        this.mensaje = 'No se encontró la plaga!!'
        this.cdr.detectChanges()
      }
    })
  }

  // La tabla de plagas no guarda foto: se busca la especie por nombre en iNaturalist y se usa la primera con foto
  buscarFoto(): void {
    if (!this.plaga.name) return
    this.s.searchSpecies(this.plaga.name).subscribe({
      next: especies => {
        const conFoto = especies.find(e => e.photoUrl)
        this.foto = conFoto?.photoUrl ?? ''
        this.cdr.detectChanges()
      }, error: () => {
        this.foto = ''
      }
    })
  }
}
