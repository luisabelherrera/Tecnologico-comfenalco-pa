import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';


import { GenerateContentComponent } from './components/generate-ia/generate-ia.component';
import { RegisterComponent } from './components/registro/register.component';
import { Ventana2Component } from './components/ventana2/ventana2.component';
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

import { NivelComponent } from './components/nivel/nivel.component';
import { NivelDetalleComponent } from './components/niveldetalle/niveldetalle.component';
import { NivelDetalleCursoComponent } from './components/niveldetallecurso/niveldetallecurso.component';
import { PeriodoComponent } from './components/periodo/periodo.component';

import { DocenteComponent } from './components/docente/docente.component';
import { CalificacionDetailComponent } from './components/calificacion/calificacion-detail/calificacion-detail.component';
import { Ventana3Component } from './components/ventana3/ventana3.component';
import { MatriculaComponent } from './components/matricula/matricula.component';

const routes: Routes = [
  // User routes
  { path: 'ventana2', component: Ventana2Component ,   canActivate: [AuthGuard], 
    data: { roles: ['Docente'] }  },


    { path: 'ventana3', component: Ventana3Component ,   canActivate: [AuthGuard], 
      data: { roles: ['Estudiante'] }  },
   
  // Home route
  { path: 'home', component: HomeComponent },

  // Registration route
  { path: 'registro', component: RegisterComponent },

  // acudiente routes
  { path: 'acudientes', component: AcudienteListComponent,   canActivate: [AuthGuard], 
    data: { roles: ['Administracion'] }  },
  { path: 'acudientes/create', component: AcudienteFormComponent },
  { path: 'acudientes/edit/:id', component: AcudienteFormComponent },
  { path: 'acudientes/details/:id', component: AcudienteDetailComponent },
 
   //curriculares
  { path: 'curriculares', component: CurricularListComponent },
  { path: 'curriculares/create', component: CurricularCreateComponent },
  { path: 'curriculares/edit/:id', component: CurricularEditComponent },

 //curso
  { path: 'cursos', component: CursosListComponent },
  { path: 'cursos/create', component: CursosCreateComponent },
  { path: 'cursos/edit/:id', component: CursosEditComponent },
   //estudiante
  { path: 'listar', component: ListarEstudiantesComponent },
  { path: 'crear', component: CrearEstudianteComponent },
  { path: 'editar/:id', component: EditarEstudianteComponent },
 
   //estudiante
  { path: 'grado-seccion', component: GradoSeccionComponent },
 
   //horario
  { path: 'horario', component: HorarioListComponent ,  canActivate: [AuthGuard], 
    data: { roles: ['Administracion'] }  },
  { path: 'horario/add', component: HorarioAddComponent },
  { path: 'horario/update/:id', component: HorarioUpdateComponent },




  { path: 'niveldetalle', component: NivelDetalleComponent },

  { path: 'niveldetallecurso', component: NivelDetalleCursoComponent },

  { path: 'nivel', component: NivelComponent },


  { path: 'periodo', component: PeriodoComponent },


  //docente
  { path: 'docentes', component: DocenteComponent ,  canActivate: [AuthGuard], 
    data: { roles: ['Administracion'] }},

  { path: 'docentes/detalle', component: DocenteNivelDetalleCursoComponent },

   // calificacion
  { path: 'calificaciones', component: CalificacionListComponent },
  { path: 'calificaciones/create', component: CalificacionCreateComponent },
  { path: 'calificaciones/edit/:id', component: CalificacionEditComponent },
  { path: 'calificaciones/detail/:id', component: CalificacionDetailComponent }, // New route

 {path: "matricula" , component:  MatriculaComponent  ,  canActivate: [AuthGuard], 
  data: { roles: ['Administracion'] }},

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
