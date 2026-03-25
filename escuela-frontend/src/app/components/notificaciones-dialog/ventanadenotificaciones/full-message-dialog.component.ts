import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NotificacionService } from 'src/app/services/notificacion/NotificacionService';

@Component({
  selector: 'app-full-message-dialog',
  templateUrl: './full-message-dialog.component.html',
  styleUrls: ['./full-message-dialog.component.scss'],
})
export class FullMessageDialogComponent {
  errorMessage: string = '';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { message: string; title: string; id: string },
    private dialogRef: MatDialogRef<FullMessageDialogComponent>,
    private notificacionService: NotificacionService
  ) {
    console.log('Full message dialog data:', this.data); // Debug log
  }

  markAsRead(): void {
    this.notificacionService.marcarComoLeida(this.data.id).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.errorMessage = error.message;
        console.error('Error marking as read:', error);
      }
    });
  }

  deleteNotification(): void {
    this.notificacionService.eliminarNotificacion(this.data.id).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (error) => {
        this.errorMessage = error.message;
        console.error('Error deleting notification:', error);
      }
    });
  }

  close(): void {
    this.dialogRef.close(false);
  }
}