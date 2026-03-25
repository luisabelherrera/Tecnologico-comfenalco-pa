import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DocenteNivelDetalleCurso } from 'src/app/models/entity/docente-nivel-detalle-curso.model';
import { Horario } from 'src/app/models/entity/horario.model';
import { UserDto } from 'src/app/models/models';
import { DocenteNivelDetalleCursoService } from 'src/app/services/docente-detalle/docente-nivel-detalle-curso.service';
import { DocentePerfilService } from 'src/app/services/Docente/Docente-perfil/docente-perfil.service';
import { HorarioService } from 'src/app/services/horario/Horario.service';

interface TimeSlot {
  inicio: string;
  fin: string;
}


@Component({
  selector: 'app-horario',
  templateUrl: './horario.component.html',
  styleUrls: ['./horario.component.scss']
})
export class HorarioComponent implements OnInit {

  docente?: UserDto;
  horarios: Horario[] = [];
  docentesNivelDetalleCurso: DocenteNivelDetalleCurso[] = [];
  schedule: { 
    [day: string]: { 
      [timeKey: string]: { 
        curso: string; 
        gradoSeccion: string; 
        turno: string; 
        hasConflict: boolean 
      } 
    } 
  } = {};
  daysOfWeek: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
  timeSlots: TimeSlot[] = [];

  constructor(
    private horarioService: HorarioService,
    private docentePerfilService: DocentePerfilService,
    private docenteNivelDetalleCursoService: DocenteNivelDetalleCursoService
  ) {}

  ngOnInit(): void {
    this.loadDocenteYHorarios();
  }

  loadDocenteYHorarios(): void {
    this.docentePerfilService.getPerfilDocente().subscribe(
      (data) => {
        this.docente = data;
        this.loadHorarios();
      },
      (error) => {
        console.error('Error al obtener el perfil del docente:', error);
      }
    );
  }

  loadHorarios(): void {
    if (!this.docente?.docente?.idDocente) return;

    this.docenteNivelDetalleCursoService.getAll().subscribe(
      (docentesData) => {
        this.docentesNivelDetalleCurso = docentesData.filter(
          (dndc) => dndc.docente.idDocente === this.docente?.docente?.idDocente
        );
        console.log('Asignaciones del docente:', this.docentesNivelDetalleCurso);

        const nivelDetalleCursoIds = this.docentesNivelDetalleCurso.map(dndc => dndc.nivelDetalleCurso.idNivelDetalleCurso);

        this.horarioService.getAllHorarios().subscribe(
          (horariosData) => {
            this.horarios = horariosData.filter(
              (horario) => nivelDetalleCursoIds.includes(horario.nivelDetalleCurso?.idNivelDetalleCurso || 0)
            );
            console.log('Horarios del docente:', this.horarios);

            this.initializeSchedule();

            const horariosPorDia: { [day: string]: Horario[] } = {};
            this.horarios.forEach(horario => {
              if (!horariosPorDia[horario.diaSemana]) horariosPorDia[horario.diaSemana] = [];
              horariosPorDia[horario.diaSemana].push(horario);
            });

            this.horarios.forEach(horario => {
              const startTime = horario.horaInicio.substring(0, 5);
              const endTime = horario.horaFin.substring(0, 5);
              const timeKey = `${startTime}-${endTime}`;
              const day = horario.diaSemana;
              const curso = horario.nivelDetalleCurso?.curso?.descripcion || 'Sin curso';
              const gradoSeccion = horario.nivelDetalleCurso?.nivelDetalle?.gradoSeccion?.descripcionGrado || 'Sin sección';
              const turno = horario.nivelDetalleCurso?.nivelDetalle?.nivel?.descripcionTurno || 'Sin turno';

              const conflictos = this.detectConflicts(horariosPorDia[day] || [], horario);
              const hasConflict = conflictos.length > 0;

              if (!this.schedule[day]) this.schedule[day] = {};
              this.schedule[day][timeKey] = { curso, gradoSeccion, turno, hasConflict };
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
        console.error('Error al obtener asignaciones del docente:', error);
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