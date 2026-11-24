import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { MatIconModule } from '@angular/material/icon';
import { Menucomponent } from '../menucomponent/menucomponent';
import { Reportservice } from '../../services/reportservice';
import { Weatherservice } from '../../services/weatherservice';
import { Businessservice } from '../../services/businessservice';
import { Userservice } from '../../services/userservice';
import { Inspectionservice } from '../../services/inspectionservice';
import { Incidentservice } from '../../services/incidentservice';
import { Recommendationservice } from '../../services/recommendationservice';
import { CountDTO } from '../../models/CountDTO';
import { AverageWeatherDTO } from '../../models/AverageWeatherDTO';

@Component({
  selector: 'app-graficoscomponent',
  imports: [BaseChartDirective, MatIconModule, Menucomponent],
  templateUrl: './graficoscomponent.html',
  styleUrl: './graficoscomponent.css',
})
export class Graficoscomponent implements OnInit {

  mensaje: string = 'Cargando datos del servidor, puede tardar unos segundos...'

  // Tarjetas con los totales
  totalEmpresas: number = 0
  totalUsuarios: number = 0
  totalInspecciones: number = 0
  totalIncidentes: number = 0
  totalRecomendaciones: number = 0

  // Colores verdes de EcoPest para las porciones y las barras
  colores: string[] = ['#0aae4e', '#5df160', '#8df9c0', '#67ad87', '#bbf580', '#f5c542', '#f28b82']

  // Colores por nivel de riesgo: verde = bajo, amarillo = medio, rojo = alto
  coloresRiesgo: any = { BAJO: '#0aae4e', MEDIO: '#f5c542', ALTO: '#f28b82' }

  // Grafico 1: incidentes por plaga (barras)
  plagaData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ label: 'Incidentes', data: [], backgroundColor: this.colores, borderWidth: 1 }],
  }

  // Grafico 2: incidentes por nivel de riesgo (dona)
  riesgoData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [{ label: 'Incidentes', data: [], backgroundColor: this.colores, borderWidth: 1 }],
  }

  // Grafico 3: inspecciones por empresa (barras horizontales)
  inspeccionData: ChartData<'bar'> = {
    labels: [],
    datasets: [{ label: 'Inspecciones', data: [], backgroundColor: '#0aae4e', borderWidth: 1 }],
  }

  // Grafico 4: usuarios por rol (torta)
  rolData: ChartData<'pie'> = {
    labels: [],
    datasets: [{ label: 'Usuarios', data: [], backgroundColor: this.colores, borderWidth: 1 }],
  }

  // Grafico 5: promedio de temperatura y humedad por empresa (barras agrupadas)
  climaData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { label: 'Temperatura (°C)', data: [], backgroundColor: '#f5c542', borderWidth: 1 },
      { label: 'Humedad (%)', data: [], backgroundColor: '#67ad87', borderWidth: 1 },
    ],
  }

  // Opciones para torta y dona
  opcionesTorta: ChartOptions<'pie' | 'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'bottom' },
    },
  }

  // Opciones para barras verticales (una sola serie, sin leyenda)
  opcionesBarras: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, ticks: { precision: 0 } },
    },
  }

  // Opciones para barras horizontales
  opcionesBarrasH: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: {
      legend: { display: false },
    },
    scales: {
      x: { beginAtZero: true, ticks: { precision: 0 } },
    },
  }

  // Opciones para el clima (dos series, con leyenda)
  opcionesClima: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  }

  constructor(
    private rS: Reportservice,
    private weatherS: Weatherservice,
    private businessS: Businessservice,
    private userS: Userservice,
    private inspectionS: Inspectionservice,
    private incidentS: Incidentservice,
    private recommendationS: Recommendationservice,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.obtenerTotales()
    this.obtenerGraficos()
  }

  obtenerTotales(): void {
    this.businessS.getBusinesses().subscribe({
      next: data => {
        this.totalEmpresas = data.length
        this.cdr.detectChanges()
      }, error: err => this.mostrarError(err)
    })
    this.userS.getUsers().subscribe({
      next: data => {
        this.totalUsuarios = data.length
        this.cdr.detectChanges()
      }, error: err => this.mostrarError(err)
    })
    this.inspectionS.getInspections().subscribe({
      next: data => {
        this.totalInspecciones = data.length
        this.cdr.detectChanges()
      }, error: err => this.mostrarError(err)
    })
    this.incidentS.getIncidents().subscribe({
      next: data => {
        this.totalIncidentes = data.length
        this.cdr.detectChanges()
      }, error: err => this.mostrarError(err)
    })
    this.recommendationS.getRecommendations().subscribe({
      next: data => {
        this.totalRecomendaciones = data.length
        this.cdr.detectChanges()
      }, error: err => this.mostrarError(err)
    })
  }

  obtenerGraficos(): void {
    // 1) Incidentes por plaga
    this.rS.incidentsByPest().subscribe({
      next: (data: CountDTO[]) => {
        this.plagaData = {
          labels: data.map(item => item.name),
          datasets: [{ label: 'Incidentes', data: data.map(item => item.quantity), backgroundColor: this.colores, borderWidth: 1 }],
        }
        this.mensaje = ''
        this.cdr.detectChanges()
      }, error: err => this.mostrarError(err)
    })

    // 2) Incidentes por nivel de riesgo
    this.rS.incidentsByRisk().subscribe({
      next: (data: CountDTO[]) => {
        this.riesgoData = {
          labels: data.map(item => item.name),
          datasets: [{ label: 'Incidentes', data: data.map(item => item.quantity), backgroundColor: data.map(item => this.coloresRiesgo[item.name] || '#67ad87'), borderWidth: 1 }],
        }
        this.mensaje = ''
        this.cdr.detectChanges()
      }, error: err => this.mostrarError(err)
    })

    // 3) Inspecciones por empresa
    this.rS.inspectionsByCompany().subscribe({
      next: (data: CountDTO[]) => {
        this.inspeccionData = {
          labels: data.map(item => item.name),
          datasets: [{ label: 'Inspecciones', data: data.map(item => item.quantity), backgroundColor: '#0aae4e', borderWidth: 1 }],
        }
        this.mensaje = ''
        this.cdr.detectChanges()
      }, error: err => this.mostrarError(err)
    })

    // 4) Usuarios por rol
    this.rS.usersByRole().subscribe({
      next: (data: CountDTO[]) => {
        this.rolData = {
          labels: data.map(item => item.name),
          datasets: [{ label: 'Usuarios', data: data.map(item => item.quantity), backgroundColor: this.colores, borderWidth: 1 }],
        }
        this.mensaje = ''
        this.cdr.detectChanges()
      }, error: err => this.mostrarError(err)
    })

    // 5) Promedio de clima por empresa
    this.weatherS.getAverages().subscribe({
      next: (data: AverageWeatherDTO[]) => {
        this.climaData = {
          labels: data.map(item => item.name),
          datasets: [
            { label: 'Temperatura (°C)', data: data.map(item => item.avgTemperature), backgroundColor: '#f5c542', borderWidth: 1 },
            { label: 'Humedad (%)', data: data.map(item => item.avgHumidity), backgroundColor: '#67ad87', borderWidth: 1 },
          ],
        }
        this.mensaje = ''
        this.cdr.detectChanges()
      }, error: err => this.mostrarError(err)
    })
  }

  mostrarError(err: any): void {
    console.log(err)
    this.mensaje = 'No se pudieron cargar algunos datos. Revise que el servidor esté activo.'
    this.cdr.detectChanges()
  }
}
