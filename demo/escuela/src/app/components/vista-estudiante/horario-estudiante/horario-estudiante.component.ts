import { Component, OnInit } from '@angular/core';
import { Horario } from 'src/app/models/entity/horario.model';
import { Calificacion } from 'src/app/models/entity/Calificacion.interface';
import { HorarioService } from 'src/app/services/horario/Horario.service';
import { EstudiantePerfilService } from 'src/app/services/estudiante/ventana-estudiante/estudiante-perfil.service';
import { CalificacionService } from 'src/app/services/calificacion/calificacion.service';
import { UserDto } from 'src/app/models/models';

@Component({
  selector: 'app-horario-estudiante',
  templateUrl: './horario-estudiante.component.html',
  styleUrls: ['./horario-estudiante.component.scss']
})
export class HorarioEstudianteComponent implements OnInit {
  estudiante?: UserDto;
  calificaciones: Calificacion[] = [];
  horarios: Horario[] = [];
  schedule: { [day: string]: { [time: string]: { curso: string, profesor: string, hasConflict: boolean } } } = {};

  daysOfWeek: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  timeSlots: string[] = []; // Rangos de tiempo (por ejemplo, "08:00", "09:00", etc.)

  constructor(
    private horarioService: HorarioService,
    private estudiantePerfilService: EstudiantePerfilService,
    private calificacionService: CalificacionService
  ) {}

  ngOnInit(): void {
    this.loadEstudianteYHorarios();
  }

  loadEstudianteYHorarios(): void {
    this.estudiantePerfilService.getPerfilEstudiante().subscribe(
      (data) => {
        this.estudiante = data;
        this.loadCalificacionesYHorarios();
      },
      (error) => {
        console.error('Error al obtener el perfil del estudiante:', error);
      }
    );
  }

  loadCalificacionesYHorarios(): void {
    if (!this.estudiante?.estudiante?.idEstudiante) return;

    // Obtener calificaciones del estudiante
    this.calificacionService.getCalificaciones().subscribe(
      (calificacionesData) => {
        this.calificaciones = calificacionesData.filter(
          (calificacion) => calificacion.estudiante.idEstudiante === this.estudiante?.estudiante?.idEstudiante
        );

        // Obtener todos los horarios
        this.horarioService.getAllHorarios().subscribe(
          (horariosData) => {
            this.horarios = horariosData;

            // Inicializar el horario
            this.initializeSchedule();

            // Agrupar horarios por día para detectar conflictos
            const horariosPorDia: { [day: string]: Horario[] } = {};
            this.horarios.forEach(horario => {
              if (!horariosPorDia[horario.diaSemana]) horariosPorDia[horario.diaSemana] = [];
              horariosPorDia[horario.diaSemana].push(horario);
            });

            // Llenar el horario con los datos del estudiante y detectar conflictos
            this.horarios.forEach(horario => {
              const calificacion = this.calificaciones.find(c =>
                c.curricular.docenteNivelDetalleCurso.nivelDetalleCurso.idNivelDetalleCurso === horario.nivelDetalleCurso?.idNivelDetalleCurso
              );
              if (calificacion) {
                const startTime = horario.horaInicio.substring(0, 5); // "HH:mm"
                const endTime = horario.horaFin.substring(0, 5); // "HH:mm"
                const day = horario.diaSemana;
                const curso = calificacion.curricular.docenteNivelDetalleCurso.nivelDetalleCurso.curso.descripcion;
                const profesor = `${calificacion.curricular.docenteNivelDetalleCurso.docente.nombres} ${calificacion.curricular.docenteNivelDetalleCurso.docente.apellidos}`;

                // Detectar conflictos en el mismo día, solo si son del mismo curso (mismo nivelDetalleCurso)
                const conflictos = this.detectConflicts(horariosPorDia[day] || [], horario, calificacion);
                const hasConflict = conflictos.length > 0;

                // Usar el inicio como clave principal para el tiempo
                if (!this.schedule[day]) this.schedule[day] = {};
                this.schedule[day][startTime] = { curso, profesor, hasConflict };
                this.addTimeSlot(startTime); // Añadir al conjunto de timeSlots si no existe
              }
            });

            // Ordenar timeSlots para que aparezcan en orden ascendente
            this.timeSlots.sort((a, b) => {
              const [hoursA, minutesA] = a.split(':').map(Number);
              const [hoursB, minutesB] = b.split(':').map(Number);
              return hoursA * 60 + minutesA - (hoursB * 60 + minutesB);
            });
          },
          (error) => {
            console.error('Error al obtener horarios:', error);
          }
        );
      },
      (error) => {
        console.error('Error al obtener calificaciones:', error);
      }
    );
  }

  initializeSchedule(): void {
    this.schedule = {};
    this.daysOfWeek.forEach(day => {
      this.schedule[day] = {};
    });
    this.timeSlots = []; // Reiniciar timeSlots
  }

  addTimeSlot(time: string): void {
    if (!this.timeSlots.includes(time)) {
      this.timeSlots.push(time);
    }
  }

  // Función para detectar conflictos de horarios en el mismo día, solo si son del mismo curso
  detectConflicts(horarios: Horario[], currentHorario: Horario, currentCalificacion: Calificacion): Horario[] {
    return horarios.filter(h => {
      if (h.idHorario === currentHorario.idHorario) return false; // Excluir el horario actual

      // Encontrar la calificación asociada al otro horario (si existe)
      const otherCalificacion = this.calificaciones.find(c =>
        c.curricular.docenteNivelDetalleCurso.nivelDetalleCurso.idNivelDetalleCurso === h.nivelDetalleCurso?.idNivelDetalleCurso
      );

      // Solo consideramos conflicto si ambos horarios pertenecen al mismo curso (mismo nivelDetalleCurso)
      if (!otherCalificacion || otherCalificacion.curricular.docenteNivelDetalleCurso.nivelDetalleCurso.idNivelDetalleCurso !== currentCalificacion.curricular.docenteNivelDetalleCurso.nivelDetalleCurso.idNivelDetalleCurso) {
        return false; // No hay conflicto si son cursos diferentes
      }

      const start1 = this.parseTime(currentHorario.horaInicio);
      const end1 = this.parseTime(currentHorario.horaFin);
      const start2 = this.parseTime(h.horaInicio);
      const end2 = this.parseTime(h.horaFin);
      return this.doTimesOverlap(start1, end1, start2, end2);
    });
  }

  // Convertir cadena de tiempo "HH:mm:ss" a minutos desde medianoche
  parseTime(time: string): number {
    const [hours, minutes] = time.split(':').map(Number);
    return hours * 60 + minutes;
  }

  // Verificar si dos rangos de tiempo se superponen
  doTimesOverlap(start1: number, end1: number, start2: number, end2: number): boolean {
    return start1 < end2 && start2 < end1;
  }
}