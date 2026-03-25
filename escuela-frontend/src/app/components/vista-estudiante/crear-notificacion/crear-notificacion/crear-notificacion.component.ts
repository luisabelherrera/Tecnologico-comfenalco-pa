import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificacionService } from 'src/app/services/notificacion/NotificacionService';
import { AuthService } from 'src/app/services/auth/AuthService.service';

@Component({
  selector: 'app-crear-notificacion',
  templateUrl: './crear-notificacion.component.html',
  styleUrls: ['./crear-notificacion.component.scss']
})
export class CrearNotificacionComponent implements OnInit {
  notificacionForm: FormGroup;
  isSubmitting = false;
  successMessage: string = '';
  errorMessage: string = '';
  username: string | null = null;

  constructor(
    private notificacionService: NotificacionService,
    private fb: FormBuilder,
    private authService: AuthService // Inject AuthService
  ) {
    this.notificacionForm = this.fb.group({
      titulo: ['', [Validators.required, Validators.minLength(3)]],
      mensaje: ['', [Validators.required, Validators.minLength(5)]]
    });
  }

  ngOnInit(): void {
    // Subscribe to userName$ to get the current username
    this.authService.userName$.subscribe((username) => {
      this.username = username;
      if (username) {
        this.notificacionForm.patchValue({
          titulo: `${username} - ` // Prepend username to title
        });
      }
    });

    // Optional: Check authentication status
    this.authService.isAuthenticated$.subscribe((authenticated) => {
      if (!authenticated) {
        this.errorMessage = 'Por favor, inicia sesión para crear notificaciones.';
      }
    });
  }

  onSubmit(): void {
    if (this.notificacionForm.invalid || !this.username) {
      this.errorMessage = this.username ? 'Formulario inválido.' : 'Debes estar autenticado.';
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';

    const notificacionData = {
      mensaje: this.notificacionForm.value.mensaje,
      titulo: this.notificacionForm.value.titulo // Include title with username
    };

    // Assuming notificarAdministrador accepts a string (original version)
    this.notificacionService.notificarAdministrador(notificacionData.mensaje)
      .subscribe({
        next: (response) => {
          this.successMessage = 'Notificación creada exitosamente';
          this.notificacionForm.reset();
          if (this.username) {
            this.notificacionForm.patchValue({ titulo: `${this.username} - ` }); // Reset with username
          }
          this.isSubmitting = false;
        },
        error: (error) => {
          this.errorMessage = 'Error al crear la notificación: ' + error.message;
          this.isSubmitting = false;
        }
      });
  }

  get f() {
    return this.notificacionForm.controls;
  }
}