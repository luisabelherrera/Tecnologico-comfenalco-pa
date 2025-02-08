import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-venta-informacion',
  templateUrl: './venta-informacion.component.html',
  styleUrls: ['./venta-informacion.component.scss']
})
export class VentaInformacionComponent implements OnInit {
noticias: any;

  constructor(    private router: Router,) {     }

  ngOnInit(): void {}


  irAOtraVentana() {
    this.router.navigate(['/login']); 
  }
  
  irAOtraVentana2() {
    this.router.navigate(['/juego']); 
  }

  
}
