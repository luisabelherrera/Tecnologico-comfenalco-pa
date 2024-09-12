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

//asignacionaula
import { AsignacionAulaListComponent } from './components/asignacion-aula/asignacion-aula-list/asignacion-aula-list.component';
import { AsignacionAulaCreateComponent } from './components/asignacion-aula/asignacion-aula-create/asignacion-aula-create.component';
import { AsignacionAulaEditComponent } from './components/asignacion-aula/asignacion-aula-edit/asignacion-aula-edit.component';
import { AsignacionAulaDetailComponent } from './components/asignacion-aula/asignacion-aula-detail/asignacion-aula-detail.component';

//tutor
import { TutorEditComponent } from './components/Tutor/tutor-edit/tutor-edit.component';
import { TutorDetailComponent } from './components/Tutor/tutor-detail/tutor-detail.component';
import { TutorCreateComponent } from './components/Tutor/tutor-create/tutor-create.component';
import { TutorComponent } from './components/Tutor/tutor.component';
import { TutorListComponent } from './components/Tutor/tutor-list/tutor-list.component';


// Aula 
import { AulaListComponent } from './components/aula/aula-list/aula-list.component';
import { AulaEditComponent } from './components/aula/aula-edit/aula-edit.component';
import { AulaDetailComponent } from './components/aula/aula-detail/aula-detail.component';
import { AulaCreateComponent } from './components/aula/aula-create/aula-create.component';



import { ProfesorListComponent } from './components/profesor/profesor-list/profesor-list.component';

//curso
import { CursoListComponent } from './components/curso/curso-list/curso-list.component';
import { CursoCreateComponent } from './components/curso/curso-create/curso-create.component';
import { CursoDetailComponent } from './components/curso/curso-detail/curso-detail.component';
import { CursoEditComponent } from './components/curso/curso-edit/curso-edit.component';

//profesor
import { ProfesorCreateComponent } from './components/profesor/profesor-create/profesor-create.component';
import { ProfesorDetailComponent } from './components/profesor/profesor-detail/profesor-detail.component';
import { ProfesorEditComponent } from './components/profesor/profesor-edit/profesor-edit.component';


//departameto
import { DepartamentoListComponent } from './components/departamento/departamento-list/departamento-list.component';
import { DepartamentoCreateComponent } from './components/departamento/departamento-create/departamento-create.component';
import { DepartamentoEditComponent } from './components/departamento/departamento-edit/departamento-edit.component';
import { DepartamentoDetailComponent } from './components/departamento/departamento-detail/departamento-detail.component';

//Estudiante 
import { EstudianteListComponent } from './components/estudiante/estudiante-list/estudiante-list.component';
import { EstudianteCreateComponent } from './components/estudiante/estudiante-create/estudiante-create.component';
import { EstudianteEditComponent } from './components/estudiante/estudiante-edit/estudiante-edit.component';
import { EstudianteDetailComponent } from './components/estudiante/estudiante-detail/estudiante-detail.component';

//Inscripcion
import { InscripcionCreateComponent } from './components/inscripcion/inscripcion-create/inscripcion-create.component';
import { InscripcionListComponent } from './components/inscripcion/inscripcion-list/inscripcion-list.component';
import { InscripcionEditComponent } from './components/inscripcion/inscripcion-edit/inscripcion-edit.component';
import { InscripcionDetailComponent } from './components/inscripcion/inscripcion-detail/inscripcion-detail.component';
import { MatDialogModule } from '@angular/material/dialog';
import { ChatComponent } from './components/chat/chat.component';
import { MatSelectModule } from '@angular/material/select';

import {MatMenuModule} from '@angular/material/menu';
import { AuthService } from './services/auth/AuthService.service';


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
   

  ],
  declarations: [
    //tutor
    TutorEditComponent,
    TutorDetailComponent,
    TutorCreateComponent,
    TutorListComponent,
    TutorComponent,

    //asignaraula
    AsignacionAulaListComponent,
    AsignacionAulaCreateComponent,
    AsignacionAulaEditComponent,
    AsignacionAulaDetailComponent,

    //aula
    AulaListComponent,
    AulaEditComponent,
    AulaDetailComponent,
    AulaCreateComponent,

    //profesor
    ProfesorListComponent,
    ProfesorCreateComponent,
    ProfesorDetailComponent,
    ProfesorEditComponent,

    // curso
    CursoListComponent,
    CursoCreateComponent,
    CursoDetailComponent,
    CursoEditComponent,

    //departamento
    DepartamentoListComponent,
    DepartamentoCreateComponent,
    DepartamentoEditComponent,
    DepartamentoDetailComponent,


    //estudiantes
    EstudianteListComponent,
    EstudianteCreateComponent,
    EstudianteEditComponent,
    EstudianteDetailComponent,

    //inscripcion
    InscripcionCreateComponent,
    InscripcionListComponent,
    InscripcionEditComponent,
    InscripcionDetailComponent,



    //chat
    ChatComponent,

    //componentes para el inicio
    AppComponent,
    HomeComponent,
    LoginComponent,
  ],
providers: [AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
