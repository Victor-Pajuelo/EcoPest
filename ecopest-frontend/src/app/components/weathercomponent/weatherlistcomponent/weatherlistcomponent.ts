import { Confirmservice } from '../../confirmdialog/confirmdialog'
import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Loginservice } from '../../../services/loginservice';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { WeatherDataDTO } from '../../../models/WeatherDataDTO';
import { Weatherservice } from '../../../services/weatherservice';
import { Businessservice } from '../../../services/businessservice';

@Component({
  selector: 'app-weatherlistcomponent',
  imports: [DatePipe, MatTableModule, MatPaginatorModule, MatIconModule, MatButtonModule, MatFormFieldModule, MatSelectModule, RouterLink],
  templateUrl: './weatherlistcomponent.html',
  styleUrl: './weatherlistcomponent.css',
})
export class Weatherlistcomponent implements OnInit {

  // ADMIN y SUPERVISOR pueden registrar y editar; solo ADMIN elimina
  puedeEscribir(): boolean {
    return this.loginS.tieneRol('ROLE_ADMIN', 'ROLE_SUPERVISOR');
  }

  esAdmin(): boolean {
    return this.loginS.tieneRol('ROLE_ADMIN');
  }

  displayedColumns: string[] = ['C2', 'C3', 'C4', 'C5', 'C6', 'C7']
  dataSource: WeatherDataDTO[] = []
  cargando: boolean = true
  terminoBusqueda: string = ''
  // Paginacion: 5 registros por pagina
  readonly tamPagina: number = 5
  pagina: number = 0
  mensaje: string = ''
  empresas: any[] = []
  empresaSeleccionada: number | null = null
  sincronizando: boolean = false

  constructor(
    private loginS: Loginservice,
    private s: Weatherservice,
    private cdr: ChangeDetectorRef,
    private confirmS: Confirmservice,
    private businessS: Businessservice
  ) { }

  ngOnInit(): void {
    this.obtenerClima()
    this.businessS.getBusinesses().subscribe({
      next: data => {
        this.empresas = data
        this.cdr.detectChanges()
      }, error: err => {
      }
    })
  }

  obtenerClima(): void {
    this.s.getWeatherRecords().subscribe({
      next: data => {
        this.cargando = false
        this.dataSource = data
        this.cdr.detectChanges()
      }, error: err => {
        this.cargando = false
        this.cdr.detectChanges()
      }
    })
  }

  actualizarBusqueda(event: Event): void {
    if (event.target instanceof HTMLInputElement) {
      this.terminoBusqueda = event.target.value
      this.pagina = 0
    }
  }

  limpiarBusqueda(): void {
    this.terminoBusqueda = ''
    this.pagina = 0
  }

  // Si se borra o filtra y la pagina queda vacia, se muestra la ultima pagina con datos
  get paginaActual(): number {
    const ultima = Math.max(0, Math.ceil(this.filasFiltradas.length / this.tamPagina) - 1)
    return Math.min(this.pagina, ultima)
  }

  get filasPagina() {
    const inicio = this.paginaActual * this.tamPagina
    return this.filasFiltradas.slice(inicio, inicio + this.tamPagina)
  }

  cambiarPagina(event: PageEvent): void {
    this.pagina = event.pageIndex
  }

  get filasFiltradas(): WeatherDataDTO[] {
    const termino = this.terminoBusqueda.trim().toLocaleLowerCase()
    const deEmpresa = this.dataSource
      .filter(c => this.empresaSeleccionada == null || c.businessEntityId === this.empresaSeleccionada)
      .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    if (!termino) {
      return deEmpresa
    }

    return deEmpresa.filter(clima =>
      [
        clima.idWeatherData,
        clima.date,
        clima.temperature,
        clima.humidity,
        clima.source,
        this.nombreEmpresa(clima.businessEntityId)
      ].some(valor => String(valor ?? '').toLocaleLowerCase().includes(termino))
    )
  }

  eliminarClima(id: number): void {
    this.confirmS.preguntar(`¿Seguro que deseas eliminar el registro de clima #${id}? Esta acción no se puede deshacer.`).subscribe(ok => {
      if (!ok) {
        return
      }

      this.s.deleteWeather(id).subscribe({
        next: () => {
          this.mensaje = ''
          this.obtenerClima()
          this.cdr.detectChanges()
        }, error: err => {
          this.mensaje = 'No se pudo eliminar: el registro está siendo usado por otro.'
          this.cdr.detectChanges()
        }
      })
    })
  }

  // Trae el clima actual del lugar de la empresa (Open-Meteo a través del backend) y lo guarda
  sincronizarClima(): void {
    if (this.empresaSeleccionada == null) {
      this.mensaje = 'Seleccione una empresa para ver su clima'
      return
    }
    this.sincronizando = true
    this.mensaje = 'Consultando el clima…'
    // El backend usa la ubicacion guardada en la empresa
    this.s.syncWeather(this.empresaSeleccionada).subscribe({
      next: () => {
        this.sincronizando = false
        this.mensaje = 'Clima actualizado correctamente'
        this.obtenerClima()
        this.cdr.detectChanges()
      }, error: err => {
        this.sincronizando = false
        this.mensaje = 'No se pudo sincronizar el clima. Intente nuevamente en unos segundos.'
        this.cdr.detectChanges()
      }
    })
  }

  elegirEmpresa(id: number | null): void {
    this.empresaSeleccionada = id
    this.pagina = 0
    this.mensaje = ''
  }

  // Registro mas reciente de la empresa elegida (se muestra en la tarjeta)
  get ultimo(): WeatherDataDTO | null {
    if (this.empresaSeleccionada == null) return null
    const lista = this.dataSource
      .filter(c => c.businessEntityId === this.empresaSeleccionada)
      .sort((a, b) => String(b.date).localeCompare(String(a.date)))
    return lista[0] ?? null
  }

  ubicacionEmpresa(): string {
    const e = this.empresas.find(item => item.idBusinessEntity === this.empresaSeleccionada)
    return e && e.latitude != null ? `${e.latitude}, ${e.longitude}` : 'Lima (ubicación por defecto)'
  }

  nombreEmpresa(id: number | null): string {
    const x = this.empresas.find(item => item.idBusinessEntity === id)
    return x ? x.name : ''
  }
}
