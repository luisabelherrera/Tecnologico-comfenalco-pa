import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/registro/register.component';
import { AuthGuard } from './guards/auth.guard';
import { AcudienteListComponent } from './components/acudiente/acudiente-list/acudiente-list.component';
import { AcudienteDetailComponent } from './components/acudiente/acudiente-detail/acudiente-detail.component';
import { CalificacionListComponent } from './components/calificacion/calificacion-list/calificacion-list.component';
import { CurricularListComponent } from './components/curricular/curricular-list/curricular-list.component';
import { CursosListComponent } from './components/cursos/cursos-list/cursos-list.component';
import { DocenteNivelDetalleCursoComponent } from './components/docente-nivel-detalle-curso/docente-nivel-detalle-curso.component';
import { ListarEstudiantesComponent } from './components/estudiante/listar/listar.component';
import { GradoSeccionComponent } from './components/grado-seccion/grado-seccion.component';
import { HorarioListComponent } from './components/horario/horario-list/horario-list.component';
import { HorarioAddComponent } from './components/horario/horario-add/horario-add.component';
import { HorarioUpdateComponent } from './components/horario/horario-update/horario-update.component';
import { NivelComponent } from './components/nivel/nivel.component';
import { NivelDetalleComponent } from './components/niveldetalle/niveldetalle.component';
import { NivelDetalleCursoComponent } from './components/niveldetallecurso/niveldetallecurso.component';
import { PeriodoComponent } from './components/periodo/periodo.component';
import { DocenteComponent } from './components/docente/docente.component';
import { CalificacionDetailComponent } from './components/calificacion/calificacion-detail/calificacion-detail.component';
import { Ventana3Component } from './components/vista-estudiante/ventana3/ventana3.component';
import { MatriculaComponent } from './components/matricula/matricula.component';
import { Ventana2Component } from './components/vista-docente/ventana2/ventana2.component';
import { CurricularDocenteComponent } from './components/vista-docente/curricular/curricular.component';
import { HorarioComponent } from './components/vista-docente/horario/horario.component';
import { CurricularEstudianteComponent } from './components/vista-estudiante/curricular-estudiante/curricular-estudiante.component';
import { HorarioEstudianteComponent } from './components/vista-estudiante/horario-estudiante/horario-estudiante.component';
import { ErrorComponent } from './components/error/error.component';
import { AgregarNoticiaComponent } from './components/agregar-noticia/agregar-noticia.component';
import { RecursoComponent } from './components/recurso/recurso.component';
import { LunaComponent } from './components/vista-de-etapa/luna/luna.component';
import { VentaInformacionComponent } from './components/venta-informacion/venta-informacion.component';
import { QuizComponent } from './components/ventanas-para-invitados/eventos/eventos/eventos.component';
import { PreguntasJuegosComponent } from './components/ventanas-para-invitados/juegos/juegos/preguntas/preguntas-juegos/preguntas-juegos.component';
import { JuegosComponent } from './components/ventanas-para-invitados/juegos/juegos/juegos.component';
import { LibrosApiComponent } from './components/ventanas-para-invitados/libro/libros-api/libros-api.component';
import { FacturaComponent } from './components/matricula/dialog/incripciondetalle/factura/factura.component';
import { PerfilEstudianteComponent } from './components/vista-estudiante/mi-perfil/perfil-estudiante/perfil-estudiante.component';
import { ThemeCustomizerComponent } from './components/theme-customizer/theme-customizer.component';
import { ChatGestionComponent } from './components/gestion-chat/chat-gestion/chat-gestion.component';
import { ModificarHomeComponent } from './components/modificar-home/modificar-home.component';
import { CrearNotificacionComponent } from './components/vista-estudiante/crear-notificacion/crear-notificacion/crear-notificacion.component';
import { AsistenciaComponent } from './components/vista-docente/asistencia/asistencia/asistencia.component';
import { PrediccionComponent } from './components/prediccion/prediccion/prediccion.component';
import { WekaComponent } from './components/prediciones/weka/weka.component';
import { DocenteAnalizaComponent } from './components/vista-docente/docente-analiza/docente-analiza.component';
import { EncuestaEstudianteComponent } from './components/vista-estudiante/encuenta-estudiante/encuenta-estudiante.component';
import { ConsultarPreciosComponent } from './components/ventanas-para-invitados/consultar-precios/consultar-precios/consultar-precios.component';
import { PreciosNiveleducativoComponent } from './components/precios-niveleducativo/precios-niveleducativo.component';
import { InformacionEducativaComponent } from './components/ventanas-para-invitados/ventana-informacion-educativa/ADMIN-informacion-educativa/informacion-educativa.component';
import { VentanaInformacionPublicComponent } from './components/ventanas-para-invitados/ventanaInformacion-Public/ventana-informacion-public/ventana-informacion-public.component';
import { SedesComponent } from './components/ventanas-para-invitados/sedes/sedes/sedes.component';
import { MaterialDocenteComponent } from './components/vista-docente/docente-analiza/docente-crea-material/material-docente/material-docente.component';
import { Live2dComponent } from './components/ventanas-para-invitados/live2d/live2d.component';
import { MaterialStudioComponent } from './components/vista-estudiante/material-studio/material-studio.component';
import { DashboardAdminComponent } from './components/dashboard-admin/dashboard-admin.component';

const routes: Routes = [
  {
    path: 'ventana2',
    component: Ventana2Component,
    canActivate: [AuthGuard],
    data: { roles: ['Docente'] },
  },
  {
    path: 'docente-weka',
    component: DocenteAnalizaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Docente'] },
  },
  {
    path: 'curricularDocente',
    component: CurricularDocenteComponent,
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
    path: 'asistencia',
    component: AsistenciaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Docente'] },
  },
  {
    path: 'error',
    component: ErrorComponent,
  },
  {
    path: 'venta-informacion',
    component: VentaInformacionComponent,
  },
  {
    path: 'preguntas',
    component: PreguntasJuegosComponent,
  },
  {
    path: 'juego',
    component: JuegosComponent,
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
    path: 'EncuestaEstudiante',
    component: EncuestaEstudianteComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Estudiante'] },
  },
  {
    path: 'horarioEstudiante',
    component: HorarioEstudianteComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Estudiante'] },
  },

  {
    path: 'material-estudio',
    component:   MaterialStudioComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Estudiante'] },
  },


  { path: 'eventos', component: QuizComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'registro',
    component: RegisterComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion'] },
  },
  {
    path: 'acudientes',
    component: AcudienteListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion'] },
  },
  {
    path: 'acudientes/details/:id',
    component: AcudienteDetailComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion'] },
  },


  {
    path: 'preciosniveleducativo',
    component:   PreciosNiveleducativoComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion'] },
  },


  {
    path: 'informacion-educativa',
    component:    InformacionEducativaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion'] },
  },
  {
    path: 'curriculares',
    component: CurricularListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion'] },
  },
  {
    path: 'cursos',
    component: CursosListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion'] },
  },
  {
    path: 'listar',
    component: ListarEstudiantesComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion'] },
  },
  {
    path: 'grado-seccion',
    component: GradoSeccionComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion'] },
  },
  {
    path: 'modifica-home',
    component: ModificarHomeComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion'] },
  },
  {
    path: 'header',
    component: ThemeCustomizerComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion'] },
  },
  {
    path: 'chat-gestion',
    component: ChatGestionComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion'] },
  },
  {
    path: 'horario',
    component: HorarioListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion'] },
  },
  {
    path: 'horario/add',
    component: HorarioAddComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion'] },
  },
  {
    path: 'horario/update/:id',
    component: HorarioUpdateComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion'] },
  },
  {
    path: 'niveldetalle',
    component: NivelDetalleComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion'] },
  },
  {
    path: 'niveldetallecurso',
    component: NivelDetalleCursoComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion'] },
  },
  {
    path: 'nivel',
    component: NivelComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion'] },
  },
  { path: 'luna', component: LunaComponent },
  {
    path: 'periodo',
    component: PeriodoComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion'] },
  },
  {
    path: 'agregar-noticia',
    component: AgregarNoticiaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion'] },
  },
  {
    path: 'agregar-recurso',
    component: RecursoComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion'] },
  },
  {
    path: 'weka',
    component: WekaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion'] },
  },
  {
    path: 'docentes',
    component: DocenteComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion'] },
  },
  {
    path: 'docentes/detalle',
    component: DocenteNivelDetalleCursoComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion'] },
  },
  {
    path: 'factura',
    component: FacturaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion'] },
  },
  {
    path: 'predicciones',
    component: PrediccionComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion'] },
  },
  {
    path: 'perfil-estudiante',
    component: PerfilEstudianteComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Estudiante'] },
  },
  {
    path: 'crear-notificacion',
    component: CrearNotificacionComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Estudiante'] },
  },
  {
    path: 'calificaciones',
    component: CalificacionListComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion'] },
  },
  {
    path: 'calificaciones/detail/:id',
    component: CalificacionDetailComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion'] },
  },
 {
    path: 'dashboard-admin',
    component: DashboardAdminComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion'] },
  },
  
  {
    path: 'matricula',
    component: MatriculaComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Administracion'] },
  },

  { path: 'ventana-informacion-public', component:   VentanaInformacionPublicComponent },
  { path: 'live2', component:   Live2dComponent },


  {
    path: 'materia-docente',
    component: MaterialDocenteComponent,
    canActivate: [AuthGuard],
    data: { roles: ['Docente'] },
  },


  { path: 'sedes', component: SedesComponent },
  { path: 'consultar-precios', component: ConsultarPreciosComponent },
  { path: 'login', component: LoginComponent },
  { path: 'libros-api', component: LibrosApiComponent },
  { path: '**', redirectTo: '/venta-informacion' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
