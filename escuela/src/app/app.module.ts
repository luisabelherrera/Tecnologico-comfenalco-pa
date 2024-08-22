
//import 
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { AuthService } from './services/auth/auth.service';
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

//aula
import { AulaListComponent } from './components/aula/aula-list/aula-list.component';
import { AulaEditComponent } from './components/aula/aula-edit/aula-edit.component';
import { AulaDetailComponent } from './components/aula/aula-detail/aula-detail.component';
import { AulaCreateComponent } from './components/aula/aula-create/aula-create.component';


@NgModule({
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatTableModule,
    MatButtonModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    MaterialModule,
    HttpClientModule,
    MatPaginatorModule,
  ],
  declarations: [
    
    TutorEditComponent,
    TutorDetailComponent,
    TutorCreateComponent,
    TutorListComponent,
    TutorComponent,
   
    AsignacionAulaListComponent,
    AsignacionAulaCreateComponent,
    AsignacionAulaEditComponent,
    AsignacionAulaDetailComponent,

    AulaListComponent,
    AulaEditComponent,
    AulaDetailComponent,
    AulaCreateComponent,

    AppComponent,
    HomeComponent,
    LoginComponent,
    
  ],
  providers: [AuthService],
  bootstrap: [AppComponent],
})
export class AppModule {}
