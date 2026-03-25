import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

interface Pregunta {
  pregunta: string;
  opciones: string[];
  respuestaCorrecta: string;
}

@Component({
  selector: 'app-quiz',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class QuizComponent {


  constructor(private router: Router) {}
  irAOtraVentana2() {
    this.router.navigate(['/VentaInformacionComponent']); 
  }

}
