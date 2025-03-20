import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthService } from './services/auth/AuthService.service';
import { RegisterComponent } from './components/registro/register.component';
import { AcudienteDetailComponent } from './components/acudiente/acudiente-detail/acudiente-detail.component';
import { AcudienteListComponent } from './components/acudiente/acudiente-list/acudiente-list.component';
import { CalificacionListComponent } from './components/calificacion/calificacion-list/calificacion-list.component';
import { CurricularListComponent } from './components/curricular/curricular-list/curricular-list.component';
import { CursosListComponent } from './components/cursos/cursos-list/cursos-list.component';
import { DocenteNivelDetalleCursoComponent } from './components/docente-nivel-detalle-curso/docente-nivel-detalle-curso.component';
import { ListarEstudiantesComponent } from './components/estudiante/listar/listar.component';
import { GradoSeccionComponent } from './components/grado-seccion/grado-seccion.component';
import { HorarioListComponent } from './components/horario/horario-list/horario-list.component';
import { HorarioAddComponent } from './components/horario/horario-add/horario-add.component';
import { HorarioUpdateComponent } from './components/horario/horario-update/horario-update.component';
import { MatriculaComponent } from './components/matricula/matricula.component';
import { NivelComponent } from './components/nivel/nivel.component';
import { NivelDetalleComponent } from './components/niveldetalle/niveldetalle.component';
import { NivelDetalleCursoComponent } from './components/niveldetallecurso/niveldetallecurso.component';
import { PeriodoComponent } from './components/periodo/periodo.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { DocenteComponent } from './components/docente/docente.component';
import { CalificacionDetailComponent } from './components/calificacion/calificacion-detail/calificacion-detail.component';
import { Ventana2Component } from './components/vista-docente/ventana2/ventana2.component';
import { HorarioComponent } from './components/vista-docente/horario/horario.component';
import { Ventana3Component } from './components/vista-estudiante/ventana3/ventana3.component';
import { CurricularEstudianteComponent } from './components/vista-estudiante/curricular-estudiante/curricular-estudiante.component';
import { HorarioEstudianteComponent } from './components/vista-estudiante/horario-estudiante/horario-estudiante.component';
import { ErrorComponent } from './components/error/error.component';
import { SuggestionsDialogComponent } from './components/generate-ia/suggestions-dialog/suggestions-dialog.component';
import { ExportDialogComponent } from './components/matricula/dialog/export-dialog/export-dialog.component';
import { NivelDetalleDialogoGraficoComponent } from './components/niveldetalle/nivel-detalle-dialogo-grafico/nivel-detalle-dialogo-grafico.component';
import { AgregarEstudianteDialogComponent } from './components/matricula/dialog/agregar-estudiante-dialog/agregar-estudiante-dialog.component';
import { MatricularAcudienteDialogComponent } from './components/matricula/dialog/matricular-acudiente-dialog/matricular-acudiente-dialog.component';
import { AgregarNoticiaComponent } from './components/agregar-noticia/agregar-noticia.component';
import { ImagenDialogComponent } from './components/home/dialogo/ImagenDialog.component';
import { RecursoComponent } from './components/recurso/recurso.component';
import { MatCarouselModule } from '@ngbmodule/material-carousel';
import { NotificacionesDialogComponent } from './components/notificaciones-dialog/notificaciones-dialog.component';
import { FullMessageDialogComponent } from './components/notificaciones-dialog/ventanadenotificaciones/full-message-dialog.component';
import { IconoIaComponent } from './components/icono-ia/icono-ia.component';
import { VentaInformacionComponent } from './components/venta-informacion/venta-informacion.component';
import { QuizComponent } from './components/ventanas-para-invitados/eventos/eventos/eventos.component';
import { LibrosApiComponent } from './components/ventanas-para-invitados/libro/libros-api/libros-api.component';
import { PerfilEstudianteComponent } from './components/vista-estudiante/mi-perfil/perfil-estudiante/perfil-estudiante.component';
import { CommonModule } from '@angular/common';
import { DialogoComponent } from './components/docente/dialogo/dialogo/dialogo.component';
import { ThemeCustomizerComponent } from './components/theme-customizer/theme-customizer.component';
import { ChatGestionComponent } from './components/gestion-chat/chat-gestion/chat-gestion.component';
import { ModificarHomeComponent } from './components/modificar-home/modificar-home.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { CurricularDocenteComponent } from './components/vista-docente/curricular/curricular.component';
import { FindCalificacionPipe } from './services/calificacion/find-calificacion.pipe';
import { CrearNotificacionComponent } from './components/vista-estudiante/crear-notificacion/crear-notificacion/crear-notificacion.component';
import { NoticiaService } from './services/Menu/Menu.service';
import { AsistenciaComponent } from './components/vista-docente/asistencia/asistencia/asistencia.component';
import { HistorialAsistenciaComponent } from './components/vista-docente/asistencia/historial-asistencia/historial-asistencia/historial-asistencia.component';
import { PreguntasJuegosComponent } from './components/ventanas-para-invitados/juegos/juegos/preguntas/preguntas-juegos/preguntas-juegos.component';
import { DashboardComponent } from './components/dashboard/dashboard/dashboard.component';
import { InscripciondetalleComponent } from './components/matricula/dialog/incripciondetalle/incripciondetalle.component';
import { FacturaComponent } from './components/matricula/dialog/incripciondetalle/factura/factura.component';
import { PrediccionComponent } from './components/prediccion/prediccion/prediccion.component';
import { StudentSearchDialog } from './components/prediccion/dialogo/dialogo-prediccion/dialogo-prediccion.component';

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    MatFormFieldModule,
    MatInputModule,
    MatSortModule,
    MatDialogModule,
    MatTableModule,
    MatButtonModule,
    MatPaginatorModule,
    MatMenuModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCheckboxModule,
    MatIconModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatListModule,
    NgxPaginationModule,
    MatCarouselModule,
    CommonModule,
    DragDropModule,
    NoopAnimationsModule
  ],
  declarations: [
    PrediccionComponent,
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    AcudienteDetailComponent,
    AcudienteListComponent,
    CalificacionListComponent,
    CalificacionDetailComponent,
    CurricularListComponent,
    CursosListComponent,
    DocenteComponent,
    ListarEstudiantesComponent,
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
    NivelDetalleDialogoGraficoComponent,
    ExportDialogComponent,
    InscripciondetalleComponent, // Corregido el typo
    SuggestionsDialogComponent,
    ErrorComponent,
    Ventana2Component,
    CurricularDocenteComponent,
    HorarioComponent,
    AgregarEstudianteDialogComponent,
    MatricularAcudienteDialogComponent,
    Ventana3Component,
    CurricularEstudianteComponent,
    HorarioEstudianteComponent,
    FacturaComponent, // Ruta corregida
    PerfilEstudianteComponent,
    DialogoComponent,
    ThemeCustomizerComponent,
    ChatGestionComponent,
    ModificarHomeComponent,
    FindCalificacionPipe,
    CrearNotificacionComponent,
    AsistenciaComponent,
    HistorialAsistenciaComponent,
    PreguntasJuegosComponent,
    DashboardComponent,
    AgregarNoticiaComponent,
    ImagenDialogComponent,
    RecursoComponent,
    NotificacionesDialogComponent,
    FullMessageDialogComponent,
    IconoIaComponent,
    VentaInformacionComponent,
    QuizComponent,
    LibrosApiComponent,
    StudentSearchDialog
  ],
  providers: [AuthService, NoticiaService],
  bootstrap: [AppComponent]
})
export class AppModule {}