//import
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';

import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

//login
import { LoginComponent } from './components/login/login.component';
//home
import { HomeComponent } from './components/home/home.component';

import { MatDialogModule } from '@angular/material/dialog';

import { MatSelectModule } from '@angular/material/select';

import {MatMenuModule} from '@angular/material/menu';
import { AuthService } from './services/auth/AuthService.service';
import { GenerateContentComponent } from './components/generate-ia/generate-ia.component';
import { RegisterComponent } from './components/registro/register.component';
import { Ventana2Component } from './components/ventana2/ventana2.component';


//acudiente
import { AcudienteDetailComponent } from './components/acudiente/acudiente-detail/acudiente-detail.component';
import { AcudienteFormComponent } from './components/acudiente/acudiente-form/acudiente-form.component';
import { AcudienteListComponent } from './components/acudiente/acudiente-list/acudiente-list.component';


//calificacion
import { CalificacionListComponent } from './components/calificacion/calificacion-list/calificacion-list.component';
import { CalificacionCreateComponent } from './components/calificacion/calificacion-create/calificacion-create.component';
import { CalificacionEditComponent } from './components/calificacion/calificacion-edit/calificacion-edit.component';


import { CurricularListComponent } from './components/curricular/curricular-list/curricular-list.component';
import { CurricularCreateComponent } from './components/curricular/curricular-create/curricular-create.component';
import { CurricularEditComponent } from './components/curricular/curricular-edit/curricular-edit.component';


import { CursosListComponent } from './components/cursos/cursos-list/cursos-list.component';
import { CursosCreateComponent } from './components/cursos/cursos-create/cursos-create.component';
import { CursosEditComponent } from './components/cursos/cursos-edit/cursos-edit.component';

import { MatDatepickerModule } from '@angular/material/datepicker'; // Import MatDatepickerModule
import { MatNativeDateModule } from '@angular/material/core'; // Import MatNativeDateModule
import { DocenteNivelDetalleCursoComponent } from './components/docente-nivel-detalle-curso/docente-nivel-detalle-curso.component';
import { ListarEstudiantesComponent } from './components/estudiante/listar/listar.component';
import { CrearEstudianteComponent } from './components/estudiante/crear/crear.component';
import { EditarEstudianteComponent } from './components/estudiante/editar/editar.component';
import { GradoSeccionComponent } from './components/grado-seccion/grado-seccion.component';
import { HorarioListComponent } from './components/horario/horario-list/horario-list.component';
import { HorarioAddComponent } from './components/horario/horario-add/horario-add.component';
import { HorarioUpdateComponent } from './components/horario/horario-update/horario-update.component';
import { MatriculaComponent } from './components/matricula/matricula.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner'; 
import { NivelComponent } from './components/nivel/nivel.component';
import { NivelDetalleComponent } from './components/niveldetalle/niveldetalle.component';
import { NivelDetalleCursoComponent } from './components/niveldetallecurso/niveldetallecurso.component';
import { PeriodoComponent } from './components/periodo/periodo.component';
import { DocenteComponent } from './components/docente/docente.component';
import { CalificacionDetailComponent } from './components/calificacion/calificacion-detail/calificacion-detail.component';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    HttpClientModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDatepickerModule, // Add this line
    MatNativeDateModule,

    MatProgressSpinnerModule,


    
    MatCheckboxModule,
 
  ],
  declarations: [


    Ventana2Component,

     //cursi
    CursosListComponent ,
    CursosCreateComponent ,
    CursosEditComponent ,

    //tutor
    AcudienteDetailComponent,
    AcudienteFormComponent,
    AcudienteListComponent,

    //calificacion
    CalificacionListComponent,
    CalificacionCreateComponent,
    CalificacionEditComponent,
    CalificacionDetailComponent,

    CurricularListComponent,
    CurricularCreateComponent,
    CurricularEditComponent,

    DocenteComponent,

    ListarEstudiantesComponent,
    CrearEstudianteComponent,
    EditarEstudianteComponent,


    HorarioListComponent,
    HorarioAddComponent,
    HorarioUpdateComponent,


    MatriculaComponent,

    GradoSeccionComponent,

    DocenteNivelDetalleCursoComponent,

 
    PeriodoComponent,


    NivelDetalleCursoComponent,
NivelComponent,
NivelDetalleComponent,

     //registro
     RegisterComponent,

    GenerateContentComponent,

   
    //componentes para el inicio
    AppComponent,
    HomeComponent,
    LoginComponent,
  ],
providers: [AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
