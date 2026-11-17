import { ChangeDetectorRef, Component, EventEmitter, Output } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SpeciesDTO } from '../../../models/SpeciesDTO';
import { Pestservice } from '../../../services/pestservice';

@Component({
  selector: 'app-speciessearchcomponent',
  imports: [MatInputModule, MatFormFieldModule, MatButtonModule, MatIconModule],
  templateUrl: './speciessearchcomponent.html',
  styleUrl: './speciessearchcomponent.css',
})
export class Speciessearchcomponent {

  @Output() seleccionada = new EventEmitter<SpeciesDTO>()

  resultados: SpeciesDTO[] = []
  mensaje: string = ''
  buscando: boolean = false

  constructor(private s: Pestservice, private cdr: ChangeDetectorRef) { }

  buscar(texto: string): void {
    this.resultados = []
    if (texto.trim().length < 3) {
      this.mensaje = 'Escriba al menos 3 letras'
      return
    }
    this.buscando = true
    this.mensaje = ''
    this.s.searchSpecies(texto.trim()).subscribe({
      next: data => {
        this.resultados = data
        this.buscando = false
        if (data.length === 0) {
          this.mensaje = 'No se encontraron especies'
        }
        this.cdr.detectChanges()
      }, error: err => {
        console.log(err)
        this.buscando = false
        this.mensaje = 'No se pudo consultar iNaturalist'
        this.cdr.detectChanges()
      }
    })
  }

  // iNaturalist devuelve la categoría en inglés; se muestra en español
  traducirRango(rango: string): string {
    const rangos: any = {
      kingdom: 'reino', phylum: 'filo', class: 'clase', order: 'orden', suborder: 'suborden', infraorder: 'infraorden',
      superfamily: 'superfamilia', family: 'familia', subfamily: 'subfamilia', tribe: 'tribu', genus: 'género',
      species: 'especie', subspecies: 'subespecie'
    }
    return rangos[rango] || rango
  }

  elegir(especie: SpeciesDTO): void {
    this.seleccionada.emit({ ...especie, rank: this.traducirRango(especie.rank) })
    this.resultados = []
    this.mensaje = 'Datos copiados al formulario'
  }
}
