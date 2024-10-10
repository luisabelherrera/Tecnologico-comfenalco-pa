import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


// home ventana para todos los usuario
import { HomeComponent } from './components/home/home.component';

// login inicio de seccion
import { LoginComponent } from './components/login/login.component';

// ia para todos los usuario
import { GenerateContentComponent } from './components/generate-ia/generate-ia.component';

// acudiente
import { RegisterComponent } from './components/registro/register.component';

// ventana 2 para el Docente
// El authGuard 
import { AuthGuard } from './guards/auth.guard';

// acudiente
import { AcudienteListComponent } from './components/acudiente/acudiente-list/acudiente-list.component';
import { AcudienteFormComponent } from './components/acudiente/acudiente-form/acudiente-form.component';
import { AcudienteDetailComponent } from './components/acudiente/acudiente-detail/acudiente-detail.component';

// calificacion
import { CalificacionListComponent } from './components/calificacion/calificacion-list/calificacion-list.component';
import { CalificacionCreateComponent } from './components/calificacion/calificacion-create/calificacion-create.component';
import { CalificacionEditComponent } from './components/calificacion/calificacion-edit/calificacion-edit.component';

// curricular
import { CurricularListComponent } from './components/curricular/curricular-list/curricular-list.component';
import { CurricularCreateComponent } from './components/curricular/curricular-create/curricular-create.component';
import { CurricularEditComponent } from './components/curricular/curricular-edit/curricular-edit.component';

// curso
import { CursosListComponent } from './components/cursos/cursos-list/cursos-list.component';
import { CursosCreateComponent } from './components/cursos/cursos-create/cursos-create.component';
import { CursosEditComponent } from './components/cursos/cursos-edit/cursos-edit.component';
//DOcenteNiveldetalle
import { DocenteNivelDetalleCursoComponent } from './components/docente-nivel-detalle-curso/docente-nivel-detalle-curso.component';
//Estudiante
import { ListarEstudiantesComponent } from './components/estudiante/listar/listar.component';
import { CrearEstudianteComponent } from './components/estudiante/crear/crear.component';
import { EditarEstudianteComponent } from './components/estudiante/editar/editar.component';
//GradoSeccion
import { GradoSeccionComponent } from './components/grado-seccion/grado-seccion.component';
//Horario
import { HorarioListComponent } from './components/horario/horario-list/horario-list.component';
import { HorarioAddComponent } from './components/horario/horario-add/horario-add.component';
import { HorarioUpdateComponent } from './components/horario/horario-update/horario-update.component';
//nivel 1
import { NivelComponent } from './components/nivel/nivel.component';
//nivel 2
import { NivelDetalleComponent } from './components/niveldetalle/niveldetalle.component';
//nivel 3
import { NivelDetalleCursoComponent } from './components/niveldetallecurso/niveldetallecurso.component';
//periodo
import { PeriodoComponent } from './components/periodo/periodo.component';
//Docente
import { DocenteComponent } from './components/docente/docente.component';
//calificacion
import { CalificacionDetailComponent } from './components/calificacion/calificacion-detail/calificacion-detail.component';
//ventana del estudiante
import { Ventana3Component } from './components/vista-estudiante/ventana3/ventana3.component';
//matricula
import { MatriculaComponent } from './components/matricula/matricula.component';
import { Ventana2Component } from './components/vista-docente/ventana2/ventana2.component';
import { CurricularComponent } from './components/vista-docente/curricular/curricular.component';
import { HorarioComponent } from './components/vista-docente/horario/horario.component';
import { CurricularEstudianteComponent } from './components/vista-estudiante/curricular-estudiante/curricular-estudiante.component';
import { HorarioEstudianteComponent } from './components/vista-estudiante/horario-estudiante/horario-estudiante.component';

const routes: Routes = [
  // vista docente 
  {
    path: 'ventana2',
    component: Ventana2Component,
    canActivate: [AuthGuard],
    data: { roles: ['Docente'] },
  },
  {
    path: 'curricularDocente',
    component: CurricularComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Docente'] },
  },
  {
    path: 'horarioDocente',
    component: HorarioComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Docente'] },
  },




  {
    path: 'ventana3',
    component: Ventana3Component,
    canActivate: [AuthGuard],
    data: { roles: ['Estudiante'] },
  },

  {
    path: 'curricularEstudiante',
    component: CurricularEstudianteComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Estudiante'] },
  },

  {
    path: 'horarioEstudiante',
    component: HorarioEstudianteComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Estudiante'] },
  },


  // Home route
  { path: 'home', component: HomeComponent },

  // Registrar  Usuario
  { path: 'registro', component: RegisterComponent },

  // acudiente routes
  {
    path: 'acudientes',
    component: AcudienteListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion'] },
  },
  { path: 'acudientes/create', component: AcudienteFormComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion']  },
  },
  { path: 'acudientes/edit/:id', component: AcudienteFormComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion']  },
  },
  { path: 'acudientes/details/:id', component: AcudienteDetailComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion']  },
  },

  //curriculares
  { path: 'curriculares', component: CurricularListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion']  },
  },
  { path: 'curriculares/create', component: CurricularCreateComponent ,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion']  },
  },
  { path: 'curriculares/edit/:id', component: CurricularEditComponent ,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion']  },
  },

  //curso
  { path: 'cursos', component: CursosListComponent ,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion']  },
  },
  { path: 'cursos/create', component: CursosCreateComponent ,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion']  },
  },
  { path: 'cursos/edit/:id', component: CursosEditComponent ,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion']  },
  },
  //estudiante
  { path: 'listar', component: ListarEstudiantesComponent ,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion']  },
  },
  { path: 'crear', component: CrearEstudianteComponent ,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion']  },
  },
  { path: 'editar/:id', component: EditarEstudianteComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion']  },
  },

  //estudiante
  { path: 'grado-seccion', component: GradoSeccionComponent ,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion']  },
  },

  //horario
  {
    path: 'horario',
    component: HorarioListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion'] },
  },
  { path: 'horario/add', component: HorarioAddComponent ,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion']  },
  },
  { path: 'horario/update/:id', component: HorarioUpdateComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion']  },
  },

  { path: 'niveldetalle', component: NivelDetalleComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion']  },
  },

  { path: 'niveldetallecurso', component: NivelDetalleCursoComponent ,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion']  },
  },

  { path: 'nivel', component: NivelComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion']  },
  },

  { path: 'periodo', component: PeriodoComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion']  },
  },

  //docente
  {
    path: 'docentes',
    component: DocenteComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion'] },
  },

  { path: 'docentes/detalle', component: DocenteNivelDetalleCursoComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion']  },
  },

  // calificacion
  { path: 'calificaciones', component: CalificacionListComponent ,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion']  },
  },
  { path: 'calificaciones/create', component: CalificacionCreateComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion']  },
  },
  { path: 'calificaciones/edit/:id', component: CalificacionEditComponent ,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion']  },
  },
  { path: 'calificaciones/detail/:id', component: CalificacionDetailComponent ,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion']  },
  },
  {
    path: 'matricula',
    component: MatriculaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion'] },
  },

  // AI Generation route
  { path: 'ia', component: GenerateContentComponent },

  // Login route
  { path: 'login', component: LoginComponent },

  // Wildcard route for a 404 page redirecting to login
  { path: '**', redirectTo: '/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
