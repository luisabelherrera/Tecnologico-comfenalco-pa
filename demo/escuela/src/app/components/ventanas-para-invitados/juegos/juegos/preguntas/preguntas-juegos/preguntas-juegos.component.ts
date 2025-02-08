import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-preguntas-juegos',
  templateUrl: './preguntas-juegos.component.html',
  styleUrls: ['./preguntas-juegos.component.scss']
})
export class PreguntasJuegosComponent implements OnInit {

  niveles = ['Primaria', 'Secundaria', 'Universidad'];
  nivelSeleccionado = '';
  preguntas: any[] = [];
  respuestas: any[] = [];
  completado = false;
  puntaje = 0;
  resultado = false;
  sugerencia = '';

  bancoPreguntas = {
    'Primaria': [
      { texto: '¿Cuánto es 2 + 2?', opciones: ['3', '4', '5'], correcta: '4' },
      { texto: '¿Cuál es la capital de Francia?', opciones: ['Madrid', 'París', 'Londres'], correcta: 'París' }
    ],
    'Secundaria': [
      { texto: '¿Quién escribió "Don Quijote"?', opciones: ['Cervantes', 'García Márquez', 'Borges'], correcta: 'Cervantes' },
      { texto: '¿Cuál es la raíz cuadrada de 16?', opciones: ['3', '4', '5'], correcta: '4' }
    ],
    'Universidad': [
      { texto: '¿Qué es la fotosíntesis?', opciones: ['Proceso químico', 'Reacción nuclear', 'Sistema de ecuaciones'], correcta: 'Proceso químico' },
      { texto: '¿Qué significa "E=mc²"?', opciones: ['Energía es igual a masa por velocidad', 'Energía es igual a masa por la velocidad de la luz al cuadrado', 'Energía no tiene fórmula'], correcta: 'Energía es igual a masa por la velocidad de la luz al cuadrado' }
    ]
  };

  ngOnInit(): void {
    // Puedes inicializar variables aquí si es necesario
    console.log('Componente PreguntasJuegosComponent inicializado');
  }

  seleccionarNivel(nivel: string) {
    this.nivelSeleccionado = nivel;
    this.preguntas = this.bancoPreguntas[nivel];
    this.respuestas = new Array(this.preguntas.length).fill(null);
  }

  responder(index: number, respuesta: string) {
    this.respuestas[index] = respuesta;
    this.completado = this.respuestas.every(r => r !== null);
  }

  calificar() {
    this.puntaje = this.respuestas.filter((r, i) => r === this.preguntas[i].correcta).length;
    this.resultado = true;
    this.sugerencia = this.puntaje > (this.preguntas.length / 2) ? '¡Buen trabajo! Sigue así.' : 'Necesitas mejorar, sigue practicando.';
  }
}
