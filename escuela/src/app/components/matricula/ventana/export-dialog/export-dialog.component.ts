import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as XLSX from 'xlsx'; // Ensure you have xlsx installed

@Component({
  selector: 'app-export-dialog',
  templateUrl: './export-dialog.component.html',
  styleUrls: ['./export-dialog.component.scss']
})
export class ExportDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<ExportDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { inscripciones: any[] } 
  ) {}

  downloadExcel(): void {
    const excelData = this.data.inscripciones.map(inscripcion => ({
      'Valor Código': inscripcion.valorCodigo,
      'Código': inscripcion.codigo,
      'Situación': inscripcion.situacion,
      'Nivel Detalle': inscripcion.nivelDetalle.nivel.descripcionNivel,
      'Estudiante': `${inscripcion.estudiante.nombres} ${inscripcion.estudiante.apellidos}`,
      'Acudiente': `${inscripcion.acudiente.nombres} ${inscripcion.acudiente.apellidos}`,
      'Institución de Procedencia': inscripcion.institucionProcedencia,
      'Es Repitente': inscripcion.esRepitente ? 'Sí' : 'No',
      'Activo': inscripcion.activo ? 'Sí' : 'No',
      'Fecha Registro': inscripcion.fechaRegistro ? new Date(inscripcion.fechaRegistro).toLocaleDateString() : ''
    }));

    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(excelData);
    const workbook: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inscripciones');

    const fileName = 'inscripciones.xlsx';
    XLSX.writeFile(workbook, fileName);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
