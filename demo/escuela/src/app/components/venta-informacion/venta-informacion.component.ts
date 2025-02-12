import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Noticia } from 'src/app/models/entity/Noticia.interface';
import { AuthService } from 'src/app/services/auth/AuthService.service';
import { NoticiaService } from 'src/app/services/Menu/Menu.service';
import { ImagenDialogComponent } from '../home/dialogo/ImagenDialog.component';

@Component({
  selector: 'app-venta-informacion',
  templateUrl: './venta-informacion.component.html',
  styleUrls: ['./venta-informacion.component.scss']
})
export class VentaInformacionComponent implements OnInit {
  noticias: Noticia[] = [];
  selectedSection: string = 'noticias';

  constructor(
    private noticiaService: NoticiaService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {    this.cargarNoticias();}

  cargarNoticias(): void {
    this.noticiaService.obtenerNoticias().subscribe({
      next: (data: Noticia[]) => {
        this.noticias = data.sort((a, b) =>
          new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
        );
        this.noticias.forEach(noticia => this.cargarImagen(noticia));
      },
      error: (error) => {
        console.error('Error al cargar noticias', error);
      }
    });
  }
  irAOtraVentana() {
    this.router.navigate(['/login']); 
  }


  cargarImagen(noticia: Noticia): void {
    if (noticia.id) {
      this.noticiaService.obtenerImagenNoticia(noticia.id).subscribe({
        next: (blob) => {
          const objectURL = URL.createObjectURL(blob);
          noticia.imagen = this.sanitizer.bypassSecurityTrustUrl(objectURL);  
        },
        error: (error) => {
          console.error('Error al cargar la imagen de la noticia', error);
        }
      });
    }
  }

  rotationX: number = 0;
  rotationY: number = 0;
  
  accion4() {
    this.router.navigate(['/juego']); 
  }


  mostrarImagen(noticia: Noticia): void {
    this.dialog.open(ImagenDialogComponent, {
      data: {
        titulo: noticia.titulo,
        contenido: noticia.contenido,
        imagen: noticia.imagen,
        fechaCreacion: noticia.fechaCreacion 
      }
    });
  }

  accion1() {
    // Lógica para la opción 1
  }

  accion5(){
    
  }


  accion2() {
    // Lógica para la opción 2
  }

  accion3() {
    // Lógica para la opción 3
  }

  
}
