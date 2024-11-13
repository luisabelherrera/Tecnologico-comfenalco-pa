import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CalificacionService } from 'src/app/services/calificacion/calificacion.service';
import { Calificacion } from 'src/app/models/entity/Calificacion.interface';
import { jsPDF } from 'jspdf'; // Importa jsPDF

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
    const doc = new jsPDF('p', 'pt', 'a4');
    const logoPath = 'assets/OIP.jpg'; 
    const logo = new Image();
    logo.src = logoPath;

    const marginX = 20;
    const marginY = 20;
    const logoWidth = 50; 
    const logoHeight = 20; 
    const lineSpacing = 30; // Aumentar el espaciado entre líneas

    logo.onload = () => {
        try {
            doc.addImage(logo, 'JPEG', marginX, marginY, logoWidth, logoHeight);

            doc.setFont('helvetica', 'bold');
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            doc.text('NIT: 123456789', 70, marginY + 5); 
            doc.text('Nombre de la Institución: INSTITUCION EDUCATIVA EL HOBO', 70, marginY + 25);
            doc.text('Dirección de la Institución: CARMEN DE BOLIVAR', 70, marginY + 45);


            
            doc.setFontSize(18);
            doc.setTextColor(40, 100, 200);
            doc.text('Boletín de Calificación', marginX, 80);
            doc.setDrawColor(40, 100, 200);
            doc.line(marginX, 83, 580, 83);

            let currentY = 100;
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.text('Detalles de la Calificación:', marginX, currentY);
            currentY += lineSpacing;
            doc.setFontSize(12);
            doc.setTextColor(60, 60, 60);
            doc.text(`1. ID de Calificación: ${this.calificacion.idCalificacion}`, marginX, currentY);
            currentY += lineSpacing;
            doc.text(`2. Nota: ${this.calificacion.nota.toString()}`, marginX, currentY);

            currentY += lineSpacing;
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.text('Detalles del Estudiante:', marginX, currentY);
            currentY += lineSpacing;
            doc.setFontSize(12);
            doc.setTextColor(60, 60, 60);
            doc.text(`1. Nombre: ${this.calificacion.estudiante.nombres} ${this.calificacion.estudiante.apellidos}`, marginX, currentY);
            currentY += lineSpacing;
            doc.text(`2. Documento de Identidad: ${this.calificacion.estudiante.documentoIdentidad}`, marginX, currentY);
            currentY += lineSpacing;
            const birthDate = this.calificacion.estudiante.fechaNacimiento instanceof Date 
                ? this.calificacion.estudiante.fechaNacimiento.toLocaleDateString() 
                : this.calificacion.estudiante.fechaNacimiento;
            doc.text(`3. Fecha de Nacimiento: ${birthDate}`, marginX, currentY);
            currentY += lineSpacing;
            doc.text(`4. Sexo: ${this.calificacion.estudiante.sexo}`, marginX, currentY);
            currentY += lineSpacing;
            doc.text(`5. Ciudad: ${this.calificacion.estudiante.ciudad}`, marginX, currentY);

            currentY += lineSpacing;
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.text('Detalles Curriculares:', marginX, currentY);
            currentY += lineSpacing;
            doc.setFontSize(12);
            doc.setTextColor(60, 60, 60);
            doc.text(`1. Descripción: ${this.calificacion.curricular.descripcion}`, marginX, currentY);
            currentY += lineSpacing;
            doc.text(`2. Activo: ${this.calificacion.curricular.activo ? 'Sí' : 'No'}`, marginX, currentY);

            currentY += lineSpacing;
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.text('Detalles del Docente:', marginX, currentY);
            currentY += lineSpacing;
            doc.setFontSize(12);
            doc.setTextColor(60, 60, 60);
            doc.text(`1. Nombre: ${this.calificacion.curricular.docenteNivelDetalleCurso.docente.nombres}`, marginX, currentY);
            currentY += lineSpacing;
            doc.text(`2. Apellido: ${this.calificacion.curricular.docenteNivelDetalleCurso.docente.apellidos}`, marginX, currentY);

            currentY += lineSpacing;
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.text('Detalles del Curso:', marginX, currentY);
            currentY += lineSpacing;
            doc.setFontSize(12);
            doc.setTextColor(60, 60, 60);
            doc.text(`1. Nombre del Curso: ${this.calificacion.curricular.docenteNivelDetalleCurso.nivelDetalleCurso.curso.descripcion}`, marginX, currentY);
            currentY += lineSpacing;
            doc.text(`2. Descripción del Curso: ${this.calificacion.curricular.docenteNivelDetalleCurso.nivelDetalleCurso.curso.activo}`, marginX, currentY);
            currentY += lineSpacing;
            doc.text(`3. Fecha de Registro: ${this.calificacion.curricular.docenteNivelDetalleCurso.nivelDetalleCurso.curso.fechaRegistro}`, marginX, currentY);

            currentY += lineSpacing;
            doc.setFontSize(14);
            doc.setTextColor(0, 0, 0);
            doc.text('Fechas Importantes:', marginX, currentY);
            currentY += lineSpacing;
            doc.setFontSize(12);
            doc.setTextColor(60, 60, 60);

            const regDate = this.calificacion.curricular.fechaRegistro instanceof Date 
                ? this.calificacion.curricular.fechaRegistro.toLocaleDateString() 
                : this.calificacion.curricular.fechaRegistro;
            doc.text(`1. Fecha de Registro: ${regDate}`, marginX, currentY);
            currentY += lineSpacing;

            const califRegDate = this.calificacion.fechaRegistro instanceof Date 
                ? this.calificacion.fechaRegistro.toLocaleDateString() 
                : this.calificacion.fechaRegistro;
            doc.text(`2. Fecha de Registro de Calificación: ${califRegDate}`, marginX, currentY);

            doc.setDrawColor(40, 100, 200);
            currentY += lineSpacing;
            doc.line(marginX, currentY, 580, currentY);

            doc.save('boletin_calificaciones.pdf');
        } catch (error) {
            console.error('Error generating PDF:', error);
            doc.text('Error al generar el PDF.', marginX, marginY);
            doc.save('boletin_calificaciones.pdf');
        }
    };

    logo.onerror = () => {
        console.error('Error loading the image');
        doc.text('Error al cargar el logo.', marginX, marginY);
        doc.save('boletin_calificaciones.pdf');
    };
}


}


