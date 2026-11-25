import { Routes } from '@angular/router';
import { Homecomponent } from './components/homecomponent/homecomponent';
import { Pestcomponent } from './components/pestcomponent/pestcomponent';
import { Pestlistcomponent } from './components/pestcomponent/pestlistcomponent/pestlistcomponent';
import { Pestinsertcomponent } from './components/pestcomponent/pestinsertcomponent/pestinsertcomponent';
import { Pestupdatecomponent } from './components/pestcomponent/pestupdatecomponent/pestupdatecomponent';
import { Pestidentifycomponent } from './components/pestcomponent/pestidentifycomponent/pestidentifycomponent';
import { Pestcatalogcomponent } from './components/pestcomponent/pestcatalogcomponent/pestcatalogcomponent';
import { Pestviewcomponent } from './components/pestcomponent/pestviewcomponent/pestviewcomponent';
import { Businesscomponent } from './components/businesscomponent/businesscomponent';
import { Businesslistcomponent } from './components/businesscomponent/businesslistcomponent/businesslistcomponent';
import { Businessinsertcomponent } from './components/businesscomponent/businessinsertcomponent/businessinsertcomponent';
import { Businessupdatecomponent } from './components/businesscomponent/businessupdatecomponent/businessupdatecomponent';
import { Businessviewcomponent } from './components/businesscomponent/businessviewcomponent/businessviewcomponent';
import { Rolecomponent } from './components/rolecomponent/rolecomponent';
import { Rolelistcomponent } from './components/rolecomponent/rolelistcomponent/rolelistcomponent';
import { Roleinsertcomponent } from './components/rolecomponent/roleinsertcomponent/roleinsertcomponent';
import { Roleupdatecomponent } from './components/rolecomponent/roleupdatecomponent/roleupdatecomponent';
import { Usercomponent } from './components/usercomponent/usercomponent';
import { Userlistcomponent } from './components/usercomponent/userlistcomponent/userlistcomponent';
import { Userinsertcomponent } from './components/usercomponent/userinsertcomponent/userinsertcomponent';
import { Userupdatecomponent } from './components/usercomponent/userupdatecomponent/userupdatecomponent';
import { Userprofilecomponent } from './components/usercomponent/userprofilecomponent/userprofilecomponent';
import { Inspectioncomponent } from './components/inspectioncomponent/inspectioncomponent';
import { Inspectionlistcomponent } from './components/inspectioncomponent/inspectionlistcomponent/inspectionlistcomponent';
import { Inspectioninsertcomponent } from './components/inspectioncomponent/inspectioninsertcomponent/inspectioninsertcomponent';
import { Inspectionupdatecomponent } from './components/inspectioncomponent/inspectionupdatecomponent/inspectionupdatecomponent';
import { Incidentcomponent } from './components/incidentcomponent/incidentcomponent';
import { Incidentlistcomponent } from './components/incidentcomponent/incidentlistcomponent/incidentlistcomponent';
import { Incidentinsertcomponent } from './components/incidentcomponent/incidentinsertcomponent/incidentinsertcomponent';
import { Incidentupdatecomponent } from './components/incidentcomponent/incidentupdatecomponent/incidentupdatecomponent';
import { Incidentviewcomponent } from './components/incidentcomponent/incidentviewcomponent/incidentviewcomponent';
import { Evidencecomponent } from './components/evidencecomponent/evidencecomponent';
import { Evidencelistcomponent } from './components/evidencecomponent/evidencelistcomponent/evidencelistcomponent';
import { Evidenceinsertcomponent } from './components/evidencecomponent/evidenceinsertcomponent/evidenceinsertcomponent';
import { Evidenceupdatecomponent } from './components/evidencecomponent/evidenceupdatecomponent/evidenceupdatecomponent';
import { Evidenceviewcomponent } from './components/evidencecomponent/evidenceviewcomponent/evidenceviewcomponent';
import { Recommendationcomponent } from './components/recommendationcomponent/recommendationcomponent';
import { Recommendationbybusinesscomponent } from './components/recommendationcomponent/recommendationbybusinesscomponent/recommendationbybusinesscomponent';
import { Recommendationlistcomponent } from './components/recommendationcomponent/recommendationlistcomponent/recommendationlistcomponent';
import { Recommendationinsertcomponent } from './components/recommendationcomponent/recommendationinsertcomponent/recommendationinsertcomponent';
import { Recommendationupdatecomponent } from './components/recommendationcomponent/recommendationupdatecomponent/recommendationupdatecomponent';
import { Weathercomponent } from './components/weathercomponent/weathercomponent';
import { Weatherlistcomponent } from './components/weathercomponent/weatherlistcomponent/weatherlistcomponent';
import { Weatherinsertcomponent } from './components/weathercomponent/weatherinsertcomponent/weatherinsertcomponent';
import { Weatherupdatecomponent } from './components/weathercomponent/weatherupdatecomponent/weatherupdatecomponent';
import { Dashboardcomponent } from './components/dashboardcomponent/dashboardcomponent';
import { Graficoscomponent } from './components/graficoscomponent/graficoscomponent';
import { Logincomponent } from './components/logincomponent/logincomponent';
import { Landingcomponent } from './components/landingcomponent/landingcomponent';
import { Terminoscomponent } from './components/terminoscomponent/terminoscomponent';
import { seguridadGuard, rolGuard } from './guards/seguridadguard';

// Roles que pueden crear y editar (igual que SecurityConfig del back)
const ESCRIBIR = ['ROLE_ADMIN', 'ROLE_SUPERVISOR'];
const SOLO_ADMIN = ['ROLE_ADMIN'];
export const routes: Routes = [
  {
    path: 'terminos',
    title: 'Términos y condiciones · EcoPest',
    component: Terminoscomponent,
  },
  {
    path: 'login',
    title: 'Iniciar sesión · EcoPest',
    component: Logincomponent,
  },
  {
    // Landing page publica (sin iniciar sesion)
    path: 'inicio',
    title: 'EcoPest · Control de plagas',
    component: Landingcomponent,
  },
  {
    path: '',
    component: Homecomponent,
    canActivate: [seguridadGuard],
  },
    {
    path: 'dashboard',
    title: 'Dashboard · EcoPest',
    component: Dashboardcomponent,
    canActivate: [seguridadGuard],
  },
  {
    path: 'graficos',
    title: 'Gráficos · EcoPest',
    component: Graficoscomponent,
    canActivate: [seguridadGuard],
  },

  {
    path: 'plagas',
    title: 'Plagas · EcoPest',
    component: Pestcomponent,
    canActivate: [seguridadGuard],
    children: [
      {
        path: '',
        redirectTo: 'listar',
        pathMatch: 'full',
      },
      {
        path: 'listar',
        component: Pestlistcomponent,
      },
      {
        path: 'insertar',
        component: Pestinsertcomponent,
        canActivate: [rolGuard],
        data: { roles: ESCRIBIR },
      },
      {
        path: 'editar/:id',
        component: Pestupdatecomponent,
        canActivate: [rolGuard],
        data: { roles: ESCRIBIR },
      },
      {
        path: 'ver/:id',
        component: Pestviewcomponent,
      },
      {
        path: 'catalogo',
        title: 'Catálogo de plagas · EcoPest',
        component: Pestcatalogcomponent,
      },
      {
        path: 'identificar',
        title: 'Identificar plaga · EcoPest',
        component: Pestidentifycomponent,
      },
    ],
  },

  {
    path: 'empresas',
    title: 'Empresas · EcoPest',
    component: Businesscomponent,
    canActivate: [seguridadGuard],
    children: [
      {
        path: '',
        redirectTo: 'listar',
        pathMatch: 'full',
      },
      {
        path: 'listar',
        component: Businesslistcomponent,
      },
      {
        path: 'insertar',
        component: Businessinsertcomponent,
        canActivate: [rolGuard],
        data: { roles: SOLO_ADMIN },
      },
      {
        path: 'editar/:id',
        component: Businessupdatecomponent,
        canActivate: [rolGuard],
        data: { roles: SOLO_ADMIN },
      },
      {
      path: 'ver/:id',
      component: Businessviewcomponent,
      },
    ],
  },

  {
    path: 'roles',
    title: 'Roles · EcoPest',
    component: Rolecomponent,
    canActivate: [seguridadGuard, rolGuard],
    data: { roles: SOLO_ADMIN },
    children: [
      {
        path: '',
        redirectTo: 'listar',
        pathMatch: 'full',
      },
      {
        path: 'listar',
        component: Rolelistcomponent,
      },
      {
        path: 'insertar',
        component: Roleinsertcomponent,
        canActivate: [rolGuard],
        data: { roles: ESCRIBIR },
      },
      {
        path: 'editar/:id',
        component: Roleupdatecomponent,
        canActivate: [rolGuard],
        data: { roles: ESCRIBIR },
      },
    ],
  },

  {
    path: 'usuarios',
    title: 'Usuarios · EcoPest',
    component: Usercomponent,
    canActivate: [seguridadGuard, rolGuard],
    data: { roles: SOLO_ADMIN },
    children: [
      {
        path: '',
        redirectTo: 'listar',
        pathMatch: 'full',
      },
      {
        path: 'listar',
        component: Userlistcomponent,
      },
      {
        path: 'insertar',
        component: Userinsertcomponent,
        canActivate: [rolGuard],
        data: { roles: ESCRIBIR },
      },
      {
        path: 'editar/:id',
        component: Userupdatecomponent,
        canActivate: [rolGuard],
        data: { roles: ESCRIBIR },
      },
      {
        path: 'perfil/:id',
        component: Userprofilecomponent,
      },
    ],
  },

  {
    path: 'inspecciones',
    title: 'Inspecciones · EcoPest',
    component: Inspectioncomponent,
    canActivate: [seguridadGuard],
    children: [
      {
        path: '',
        redirectTo: 'listar',
        pathMatch: 'full',
      },
      {
        path: 'listar',
        component: Inspectionlistcomponent,
      },
      {
        path: 'insertar',
        component: Inspectioninsertcomponent,
        canActivate: [rolGuard],
        data: { roles: ESCRIBIR },
      },
      {
        path: 'editar/:id',
        component: Inspectionupdatecomponent,
        canActivate: [rolGuard],
        data: { roles: ESCRIBIR },
      },
    ],
  },

  
  {
    path: 'incidentes',
    title: 'Incidentes · EcoPest',
    component: Incidentcomponent,
    canActivate: [seguridadGuard],
    children: [
      {
        path: '',
        redirectTo: 'listar',
        pathMatch: 'full',
      },
      {
        path: 'listar',
        component: Incidentlistcomponent,
      },
      {
        path: 'insertar',
        component: Incidentinsertcomponent,
        canActivate: [rolGuard],
        data: { roles: ESCRIBIR },
      },
      {
        path: 'editar/:id',
        component: Incidentupdatecomponent,
        canActivate: [rolGuard],
        data: { roles: ESCRIBIR },
      },
      {
        path: 'ver/:id',
        component: Incidentviewcomponent,
      },
    ],
  },


  {
    path: 'evidencias',
    title: 'Evidencias · EcoPest',
    component: Evidencecomponent,
    canActivate: [seguridadGuard],
    children: [
      {
        path: '',
        redirectTo: 'listar',
        pathMatch: 'full',
      },
      {
        path: 'listar',
        component: Evidencelistcomponent,
      },
      {
        path: 'insertar',
        component: Evidenceinsertcomponent,
        canActivate: [rolGuard],
        data: { roles: ESCRIBIR },
      },
      {
        path: 'editar/:id',
        component: Evidenceupdatecomponent,
        canActivate: [rolGuard],
        data: { roles: ESCRIBIR },
      },
      {
        path: 'ver/:id',
        component: Evidenceviewcomponent,
      },
    ],
  },

  {
    path: 'recomendaciones',
    title: 'Recomendaciones · EcoPest',
    component: Recommendationcomponent,
    canActivate: [seguridadGuard],
    children: [
      {
        path: '',
        redirectTo: 'listar',
        pathMatch: 'full',
      },
      {
        path: 'empresas',
        component: Recommendationbybusinesscomponent,
      },
      {
        path: 'listar',
        component: Recommendationlistcomponent,
      },
      {
        path: 'insertar',
        component: Recommendationinsertcomponent,
        canActivate: [rolGuard],
        data: { roles: ESCRIBIR },
      },
      {
        path: 'editar/:id',
        component: Recommendationupdatecomponent,
        canActivate: [rolGuard],
        data: { roles: ESCRIBIR },
      },
    ],
  },

  {
    path: 'clima',
    title: 'Clima · EcoPest',
    component: Weathercomponent,
    canActivate: [seguridadGuard],
    children: [
      {
        path: '',
        redirectTo: 'listar',
        pathMatch: 'full',
      },
      {
        path: 'listar',
        component: Weatherlistcomponent,
      },
      {
        path: 'insertar',
        component: Weatherinsertcomponent,
        canActivate: [rolGuard],
        data: { roles: ESCRIBIR },
      },
      {
        path: 'editar/:id',
        component: Weatherupdatecomponent,
        canActivate: [rolGuard],
        data: { roles: ESCRIBIR },
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
