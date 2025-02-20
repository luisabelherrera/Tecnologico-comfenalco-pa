import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
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
    @Inject(MAT_DIALOG_DATA) public data: Inscripcion,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      console.log('Datos recibidos para el pago:', params);
    });
  }

  /** Descarga un archivo Excel con los detalles de la inscripción */
  downloadExcel() {
    const data = [
      {
        "Valor Código": this.data?.valorCodigo || 'No disponible',
        "Código": this.data?.codigo || 'No disponible',
        "Situación": this.data?.situacion || 'No disponible',
        "Nivel Detalle": this.data?.nivelDetalle?.nivel?.descripcionNivel || 'No disponible',
        "Estudiante": `${this.data?.estudiante?.nombres || ''} ${this.data?.estudiante?.apellidos || ''}`,
        "Acudiente": `${this.data?.acudiente?.nombres || ''} ${this.data?.acudiente?.apellidos || ''}`,
        "Institución de Procedencia": this.data?.institucionProcedencia || 'No disponible',
        "Es Repitente": this.data?.esRepitente ? 'Sí' : 'No',
        "Activo": this.data?.activo ? 'Sí' : 'No',
        "Fecha Registro": this.data?.fechaRegistro || 'No disponible'
      }
    ];
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Detalles de Inscripción');
    XLSX.writeFile(wb, 'detalle_inscripcion.xlsx');
  }

  /** Redirige a la factura con los datos del pago */
  realizarPago() {
    const pagoData = {
      estudiante: `${this.data?.estudiante?.nombres || ''} ${this.data?.estudiante?.apellidos || ''}`,
      montoPago: this.data?.montoPago || 0,
      metodoPago: this.data?.metodoPago || 'No especificado',
      codigo: this.data?.codigo || 'N/A'
    };

    this.router.navigate(['/factura'], { queryParams: pagoData });
  }

  /** Genera un PDF con los detalles de la inscripción */
  downloadPDF() {
    const doc = new jsPDF();

    // Establecer el fondo de color
    doc.setFillColor(240, 240, 240);
    doc.rect(0, 0, 210, 297, 'F');

    // Título
    doc.setFontSize(22);
    doc.setTextColor(40, 40, 40);
    doc.setFont('helvetica', 'bold');
    doc.text('Detalles de Inscripción', 14, 20);

    // Línea decorativa
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(0.5);
    doc.line(14, 25, 195, 25);

    let startY = 35;
    const details = [
      { label: 'Valor Código', value: this.data?.valorCodigo || 'N/A' },
      { label: 'Código', value: this.data?.codigo || 'N/A' },
      { label: 'Situación', value: this.data?.situacion || 'N/A' },
      { label: 'Nivel Detalle', value: this.data?.nivelDetalle?.nivel?.descripcionNivel || 'N/A' },
      { label: 'Estudiante', value: `${this.data?.estudiante?.nombres || ''} ${this.data?.estudiante?.apellidos || ''}` },
      { label: 'Acudiente', value: `${this.data?.acudiente?.nombres || ''} ${this.data?.acudiente?.apellidos || ''}` },
      { label: 'Institución de Procedencia', value: this.data?.institucionProcedencia || 'N/A', multiline: true },
      { label: 'Es Repitente', value: this.data?.esRepitente ? 'Sí' : 'No', underline: true },
      { label: 'Activo', value: this.data?.activo ? 'Sí' : 'No' },
      { label: 'Fecha Registro', value: this.data?.fechaRegistro || 'N/A' }
    ];

    details.forEach((detail) => {
      doc.setFontSize(12);
      const labelX = 14;
      const valueX = 60;
      doc.setDrawColor(200, 200, 200);
      doc.line(labelX, startY + 3, 195, startY + 3);

      doc.setTextColor(40, 40, 40);
      doc.setFont('helvetica', 'bold');
      doc.text(`${detail.label}:`, labelX, startY);

      const valueString = String(detail.value);
      doc.setFont('helvetica', 'normal');

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

    // Información del Pago
    doc.setFontSize(16);
    doc.text('Información del Pago', 14, startY + 10);
    doc.setFontSize(12);
    doc.line(14, startY + 15, 195, startY + 15);

    startY += 20;
    const paymentDetails = [
      { label: 'Monto Pagado', value: `$${this.data?.montoPago || '0.00'}` },
      { label: 'Fecha de Pago', value: this.data?.fechaPago || 'N/A' },
      { label: 'Estado del Pago', value: this.data?.estadoPago || 'Pendiente' }
    ];

    paymentDetails.forEach((detail) => {
      doc.setFontSize(12);
      doc.setTextColor(40, 40, 40);
      doc.setFont('helvetica', 'bold');
      doc.text(`${detail.label}:`, 14, startY);
      doc.setFont('helvetica', 'normal');
      doc.text(String(detail.value), 60, startY);
      startY += 10;
    });

    // Estado de Matrícula
    doc.setFontSize(16);
    doc.text('Validación de Matrícula', 14, startY + 10);
    doc.setFontSize(12);
    doc.line(14, startY + 15, 195, startY + 15);

    startY += 20;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Estado de Matrícula:', 14, startY);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 128, 0);
    doc.text('Matriculado', 60, startY);

    doc.save('detalle_inscripcion.pdf');
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
