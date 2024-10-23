import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import jsPDF from 'jspdf';
import { Inscripcion } from 'src/app/models/entity/Inscripcion.interface';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-incripciondetalle',
  templateUrl: './incripciondetalle.component.html',
  styleUrls: ['./incripciondetalle.component.scss']
})
export class IncripciondetalleComponent  {

  constructor(
    public dialogRef: MatDialogRef<IncripciondetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Inscripcion
  ) {}

  downloadExcel() {
    const data = [
      {
        "Valor Código": this.data.valorCodigo,
        "Código": this.data.codigo,
        "Situación": this.data.situacion,
        "Nivel Detalle": this.data.nivelDetalle.nivel.descripcionNivel,
        "Estudiante": `${this.data.estudiante.nombres} ${this.data.estudiante.apellidos}`,
        "Acudiente": `${this.data.acudiente.nombres} ${this.data.acudiente.apellidos}`,
        "Institución de Procedencia": this.data.institucionProcedencia,
        "Es Repitente": this.data.esRepitente ? 'Sí' : 'No',
        "Activo": this.data.activo ? 'Sí' : 'No',
        "Fecha Registro": this.data.fechaRegistro
      }
    ];
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Detalles de Inscripción');
  
    XLSX.writeFile(wb, 'detalle_inscripcion.xlsx');
  }
  
  downloadPDF() {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text('Detalles de Inscripción', 14, 20);
    
    doc.setFontSize(12);
    const details = [
      `Valor Código: ${this.data.valorCodigo}`,
      `Código: ${this.data.codigo}`,
      `Situación: ${this.data.situacion}`,
      `Nivel Detalle: ${this.data.nivelDetalle.nivel.descripcionNivel}`,
      `Estudiante: ${this.data.estudiante.nombres} ${this.data.estudiante.apellidos}`,
      `Acudiente: ${this.data.acudiente.nombres} ${this.data.acudiente.apellidos}`,
      `Institución de Procedencia: ${this.data.institucionProcedencia}`,
      `Es Repitente: ${this.data.esRepitente ? 'Sí' : 'No'}`,
      `Activo: ${this.data.activo ? 'Sí' : 'No'}`,
      `Fecha Registro: ${this.data.fechaRegistro}`
    ];
    
    details.forEach((line, index) => {
      doc.text(line, 14, 30 + (index * 10));
    });
    
    doc.save('detalle_inscripcion.pdf');
  }
  

  onClose(): void {
    this.dialogRef.close();
  }
}