import { Component, OnInit } from '@angular/core';
import { Horario } from 'src/app/models/entity/horario.model';
import { Inscripcion } from 'src/app/models/entity/Inscripcion.interface';
import { DocenteNivelDetalleCurso } from 'src/app/models/entity/docente-nivel-detalle-curso.model';
import { HorarioService } from 'src/app/services/horario/Horario.service';
import { EstudiantePerfilService } from 'src/app/services/estudiante/ventana-estudiante/estudiante-perfil.service';
import { InscripcionService } from 'src/app/services/matricula/matricula.service';
import { UserDto } from 'src/app/models/models';
import { DocenteNivelDetalleCursoService } from 'src/app/services/docente-detalle/docente-nivel-detalle-curso.service';

interface TimeSlot {
  inicio: string;
  fin: string;
}

@Component({
  selector: 'app-horario-estudiante',
  templateUrl: './horario-estudiante.component.html',
  styleUrls: ['./horario-estudiante.component.scss']
})
export class HorarioEstudianteComponent implements OnInit {
  estudiante?: UserDto;
  inscripcion?: Inscripcion;
  horarios: Horario[] = [];
  docentesNivelDetalleCurso: DocenteNivelDetalleCurso[] = [];
  schedule: { [day: string]: { [timeKey: string]: { curso: string, profesor: string, hasConflict: boolean } } } = {};
  daysOfWeek: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  timeSlots: TimeSlot[] = [];

  constructor(
    private horarioService: HorarioService,
    private estudiantePerfilService: EstudiantePerfilService,
    
    private inscripcionService: InscripcionService,
    private docenteNivelDetalleCursoService: DocenteNivelDetalleCursoService
  ) {}

  ngOnInit(): void {
    this.loadEstudianteYHorarios();
  }

  loadEstudianteYHorarios(): void {
    this.estudiantePerfilService.getPerfilEstudiante().subscribe(
      (data) => {
        this.estudiante = data;
        this.loadInscripcionYHorarios();
      },
      (error) => {
        console.error('Error al obtener el perfil del estudiante:', error);
      }
    );
  }

  loadInscripcionYHorarios(): void {
    if (!this.estudiante?.estudiante?.idEstudiante) return;

    this.inscripcionService.getAllInscripciones().subscribe(
      (inscripcionesData) => {
        this.inscripcion = inscripcionesData.find(
          (ins) => ins.estudiante.idEstudiante === this.estudiante?.estudiante?.idEstudiante && ins.activo
        );

        if (!this.inscripcion?.nivelDetalle?.idNivelDetalle) {
          console.error('No hay inscripción activa o nivel detalle asociado');
          return;
        }

        this.docenteNivelDetalleCursoService.getAll().subscribe(
          (docentesData) => {
            this.docentesNivelDetalleCurso = docentesData;
            console.log('DocentesNivelDetalleCurso cargados:', this.docentesNivelDetalleCurso);

            this.horarioService.getAllHorarios().subscribe(
              (horariosData) => {
                this.horarios = horariosData.filter(
                  (horario) => horario.nivelDetalleCurso?.nivelDetalle?.idNivelDetalle === this.inscripcion?.nivelDetalle?.idNivelDetalle
                );
                console.log('Horarios filtrados:', this.horarios);

                this.initializeSchedule();

                const horariosPorDia: { [day: string]: Horario[] } = {};
                this.horarios.forEach(horario => {
                  if (!horariosPorDia[horario.diaSemana]) horariosPorDia[horario.diaSemana] = [];
                  horariosPorDia[horario.diaSemana].push(horario);
                });

                this.horarios.forEach(horario => {
                  const startTime = horario.horaInicio.substring(0, 5);
                  const endTime = horario.horaFin.substring(0, 5);
                  const timeKey = `${startTime}-${endTime}`; // "08:00-09:00"
                  const day = horario.diaSemana;
                  const curso = horario.nivelDetalleCurso?.curso?.descripcion || 'Sin curso';
                
                  const docenteAsignado = this.docentesNivelDetalleCurso.find(
                    (dndc) => dndc.nivelDetalleCurso.idNivelDetalleCurso === horario.nivelDetalleCurso?.idNivelDetalleCurso
                  );
                  const profesor = docenteAsignado && docenteAsignado.docente
                    ? `${docenteAsignado.docente.nombres} ${docenteAsignado.docente.apellidos}`
                    : 'Sin profesor asignado';
                
                  const conflictos = this.detectConflicts(horariosPorDia[day] || [], horario);
                  const hasConflict = conflictos.length > 0;
                
                  if (!this.schedule[day]) this.schedule[day] = {};
                  this.schedule[day][timeKey] = { curso, profesor, hasConflict };
                  this.addTimeSlot(startTime, endTime);
                });

                this.timeSlots.sort((a, b) => {
                  const [hoursA, minutesA] = a.inicio.split(':').map(Number);
                  const [hoursB, minutesB] = b.inicio.split(':').map(Number);
                  return hoursA * 60 + minutesA - (hoursB * 60 + minutesB);
                });
              },
              (error) => {
                console.error('Error al obtener horarios:', error);
              }
            );
          },
          (error) => {
            console.error('Error al obtener docentesNivelDetalleCurso:', error);
          }
        );
      },
      (error) => {
        console.error('Error al obtener inscripciones:', error);
      }
    );
  }

  initializeSchedule(): void {
    this.schedule = {};
    this.daysOfWeek.forEach(day => {
      this.schedule[day] = {};
    });
    this.timeSlots = [];
  }

  addTimeSlot(inicio: string, fin: string): void {
    const timeSlot = { inicio, fin };
    if (!this.timeSlots.some(ts => ts.inicio === inicio && ts.fin === fin)) {
      this.timeSlots.push(timeSlot);
    }
  }

  detectConflicts(horarios: Horario[], currentHorario: Horario): Horario[] {
    return horarios.filter(h => {
      if (h.idHorario === currentHorario.idHorario) return false;
      const start1 = this.parseTime(currentHorario.horaInicio);
      const end1 = this.parseTime(currentHorario.horaFin);
      const start2 = this.parseTime(h.horaInicio);
      const end2 = this.parseTime(h.horaFin);
      return this.doTimesOverlap(start1, end1, start2, end2);
    });
  }

  parseTime(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  doTimesOverlap(start1: number, end1: number, start2: number, end2: number): boolean {
    return start1 < end2 && start2 < end1;
  }
}