import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {
  mensajeError: string;

  constructor() {
    this.mensajeError = 'No tienes permiso para acceder a esta página. Por favor, contacta al administrador si crees que esto es un error.';
  }

  ngOnInit(): void {}
}
