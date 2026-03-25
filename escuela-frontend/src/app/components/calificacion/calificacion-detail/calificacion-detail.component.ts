import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalificacionService } from 'src/app/services/calificacion/calificacion.service';
import { Calificacion } from 'src/app/models/entity/Calificacion.interface';
import { jsPDF } from 'jspdf';
import * as html2pdf from 'html2pdf.js';

@Component({
  selector: 'app-calificacion-detail',
  templateUrl: './calificacion-detail.component.html',
  styleUrls: ['./calificacion-detail.component.scss']
})
export class CalificacionDetailComponent implements OnInit {
  calificacion: Calificacion = {
    idCalificacion: 0,
    curricular: { idCurricular: 0, descripcion: '', activo: true, fechaRegistro: new Date() },
    estudiante: {
      idEstudiante: 0,
      valorCodigo: '',
      codigo: '',
      nombres: '',
      apellidos: '',
      documentoIdentidad: '',
      fechaNacimiento: new Date(),
      sexo: '',
      ciudad: '',
      direccion: '',
      activo: true
    },
    nota: 0,
    activo: true,
    fechaRegistro: new Date()
  };

  loading: boolean = true;
  error: string | null = null;

  constructor(private route: ActivatedRoute, private calificacionService: CalificacionService) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    this.getCalificacionDetail(id);
  }

  getCalificacionDetail(id: string | null): void {
    if (id) {
      this.calificacionService.getCalificacionById(+id).subscribe(
        data => {
          console.log('Datos recibidos:', data);

          if (typeof data.fechaRegistro === 'string') {
            data.fechaRegistro = new Date(data.fechaRegistro);
          }

          if (typeof data.estudiante.fechaNacimiento === 'string') {
            data.estudiante.fechaNacimiento = new Date(data.estudiante.fechaNacimiento);
          }

          this.calificacion = data;
          this.loading = false;
        },
        error => {
          this.error = 'Error fetching calificacion details';
          this.loading = false;
        }
      );
    } else {
      this.loading = false;
    }
  }

  printPDF(): void {
    const element = document.getElementById('print-content');
    if (!element) {
      console.error('No se encontró el elemento con id="print-content"');
      return;
    }

    const options = {
      margin: 10,
      filename: `boletin_calificacion_${this.calificacion.idCalificacion}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf()
      .from(element)
      .set(options)
      .save()
      .catch(error => {
        console.error('Error generating PDF:', error);
        this.error = 'Error al generar el PDF. Verifica la consola para más detalles.';
      });
  }
}