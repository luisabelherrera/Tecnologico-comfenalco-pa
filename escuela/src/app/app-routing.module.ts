import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';


import { TutorEditComponent } from './components/Tutor/tutor-edit/tutor-edit.component';
import { TutorDetailComponent } from './components/Tutor/tutor-detail/tutor-detail.component';
import { TutorCreateComponent } from './components/Tutor/tutor-create/tutor-create.component';
import { TutorComponent } from './components/Tutor/tutor.component';
import { AsignacionAulaListComponent } from './components/asignacion-aula/asignacion-aula-list/asignacion-aula-list.component';
import { AsignacionAulaCreateComponent } from './components/asignacion-aula/asignacion-aula-create/asignacion-aula-create.component';
import { AsignacionAulaEditComponent } from './components/asignacion-aula/asignacion-aula-edit/asignacion-aula-edit.component';
import { AsignacionAulaDetailComponent } from './components/asignacion-aula/asignacion-aula-detail/asignacion-aula-detail.component';
import { AulaListComponent } from './components/aula/aula-list/aula-list.component';
import { AulaCreateComponent } from './components/aula/aula-create/aula-create.component';
import { AulaDetailComponent } from './components/aula/aula-detail/aula-detail.component';
import { AulaEditComponent } from './components/aula/aula-edit/aula-edit.component';

const routes: Routes = [

  //inicio
  { path: 'home', component: HomeComponent },

  // tutor
  { path: 'edit/:id', component: TutorEditComponent },
  { path: 'detail/:id', component: TutorDetailComponent },
  { path: 'create', component: TutorCreateComponent },
  { path: 'tutor', component: TutorComponent },

  // asignacion de aula
  { path: 'asignaciones-aulas', component: AsignacionAulaListComponent },
  {path: 'asignaciones-aulas/create', component: AsignacionAulaCreateComponent,},
  {path: 'asignaciones-aulas/edit/:id',component: AsignacionAulaEditComponent,},
  {path: 'asignaciones-aulas/detail/:id',component: AsignacionAulaDetailComponent,},

  //aula 
  { path: 'aulas', component: AulaListComponent },
  { path: 'aulas/create', component: AulaCreateComponent },
  { path: 'aulas/edit/:id', component: AulaEditComponent },
  { path: 'aulas/detail/:id', component: AulaDetailComponent },

  
  //login
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '/login' },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
