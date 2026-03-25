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
export class InscripciondetalleComponent {
  constructor(
    public dialogRef: MatDialogRef<InscripciondetalleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Inscripcion,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    console.log('Datos recibidos para la inscripción:', this.data);
    if (!this.data || Object.keys(this.data).length === 0) {
      console.error('No se recibieron datos para la inscripción');
    }
  }

  /** Descarga un archivo Excel con los detalles de la inscripción */
  downloadExcel() {
    const data = [
      {
        "Valor Código": this.data?.valorCodigo || 'No disponible',
        "Código": this.data?.codigo || 'No disponible',
        "Situación": this.data?.situacion || 'No disponible',
        "Nivel Detalle": this.data?.nivelDetalle?.nivel?.descripcionNivel || 'No disponible',
        "Estudiante": `${this.data?.estudiante?.nombres || ''} ${this.data?.estudiante?.apellidos || ''}`.trim() || 'No disponible',
        "Acudiente": `${this.data?.acudiente?.nombres || ''} ${this.data?.acudiente?.apellidos || ''}`.trim() || 'No disponible',
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

  realizarPago() {
    const pagoData = {
      estudiante: `${this.data?.estudiante?.nombres || ''} ${this.data?.estudiante?.apellidos || ''}`.trim() || 'No disponible',
      montoPago: this.data?.montoPago || 0,
      metodoPago: this.data?.metodoPago || 'No especificado',
      codigo: this.data?.codigo || 'N/A'
    };

    // Cierra el diálogo antes de navegar
    this.dialogRef.close();
    
    // Navega a la ruta /factura con los datos del pago
    this.router.navigate(['/factura'], { queryParams: pagoData });
  }

  downloadPDF() {
    const doc = new jsPDF();

    // Fondo claro y elegante
    doc.setFillColor(245, 245, 245); // Gris muy claro
    doc.rect(0, 0, 210, 297, "F");

    // Encabezado centrado
    doc.setFontSize(24);
    doc.setTextColor(33, 37, 41); // Gris oscuro elegante
    doc.setFont("helvetica", "bold");
    const title = "Detalles de Inscripción";
    const titleWidth = doc.getTextWidth(title);
    doc.text(title, (210 - titleWidth) / 2, 20); // Centrado

    // Añadir encabezado con bandera de Colombia y escudo de la institución
    const headerY = 30;
    const imageWidth = 30;
    const imageHeight = 20;

    try {
      // Asegúrate de que las imágenes existan en la carpeta 'assets/img/'
      doc.addImage("assets/img/Colombia.png", "PNG", 20, headerY, imageWidth, imageHeight);
      doc.addImage("assets/img/image-1.png", "PNG", 160, headerY, imageWidth, imageHeight);
    } catch (error) {
      console.error("Error al cargar las imágenes en el PDF:", error);
      // Continúa generando el PDF sin las imágenes
    }

    // Línea decorativa después del encabezado
    doc.setDrawColor(120, 120, 120);
    doc.setLineWidth(0.7);
    doc.line(20, headerY + imageHeight + 5, 190, headerY + imageHeight + 5);

    // Detalles principales con márgenes ajustados (sin líneas divisorias)
    let startY = headerY + imageHeight + 15;
    const marginLeft = 20;  // Margen izquierdo
    const marginRight = 20; // Margen derecho
    const maxWidth = 210 - marginLeft - marginRight; // Ancho usable
    const labelWidth = 60; // Ancho fijo para etiquetas

    const details = [
      { label: "Valor Código", value: this.data?.valorCodigo || "N/A" },
      { label: "Código", value: this.data?.codigo || "N/A" },
      { label: "Situación", value: this.data?.situacion || "N/A" },
      { label: "Nivel Detalle", value: this.data?.nivelDetalle?.nivel?.descripcionNivel || "N/A" },
      { label: "Estudiante", value: `${this.data?.estudiante?.nombres || ""} ${this.data?.estudiante?.apellidos || ""}`.trim() || "N/A" },
      { label: "Acudiente", value: `${this.data?.acudiente?.nombres || ""} ${this.data?.acudiente?.apellidos || ""}`.trim() || "N/A" },
      { label: "Institución de Procedencia", value: this.data?.institucionProcedencia || "N/A", multiline: true },
      { label: "Es Repitente", value: this.data?.esRepitente ? "Sí" : "No" },
      { label: "Activo", value: this.data?.activo ? "Sí" : "No" },
      { label: "Fecha Registro", value: this.data?.fechaRegistro || "N/A" },
    ];

    doc.setFontSize(11);
    details.forEach((detail) => {
      // Etiqueta
      doc.setTextColor(33, 37, 41);
      doc.setFont("helvetica", "bold");
      doc.text(`${detail.label}:`, marginLeft, startY);

      // Valor
      doc.setFont("helvetica", "normal");
      const valueString = String(detail.value);
      if (detail.multiline) {
        const textLines = doc.splitTextToSize(valueString, maxWidth - labelWidth - 5);
        doc.text(textLines, marginLeft + labelWidth + 5, startY + 5);
        startY += 5 + textLines.length * 5;
      } else {
        doc.text(valueString, marginLeft + labelWidth + 5, startY);
        startY += 10; // Espaciado consistente
      }
    });

    // Sección de Pago con colores (sin líneas divisorias), manejando datos vacíos
    startY += 15;
    doc.setFontSize(16);
    doc.setTextColor(33, 37, 41);
    doc.setFont("helvetica", "bold");
    doc.text("Información del Pago", marginLeft, startY);

    startY += 10;
    const paymentDetails = [
      { label: "Monto Pagado", value: `$${this.data?.montoPago || "0.00"}` },
      { label: "Fecha de Pago", value: this.data?.fechaPago || "N/A" },
      { label: "Estado del Pago", value: this.data?.estadoPago || "Pendiente" },
    ];

    doc.setFontSize(11);
    paymentDetails.forEach((detail) => {
      doc.setTextColor(33, 37, 41);
      doc.setFont("helvetica", "bold");
      doc.text(`${detail.label}:`, marginLeft, startY);
      doc.setFont("helvetica", "normal");
      doc.text(String(detail.value), marginLeft + labelWidth + 5, startY);
      startY += 10;
    });

    // Sección de Validación con colores (sin líneas divisorias)
    startY += 15;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("Validación de Matrícula", marginLeft, startY);

    startY += 10;
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("Estado de Matrícula:", marginLeft, startY);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(0, 135, 102); // Verde elegante
    doc.text("Matriculado", marginLeft + labelWidth + 5, startY);

    // Guardar el archivo
    doc.save("detalle_inscripcion.pdf");
  }

  onClose(): void {
    this.dialogRef.close();
  }
}