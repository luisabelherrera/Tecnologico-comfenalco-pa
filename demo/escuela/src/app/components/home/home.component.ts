import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { Noticia } from 'src/app/models/entity/Noticia.interface';
import { NoticiaService } from 'src/app/services/Menu/Menu.service';
import { ImagenDialogComponent } from './dialogo/ImagenDialog.component';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  noticias: Noticia[] = [];

  constructor(
    private noticiaService: NoticiaService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.cargarNoticias();
  }

  cargarNoticias(): void {
    this.noticiaService.obtenerNoticias().subscribe({
      next: (data: Noticia[]) => {
        this.noticias = data;
        this.noticias.forEach(noticia => this.cargarImagen(noticia));
      },
      error: (error) => {
        console.error('Error al cargar noticias', error);
      }
    });
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

  mostrarImagen(noticia: Noticia): void {
    const dialogRef = this.dialog.open(ImagenDialogComponent, {
      data: {
        titulo: noticia.titulo,
        contenido: noticia.contenido,
        imagen: noticia.imagen,
        fechaCreacion: noticia.fechaCreacion 
      }
    });
  
    dialogRef.afterClosed().subscribe(result => {
    });
  }
}  