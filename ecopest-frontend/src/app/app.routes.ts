import { Routes } from '@angular/router';
import { authGuard, adminGuard, writeGuard } from './guards/authguard';
import { Homecomponent } from './components/homecomponent/homecomponent';
import { Logincomponent } from './components/logincomponent/logincomponent';
import { Reportscomponent } from './components/reportscomponent/reportscomponent';
import { Termscomponent } from './components/termscomponent/termscomponent';
import { Notfoundcomponent } from './components/notfoundcomponent/notfoundcomponent';
import { Businesscomponent } from './components/businesscomponent/businesscomponent';
import { Businesslistcomponent } from './components/businesscomponent/businesslistcomponent/businesslistcomponent';
import { Businessformcomponent } from './components/businesscomponent/businessformcomponent/businessformcomponent';
import { Pestcomponent } from './components/pestcomponent/pestcomponent';
import { Pestlistcomponent } from './components/pestcomponent/pestlistcomponent/pestlistcomponent';
import { Pestformcomponent } from './components/pestcomponent/pestformcomponent/pestformcomponent';
import { Rolecomponent } from './components/rolecomponent/rolecomponent';
import { Rolelistcomponent } from './components/rolecomponent/rolelistcomponent/rolelistcomponent';
import { Roleformcomponent } from './components/rolecomponent/roleformcomponent/roleformcomponent';
import { Usercomponent } from './components/usercomponent/usercomponent';
import { Userlistcomponent } from './components/usercomponent/userlistcomponent/userlistcomponent';
import { Userformcomponent } from './components/usercomponent/userformcomponent/userformcomponent';
import { Inspectioncomponent } from './components/inspectioncomponent/inspectioncomponent';
import { Inspectionlistcomponent } from './components/inspectioncomponent/inspectionlistcomponent/inspectionlistcomponent';
import { Inspectionformcomponent } from './components/inspectioncomponent/inspectionformcomponent/inspectionformcomponent';
import { Incidentcomponent } from './components/incidentcomponent/incidentcomponent';
import { Incidentlistcomponent } from './components/incidentcomponent/incidentlistcomponent/incidentlistcomponent';
import { Incidentformcomponent } from './components/incidentcomponent/incidentformcomponent/incidentformcomponent';
import { Evidencecomponent } from './components/evidencecomponent/evidencecomponent';
import { Evidencelistcomponent } from './components/evidencecomponent/evidencelistcomponent/evidencelistcomponent';
import { Evidenceformcomponent } from './components/evidencecomponent/evidenceformcomponent/evidenceformcomponent';
import { Recommendationcomponent } from './components/recommendationcomponent/recommendationcomponent';
import { Recommendationlistcomponent } from './components/recommendationcomponent/recommendationlistcomponent/recommendationlistcomponent';
import { Recommendationformcomponent } from './components/recommendationcomponent/recommendationformcomponent/recommendationformcomponent';
import { Weathercomponent } from './components/weathercomponent/weathercomponent';
import { Weatherlistcomponent } from './components/weathercomponent/weatherlistcomponent/weatherlistcomponent';
import { Weatherformcomponent } from './components/weathercomponent/weatherformcomponent/weatherformcomponent';

export const routes: Routes = [
  { path: '', component: Homecomponent, canActivate: [authGuard] },
  { path: 'login', component: Logincomponent },
  { path: 'terminos', component: Termscomponent },
  { path: 'reportes', component: Reportscomponent, canActivate: [authGuard] },
  {
    path: 'empresas',
    component: Businesscomponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'listar', pathMatch: 'full' },
      { path: 'listar', component: Businesslistcomponent },
      { path: 'insertar', component: Businessformcomponent, canActivate: [writeGuard] },
      { path: 'editar/:id', component: Businessformcomponent, canActivate: [writeGuard] },
    ],
  },
  {
    path: 'plagas',
    component: Pestcomponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'listar', pathMatch: 'full' },
      { path: 'listar', component: Pestlistcomponent },
      { path: 'insertar', component: Pestformcomponent, canActivate: [writeGuard] },
      { path: 'editar/:id', component: Pestformcomponent, canActivate: [writeGuard] },
    ],
  },
  {
    path: 'roles',
    component: Rolecomponent,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'listar', pathMatch: 'full' },
      { path: 'listar', component: Rolelistcomponent },
      { path: 'insertar', component: Roleformcomponent, canActivate: [adminGuard] },
      { path: 'editar/:id', component: Roleformcomponent, canActivate: [adminGuard] },
    ],
  },
  {
    path: 'usuarios',
    component: Usercomponent,
    canActivate: [adminGuard],
    children: [
      { path: '', redirectTo: 'listar', pathMatch: 'full' },
      { path: 'listar', component: Userlistcomponent },
      { path: 'insertar', component: Userformcomponent, canActivate: [adminGuard] },
      { path: 'editar/:id', component: Userformcomponent, canActivate: [adminGuard] },
    ],
  },
  {
    path: 'inspecciones',
    component: Inspectioncomponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'listar', pathMatch: 'full' },
      { path: 'listar', component: Inspectionlistcomponent },
      { path: 'insertar', component: Inspectionformcomponent, canActivate: [writeGuard] },
      { path: 'editar/:id', component: Inspectionformcomponent, canActivate: [writeGuard] },
    ],
  },
  {
    path: 'incidentes',
    component: Incidentcomponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'listar', pathMatch: 'full' },
      { path: 'listar', component: Incidentlistcomponent },
      { path: 'insertar', component: Incidentformcomponent, canActivate: [writeGuard] },
      { path: 'editar/:id', component: Incidentformcomponent, canActivate: [writeGuard] },
    ],
  },
  {
    path: 'evidencias',
    component: Evidencecomponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'listar', pathMatch: 'full' },
      { path: 'listar', component: Evidencelistcomponent },
      { path: 'insertar', component: Evidenceformcomponent, canActivate: [writeGuard] },
      { path: 'editar/:id', component: Evidenceformcomponent, canActivate: [writeGuard] },
    ],
  },
  {
    path: 'recomendaciones',
    component: Recommendationcomponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'listar', pathMatch: 'full' },
      { path: 'listar', component: Recommendationlistcomponent },
      { path: 'insertar', component: Recommendationformcomponent, canActivate: [writeGuard] },
      { path: 'editar/:id', component: Recommendationformcomponent, canActivate: [writeGuard] },
    ],
  },
  {
    path: 'clima',
    component: Weathercomponent,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'listar', pathMatch: 'full' },
      { path: 'listar', component: Weatherlistcomponent },
      { path: 'insertar', component: Weatherformcomponent, canActivate: [writeGuard] },
      { path: 'editar/:id', component: Weatherformcomponent, canActivate: [writeGuard] },
    ],
  },
  { path: '**', component: Notfoundcomponent },
];
