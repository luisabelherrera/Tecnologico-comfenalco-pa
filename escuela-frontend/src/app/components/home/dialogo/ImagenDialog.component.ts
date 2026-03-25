import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-imagen-dialog',
  templateUrl: './imagen-dialog.component.html',
  styleUrls: ['./imagen-dialog.component.scss'],
})
export class ImagenDialogComponent {
  constructor(
    private dialogRef: MatDialogRef<ImagenDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      titulo: string;
      contenido: string;
      imagen: SafeResourceUrl | null;
      video: SafeResourceUrl | null; // Add video
      fechaCreacion: Date;
    }
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}