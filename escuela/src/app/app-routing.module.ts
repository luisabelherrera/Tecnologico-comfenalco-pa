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
import { ProfesorListComponent } from './components/profesor/profesor-list/profesor-list.component';
import { CursoListComponent } from './components/curso/curso-list/curso-list.component';
import { CursoCreateComponent } from './components/curso/curso-create/curso-create.component';
import { CursoEditComponent } from './components/curso/curso-edit/curso-edit.component';
import { CursoDetailComponent } from './components/curso/curso-detail/curso-detail.component';
import { ProfesorCreateComponent } from './components/profesor/profesor-create/profesor-create.component';
import { ProfesorEditComponent } from './components/profesor/profesor-edit/profesor-edit.component';
import { ProfesorDetailComponent } from './components/profesor/profesor-detail/profesor-detail.component';
import { DepartamentoCreateComponent } from './components/departamento/departamento-create/departamento-create.component';
import { DepartamentoEditComponent } from './components/departamento/departamento-edit/departamento-edit.component';
import { DepartamentoDetailComponent } from './components/departamento/departamento-detail/departamento-detail.component';
import { DepartamentoListComponent } from './components/departamento/departamento-list/departamento-list.component';
import { EstudianteListComponent } from './components/estudiante/estudiante-list/estudiante-list.component';
import { EstudianteCreateComponent } from './components/estudiante/estudiante-create/estudiante-create.component';
import { EstudianteEditComponent } from './components/estudiante/estudiante-edit/estudiante-edit.component';
import { EstudianteDetailComponent } from './components/estudiante/estudiante-detail/estudiante-detail.component';
import { InscripcionListComponent } from './components/inscripcion/inscripcion-list/inscripcion-list.component';
import { InscripcionCreateComponent } from './components/inscripcion/inscripcion-create/inscripcion-create.component';
import { InscripcionDetailComponent } from './components/inscripcion/inscripcion-detail/inscripcion-detail.component';
import { InscripcionEditComponent } from './components/inscripcion/inscripcion-edit/inscripcion-edit.component';
import { ChatComponent } from './components/chat/chat.component';
import { GenerateContentComponent } from './components/generate-ia/generate-ia.component';

const routes: Routes = [
  //inicio
  { path: 'home', component: HomeComponent },

  // tutor
  { path: 'edit/:id', component: TutorEditComponent },
  { path: 'tutores/detail/:id', component: TutorDetailComponent },
  { path: 'create', component: TutorCreateComponent },
  { path: 'tutor', component: TutorComponent },

  // asignacion de aula
  { path: 'asignaciones-aulas', component: AsignacionAulaListComponent },
  {
    path: 'asignaciones-aulas/create',
    component: AsignacionAulaCreateComponent,
  },
  {
    path: 'asignaciones-aulas/edit/:id',
    component: AsignacionAulaEditComponent,
  },
  {
    path: 'asignaciones-aulas/detail/:id',
    component: AsignacionAulaDetailComponent,
  },

  //aula
  { path: 'aulas', component: AulaListComponent },
  { path: 'aulas/create', component: AulaCreateComponent },
  { path: 'aulas/edit/:id', component: AulaEditComponent },
  { path: 'aulas/detail/:id', component: AulaDetailComponent },

  //Profesor
  { path: 'profesores', component: ProfesorListComponent },
  { path: 'profesores/create', component: ProfesorCreateComponent },
  { path: 'profesores/edit/:id', component: ProfesorEditComponent },
  { path: 'profesores/detail/:id', component: ProfesorDetailComponent },

  //departamento
  { path: 'departamentos', component: DepartamentoListComponent },
  { path: 'departamentos/create', component: DepartamentoCreateComponent },
  { path: 'departamentos/edit/:id', component: DepartamentoEditComponent },
  { path: 'departamentos/detail/:id', component: DepartamentoDetailComponent },

  //curso
  { path: 'cursos', component: CursoListComponent },
  { path: 'cursos/create', component: CursoCreateComponent },
  { path: 'cursos/edit/:id', component: CursoEditComponent },
  { path: 'cursos/detail/:id', component: CursoDetailComponent },

  //estudiante
  { path: 'estudiantes', component: EstudianteListComponent },
  { path: 'estudiantes/create', component: EstudianteCreateComponent },
  { path: 'estudiantes/detail/:id', component: EstudianteDetailComponent },
  { path: 'estudiantes/edit/:id', component: EstudianteEditComponent },

  //inscripciones
  { path: 'inscripciones', component: InscripcionListComponent },
  { path: 'inscripciones/create', component: InscripcionCreateComponent },
  { path: 'inscripciones/detail/:id', component: InscripcionDetailComponent },
  { path: 'inscripciones/edit/:id', component: InscripcionEditComponent },

//ia
  { path: 'ia', component:  GenerateContentComponent},

  //chat
  { path: 'chat', component: ChatComponent },

  //login
  { path: 'login', component: LoginComponent },
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
