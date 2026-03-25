import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-juegos',
  templateUrl: './juegos.component.html',
  styleUrls: ['./juegos.component.scss']
})
export class JuegosComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }
  seleccionarJuego() {
    this.router.navigate(['/preguntas']);
  }
}
