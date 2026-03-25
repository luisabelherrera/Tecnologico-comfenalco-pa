
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common'; // Asegúrate de importar desde @angular/common
import jsPDF from 'jspdf';
import 'jspdf-autotable';

@Component({
  selector: 'app-factura',
  templateUrl: './factura.component.html',
  styleUrls: ['./factura.component.scss']
})
export class FacturaComponent implements OnInit {
  estudiante: string = '';
  montoPago: number = 0;
  metodoPago: string = '';
  codigo: string = '';
  fecha: string = new Date().toLocaleDateString();

  constructor(
    private route: ActivatedRoute,
    private location: Location // Inyectamos Location desde @angular/common
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.estudiante = params['estudiante'] || 'No especificado';
      this.montoPago = +params['montoPago'] || 0;
      this.metodoPago = params['metodoPago'] || 'No especificado';
      this.codigo = params['codigo'] || 'N/A';
    });
  }

  generarPDF(): void {
    const doc = new jsPDF();

    // Encabezado
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(18);
    doc.text('Factura Electrónica', 75, 20);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Fecha: ${this.fecha}`, 150, 30);
    doc.text(`Código de Factura: ${this.codigo}`, 150, 40);
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Detalles del Cliente:', 14, 50);
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'normal');
    doc.text(`Estudiante: ${this.estudiante}`, 14, 60);
    doc.text(`Método de Pago: ${this.metodoPago}`, 14, 70);

    // Tabla con detalles de la factura
    (doc as any).autoTable({
      startY: 80,
      head: [['Descripción', 'Cantidad', 'Precio']],
      body: [['Inscripción', '1', `$${this.montoPago.toFixed(2)}`]],
      theme: 'striped',
      styles: { halign: 'center' },
      headStyles: { fillColor: [0, 128, 255], textColor: 255 }, // Azul con texto blanco
      columnStyles: { 0: { halign: 'left' } }
    });

    // Total
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    doc.setFont('helvetica', 'bold');
    doc.text(`Total a pagar: $${this.montoPago.toFixed(2)}`, 150, finalY);

    // Mensaje de agradecimiento
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100);
    doc.text('¡Gracias por tu inscripción! Esperamos verte pronto.', 14, finalY + 10);

    // Descargar PDF
    doc.save(`Factura_${this.codigo}.pdf`);
  }

  volver(): void {
    this.location.back(); // Usamos el método back() del servicio Location
  }
}