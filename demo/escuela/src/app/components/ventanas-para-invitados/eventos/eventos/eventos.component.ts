import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.scss']
})
export class EventosComponent implements OnInit {

  constructor(private router: Router,) { }

  ngOnInit( ): void {
  }


  irAOtraVentana() {
    this.router.navigate(['/venta-informacion']); 
  }
  

}
