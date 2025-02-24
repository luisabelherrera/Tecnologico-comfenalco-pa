import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FullMessageDialogComponent } from './ventanadenotificaciones/full-message-dialog.component';
import { Observable } from 'rxjs';
import { Theme, TemaHeaderService } from 'src/app/services/tema-header/tema-header.service';

@Component({
  selector: 'app-notificaciones-dialog',
  templateUrl: './notificaciones-dialog.component.html',
  styleUrls: ['./notificaciones-dialog.component.scss'],
})
export class NotificacionesDialogComponent {
  currentTheme$: Observable<Theme>;
  notifications: string[]; // Ajusta el tipo según tus datos reales

  constructor(
    private temaHeaderService: TemaHeaderService,
    public dialogRef: MatDialogRef<NotificacionesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { notifications: string[] }
  ) {
    this.currentTheme$ = this.temaHeaderService.currentTheme$;
    this.notifications = data.notifications;
  }

  openFullMessage(notification: string) {
    // Lógica para abrir el mensaje completo (si aplica)
    console.log('Notificación seleccionada:', notification);
  }

  close() {
    this.dialogRef.close();
  }
}