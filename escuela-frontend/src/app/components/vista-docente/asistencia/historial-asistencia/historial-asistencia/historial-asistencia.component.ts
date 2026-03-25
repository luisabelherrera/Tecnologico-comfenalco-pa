import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Asistencia, AsistenciaService } from 'src/app/services/Docente/Docente-asistencia/docente-asistencia.service';

@Component({
  selector: 'app-historial-asistencia',
  templateUrl: './historial-asistencia.component.html',
  styleUrls: ['./historial-asistencia.component.scss']
})
export class HistorialAsistenciaComponent implements OnInit {
  // Propiedades
  dataSource: MatTableDataSource<Asistencia>;
  displayedColumns: string[] = ['fecha', 'asistio', 'acciones'];
  totalAsistencias: number = 0;
  totalFaltas: number = 0;
  editingRow: number | null = null;
  filtro: string = '';

  // Constructor
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: Asistencia[],
    private dialogRef: MatDialogRef<HistorialAsistenciaComponent>,
    private asistenciaService: AsistenciaService,
    private snackBar: MatSnackBar
  ) {
    this.dataSource = new MatTableDataSource<Asistencia>(data);
    this.updateCounters();
    // Configurar el filterPredicate al inicializar
    this.dataSource.filterPredicate = this.customFilterPredicate.bind(this);
  }

  // Lifecycle Hooks
  ngOnInit(): void {}

  // Métodos de Acción
  updateCounters(): void {
    this.totalAsistencias = this.dataSource.filteredData.filter(a => a.asistio).length; // Usar filteredData para reflejar el filtro
    this.totalFaltas = this.dataSource.filteredData.filter(a => !a.asistio).length;
  }

  startEditing(asistencia: Asistencia): void {
    this.editingRow = asistencia.idAsistencia || null;
  }

  guardarAsistencia(asistencia: Asistencia): void {
    if (!asistencia.idAsistencia) {
      this.snackBar.open('No se puede modificar una asistencia sin ID.', 'Cerrar', { duration: 5000 });
      return;
    }

    this.asistenciaService.actualizarAsistencia(asistencia).subscribe(
      (updatedAsistencia) => {
        const index = this.dataSource.data.findIndex(a => a.idAsistencia === updatedAsistencia.idAsistencia);
        if (index !== -1) {
          this.dataSource.data[index] = updatedAsistencia;
          this.dataSource.data = [...this.dataSource.data];
          this.updateCounters();
        }
        this.editingRow = null;
        this.snackBar.open('Asistencia actualizada con éxito', 'Cerrar', { duration: 2000 });
        this.dialogRef.close(true);
      },
      (error) => {
        this.snackBar.open(`Error al actualizar asistencia: ${error.message}`, 'Cerrar', { duration: 5000 });
        console.error('Error al actualizar asistencia:', error);
      }
    );
  }

  cancelarEdicion(): void {
    this.editingRow = null;
  }
  cerrarDialogo(): void {
    this.dialogRef.close();
  }
  aplicarFiltro(): void {
    this.dataSource.filter = this.filtro.trim().toLowerCase();
    this.updateCounters(); // Actualizar contadores después de filtrar
  }

  // Filtro personalizado
  customFilterPredicate(data: Asistencia, filter: string): boolean {
    const fechaString = new Date(data.fecha).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).replace(/\//g, ''); // Convertir a "ddMMyyyy" sin barras para facilitar búsqueda
    const asistioString = data.asistio ? 'asistió' : 'faltó';
    const filterLower = filter.replace(/\//g, ''); // Eliminar barras del filtro ingresado

    return (
      fechaString.includes(filterLower) ||
      asistioString.includes(filterLower)
    );
  }
}