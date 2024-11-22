import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FullMessageDialogComponent } from './ventanadenotificaciones/full-message-dialog.component';

@Component({
  selector: 'app-notificaciones-dialog',
  templateUrl: './notificaciones-dialog.component.html',
  styleUrls: ['./notificaciones-dialog.component.scss'],
})
export class NotificacionesDialogComponent {
  notifications: string[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialogRef: MatDialogRef<NotificacionesDialogComponent>,
    private dialog: MatDialog
  ) {
    this.notifications = data.notifications || [];
  }

  close() {
    this.dialogRef.close();
  }

  openFullMessage(message: string): void {
    this.dialog.open(FullMessageDialogComponent, {
      width: '400px',
      data: { message },
    });
  }
}
