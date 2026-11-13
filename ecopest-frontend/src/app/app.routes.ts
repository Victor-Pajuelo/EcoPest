import { Routes } from '@angular/router';
import { Homecomponent } from './components/homecomponent/homecomponent';
import { Pestcomponent } from './components/pestcomponent/pestcomponent';
import { Pestlistcomponent } from './components/pestcomponent/pestlistcomponent/pestlistcomponent';
import { Pestinsertcomponent } from './components/pestcomponent/pestinsertcomponent/pestinsertcomponent';
import { Pestupdatecomponent } from './components/pestcomponent/pestupdatecomponent/pestupdatecomponent';
import { Pestidentifycomponent } from './components/pestcomponent/pestidentifycomponent/pestidentifycomponent';
import { Pestviewcomponent } from './components/pestcomponent/pestviewcomponent/pestviewcomponent';
import { Businesscomponent } from './components/businesscomponent/businesscomponent';
import { Businesslistcomponent } from './components/businesscomponent/businesslistcomponent/businesslistcomponent';
import { Businessinsertcomponent } from './components/businesscomponent/businessinsertcomponent/businessinsertcomponent';
import { Businessupdatecomponent } from './components/businesscomponent/businessupdatecomponent/businessupdatecomponent';
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
import { Evidencecomponent } from './components/evidencecomponent/evidencecomponent';
import { Evidencelistcomponent } from './components/evidencecomponent/evidencelistcomponent/evidencelistcomponent';
import { Evidenceinsertcomponent } from './components/evidencecomponent/evidenceinsertcomponent/evidenceinsertcomponent';
import { Evidenceupdatecomponent } from './components/evidencecomponent/evidenceupdatecomponent/evidenceupdatecomponent';
import { Recommendationcomponent } from './components/recommendationcomponent/recommendationcomponent';
import { Recommendationlistcomponent } from './components/recommendationcomponent/recommendationlistcomponent/recommendationlistcomponent';
import { Recommendationinsertcomponent } from './components/recommendationcomponent/recommendationinsertcomponent/recommendationinsertcomponent';
import { Recommendationupdatecomponent } from './components/recommendationcomponent/recommendationupdatecomponent/recommendationupdatecomponent';
import { Weathercomponent } from './components/weathercomponent/weathercomponent';
import { Weatherlistcomponent } from './components/weathercomponent/weatherlistcomponent/weatherlistcomponent';
import { Weatherinsertcomponent } from './components/weathercomponent/weatherinsertcomponent/weatherinsertcomponent';
import { Weatherupdatecomponent } from './components/weathercomponent/weatherupdatecomponent/weatherupdatecomponent';

export const routes: Routes = [
  {
    path: '',
    component: Homecomponent,
  },

  {
    path: 'plagas',
    component: Pestcomponent,
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
      },
      {
        path: 'editar/:id',
        component: Pestupdatecomponent,
      },
      {
        path: 'ver/:id',
        component: Pestviewcomponent,
      },
      {
        path: 'identificar',
        component: Pestidentifycomponent,
      },
    ],
  },

  {
    path: 'empresas',
    component: Businesscomponent,
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
      },
      {
        path: 'editar/:id',
        component: Businessupdatecomponent,
      },
    ],
  },

  {
    path: 'roles',
    component: Rolecomponent,
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
      },
      {
        path: 'editar/:id',
        component: Roleupdatecomponent,
      },
    ],
  },

  {
    path: 'usuarios',
    component: Usercomponent,
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
      },
      {
        path: 'editar/:id',
        component: Userupdatecomponent,
      },
      {
        path: 'perfil/:id',
        component: Userprofilecomponent,
      },
    ],
  },

  {
    path: 'inspecciones',
    component: Inspectioncomponent,
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
      },
      {
        path: 'editar/:id',
        component: Inspectionupdatecomponent,
      },
    ],
  },

  {
    path: 'incidentes',
    component: Incidentcomponent,
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
      },
      {
        path: 'editar/:id',
        component: Incidentupdatecomponent,
      },
    ],
  },

  {
    path: 'evidencias',
    component: Evidencecomponent,
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
      },
      {
        path: 'editar/:id',
        component: Evidenceupdatecomponent,
      },
    ],
  },

  {
    path: 'recomendaciones',
    component: Recommendationcomponent,
    children: [
      {
        path: '',
        redirectTo: 'listar',
        pathMatch: 'full',
      },
      {
        path: 'listar',
        component: Recommendationlistcomponent,
      },
      {
        path: 'insertar',
        component: Recommendationinsertcomponent,
      },
      {
        path: 'editar/:id',
        component: Recommendationupdatecomponent,
      },
    ],
  },

  {
    path: 'clima',
    component: Weathercomponent,
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
      },
      {
        path: 'editar/:id',
        component: Weatherupdatecomponent,
      },
    ],
  },
  { path: '**', redirectTo: '' },
];
