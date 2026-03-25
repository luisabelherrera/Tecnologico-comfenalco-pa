import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FullMessageDialogComponent } from './ventanadenotificaciones/full-message-dialog.component';
import { Observable } from 'rxjs';
import { Theme, TemaHeaderService } from 'src/app/services/tema-header/tema-header.service';
import { NotificacionService } from 'src/app/services/notificacion/NotificacionService';
import { Notificacion } from 'src/app/models/entity/Notificacion';

@Component({
  selector: 'app-notificaciones-dialog',
  templateUrl: './notificaciones-dialog.component.html',
  styleUrls: ['./notificaciones-dialog.component.scss'],
})
export class NotificacionesDialogComponent {
  currentTheme$: Observable<Theme>;
  notifications: Notificacion[] = [];
  unreadCount: number = 0;

  constructor(
    private temaHeaderService: TemaHeaderService,
    public dialogRef: MatDialogRef<NotificacionesDialogComponent>,
    private notificacionService: NotificacionService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.currentTheme$ = this.temaHeaderService.currentTheme$;
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.notificacionService.obtenerNotificaciones().subscribe({
      next: (notifications) => {
        console.log('Notifications processed:', notifications); // Debug log
        this.notifications = notifications;
        this.updateUnreadCount();
      },
      error: (error) => {
        console.error('Error loading notifications:', error);
      }
    });
  }

  markAsRead(id: string): void {
    this.notificacionService.marcarComoLeida(id).subscribe({
      next: (updatedNotification) => {
        const notification = this.notifications.find(n => n.id === id);
        if (notification) {
          notification.leida = true;
          this.updateUnreadCount();
        }
      },
      error: (error) => {
        console.error('Error marking notification as read:', error);
      }
    });
  }

  openFullMessage(notification: Notificacion): void {
    const dialogRef = this.dialog.open(FullMessageDialogComponent, {
      width: '800px',
      data: {
        message: notification.mensaje,
        title: notification.titulo,
        id: notification.id
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadNotifications();
      }
    });
  }

  close(): void {
    this.dialogRef.close();
  }

  private updateUnreadCount(): void {
    this.unreadCount = this.notifications.filter(n => !n.leida).length;
  }
}