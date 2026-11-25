import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PestTypeDTO } from '../../../models/PestTypeDTO';
import { Pestservice } from '../../../services/pestservice';
import { Loginservice } from '../../../services/loginservice';

/** Catalogo visual de plagas: se toca una plaga y se ve su ficha (foto, riesgo, descripcion y control recomendado). */
@Component({
  selector: 'app-pestcatalogcomponent',
  imports: [MatIconModule, MatButtonModule, RouterLink],
  templateUrl: './pestcatalogcomponent.html',
  styleUrl: './pestcatalogcomponent.css',
})
export class Pestcatalogcomponent implements OnInit {

  plagas: PestTypeDTO[] = []
  cargando: boolean = true
  mensaje: string = ''
  seleccionada: PestTypeDTO | null = null
  // Fotos de iNaturalist por id de plaga y controles ya consultados (para no gastar cuota de IA dos veces)
  fotos: Record<number, string> = {}
  controles: Record<number, string> = {}
  consultando: boolean = false

  constructor(
    private s: Pestservice,
    private loginS: Loginservice,
    private cdr: ChangeDetectorRef
  ) { }

  // Solo ADMIN y SUPERVISOR pueden usar la IA (igual que el back)
  puedeEscribir(): boolean {
    return this.loginS.tieneRol('ROLE_ADMIN', 'ROLE_SUPERVISOR')
  }

  ngOnInit(): void {
    this.s.getPests().subscribe({
      next: data => {
        this.cargando = false
        this.plagas = data
        data.forEach(p => this.buscarFoto(p))
        this.cdr.detectChanges()
      }, error: err => {
        this.cargando = false
        this.mensaje = 'No se pudo cargar el catálogo. Intente nuevamente.'
        this.cdr.detectChanges()
      }
    })
  }

  // La tabla de plagas no guarda foto: se busca la especie por nombre en iNaturalist
  private buscarFoto(p: PestTypeDTO): void {
    if (!p.name || p.idPestType == null) return
    const id = p.idPestType
    this.s.searchSpecies(p.name).subscribe({
      next: especies => {
        const conFoto = especies.find(e => e.photoUrl)
        if (conFoto?.photoUrl) {
          this.fotos[id] = conFoto.photoUrl
          this.cdr.detectChanges()
        }
      }, error: () => { }
    })
  }

  elegir(p: PestTypeDTO): void {
    this.seleccionada = p
    this.mensaje = ''
  }

  claseRiesgo(riesgo: string | null | undefined): string {
    return 'riesgo-' + String(riesgo ?? '').toLocaleLowerCase()
  }

  // Pide a la IA el insecticida o metodo de control de la plaga elegida
  verControl(): void {
    const p = this.seleccionada
    if (!p || p.idPestType == null || this.controles[p.idPestType]) return
    const id = p.idPestType
    this.consultando = true
    this.mensaje = ''
    const texto = `Plaga: ${p.name}. ${p.description}. Indica el insecticida o método de control recomendado y una medida de prevención.`
    this.s.identifyPest({ text: texto, imageBase64: '', mimeType: '' }).subscribe({
      next: resp => {
        this.controles[id] = resp.answer
        this.consultando = false
        this.cdr.detectChanges()
      }, error: err => {
        this.consultando = false
        this.mensaje = err.status === 429
          ? 'La IA alcanzó su límite de consultas. Espere un minuto e intente de nuevo.'
          : 'No se pudo consultar la IA en este momento.'
        this.cdr.detectChanges()
      }
    })
  }
}
