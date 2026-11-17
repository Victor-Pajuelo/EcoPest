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
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
        this.mensaje = 'No se encontró la plaga!!'
        this.cdr.detectChanges()
      }
    })
  }
}
