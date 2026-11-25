import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Loginservice } from '../../services/loginservice';

// Pagina publica de presentacion: se ve sin iniciar sesion
@Component({
  selector: 'app-landingcomponent',
  imports: [RouterLink, MatIconModule, MatButtonModule],
  templateUrl: './landingcomponent.html',
  styleUrl: './landingcomponent.css',
})
export class Landingcomponent {

  funciones: any[] = [
    { icono: 'fact_check', titulo: 'Inspecciones', texto: 'Programa y registra las visitas a cada empresa o sede.' },
    { icono: 'warning', titulo: 'Incidentes', texto: 'Reporta plagas encontradas con su tipo, estado y fecha.' },
    { icono: 'photo_camera', titulo: 'Evidencias', texto: 'Adjunta fotos, videos o informes a cada incidente.' },
    { icono: 'auto_awesome', titulo: 'Recomendaciones con IA', texto: 'Genera acciones de control a partir de los datos del incidente.' },
    { icono: 'cloud', titulo: 'Clima y riesgo', texto: 'Temperatura, humedad y riesgo de plaga de los próximos días.' },
    { icono: 'bar_chart', titulo: 'Reportes', texto: 'Gráficos de incidencias, inspecciones y clima por empresa.' },
  ]

  pasos: any[] = [
    { numero: 1, titulo: 'Inspecciona', texto: 'El inspector visita la empresa y registra la inspección.' },
    { numero: 2, titulo: 'Reporta', texto: 'Si encuentra una plaga, crea el incidente y sube evidencias.' },
    { numero: 3, titulo: 'Actúa', texto: 'El sistema sugiere recomendaciones y se hace el seguimiento.' },
  ]

  integrantes: string[] = ['Victor Pajuelo', 'Nicolás Sarango', 'Adriano Vergel', 'Jordan Nieva']

  constructor(private loginS: Loginservice) { }

  // Si ya hay sesion, el boton lleva al sistema en lugar del login
  haySesion(): boolean {
    return this.loginS.verificar()
  }
}
