import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Acudiente } from 'src/app/models/entity/Acudiente.interface';

@Component({
  selector: 'app-matricular-acudiente-dialog',
  templateUrl: './matricular-acudiente-dialog.component.html',
  styleUrls: ['./matricular-acudiente-dialog.component.scss']
})
export class MatricularAcudienteDialogComponent{
  selectedAcudiente: Acudiente | null = null;
  searchTerm: string = '';

  constructor(
    public dialogRef: MatDialogRef<MatricularAcudienteDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { acudientes: Acudiente[] }
  ) {}

  selectAcudiente(acudiente: Acudiente): void {
    this.selectedAcudiente = acudiente;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  confirmSelection(): void {
    this.dialogRef.close(this.selectedAcudiente);
  }

  get filteredAcudientes(): Acudiente[] {
    return this.data.acudientes.filter(acudiente => 
      `${acudiente.nombres} ${acudiente.apellidos}`.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      acudiente.documentoIdentidad.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }
}