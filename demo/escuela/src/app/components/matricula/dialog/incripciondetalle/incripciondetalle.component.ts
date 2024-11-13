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
    
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.text('Detalles de Inscripción', 14, 20);
    
    doc.setFontSize(12);
    doc.text('-----------------------------------', 14, 25);
    
    const details = [
        { label: 'Valor Código', value: this.data.valorCodigo },
        { label: 'Código', value: this.data.codigo },
        { label: 'Situación', value: this.data.situacion },
        { label: 'Nivel Detalle', value: this.data.nivelDetalle.nivel.descripcionNivel },
        { label: 'Estudiante', value: `${this.data.estudiante.nombres} ${this.data.estudiante.apellidos}` },
        { label: 'Acudiente', value: `${this.data.acudiente.nombres} ${this.data.acudiente.apellidos}` },
        { label: 'Institución de Procedencia', value: this.data.institucionProcedencia, multiline: true },
        { label: 'Es Repitente', value: this.data.esRepitente ? 'Sí' : 'No', underline: true },
        { label: 'Activo', value: this.data.activo ? 'Sí' : 'No' },
        { label: 'Fecha Registro', value: this.data.fechaRegistro }
    ];
    
    doc.setFontSize(16);
    doc.text('Información General', 14, 35);
    doc.setFontSize(12);
    doc.text('-----------------------------------', 14, 40);
    
    let startY = 45;

    details.forEach((detail) => {
        doc.setFontSize(12);
        const labelX = 14;
        const valueX = 60;

        doc.line(labelX, startY + 3, 195, startY + 3);

        doc.text(`${detail.label}:`, labelX, startY);
        
        const valueString = detail.value instanceof Date ? detail.value.toLocaleDateString() : String(detail.value);
        
        if (detail.multiline) {
            const textLines = doc.splitTextToSize(valueString, 130);
            doc.text(textLines, labelX, startY + 10);
            startY += 10 + (textLines.length * 5);
        } else {
            doc.text(valueString, valueX, startY);
            startY += 10;
        }

        if (detail.underline) {
            startY += 5;
            doc.line(labelX, startY, 195, startY);
            startY += 5;
        }
    });

    doc.line(14, startY - 7, 195, startY - 7);

    doc.setFontSize(10);
    doc.setTextColor(150, 150, 150);
    doc.text('El Hobo - Institución Educativa', 14, startY + 10);
    
    doc.save('detalle_inscripcion.pdf');
}





  onClose(): void {
    this.dialogRef.close();
  }
}