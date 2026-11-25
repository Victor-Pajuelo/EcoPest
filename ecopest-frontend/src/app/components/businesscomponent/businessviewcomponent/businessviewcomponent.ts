import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { BusinessDTO } from '../../../models/BusinessDTO';
import { Businessservice } from '../../../services/businessservice';

@Component({
  selector: 'app-businessviewcomponent',
  imports: [MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './businessviewcomponent.html',
  styleUrl: './businessviewcomponent.css',
})
export class Businessviewcomponent implements OnInit {

  empresa: BusinessDTO = new BusinessDTO()
  empresaPadre: string = ''
  mensaje: string = ''

  constructor(
    private s: Businessservice,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'))

    this.s.getBusinessById(id).subscribe({
      next: data => {
        this.empresa = data
        // Si pertenece a otra empresa (sede o local), se muestra el nombre de la empresa padre
        if (data.parentBusinessEntityId) {
          this.s.getBusinessById(data.parentBusinessEntityId).subscribe(padre => {
            this.empresaPadre = padre.name
            this.cdr.detectChanges()
          })
        }
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
        this.mensaje = 'No se encontró la empresa!!'
        this.cdr.detectChanges()
      }
    })
  }
}
