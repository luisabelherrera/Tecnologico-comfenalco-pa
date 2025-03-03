import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NoticiaService } from 'src/app/services/Menu/Menu.service';
import { Noticia } from 'src/app/models/entity/Noticia.interface';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-agregar-noticia',
  templateUrl: './agregar-noticia.component.html',
  styleUrls: ['./agregar-noticia.component.scss']
})
export class AgregarNoticiaComponent implements OnInit {
  titulo: string = '';
  contenido: string = '';
  imagen: SafeResourceUrl | null = null;
  imagenFile: File | null = null;
  video: SafeResourceUrl | null = null;
  videoFile: File | null = null;
  noticias: Noticia[] = [];
  editando: boolean = false;
  noticiaId: string | null = null;

  constructor(
    private noticiaService: NoticiaService,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.cargarNoticias();
  }

  onFileSelected(event: any, type: 'imagen' | 'video'): void {
    const file = event.target.files[0];
    if (file) {
      if (type === 'imagen') {
        this.imagenFile = file;
        const reader = new FileReader();
        reader.onload = () => {
          this.imagen = this.sanitizer.bypassSecurityTrustResourceUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      } else if (type === 'video') {
        this.videoFile = file;
        const reader = new FileReader();
        reader.onload = () => {
          this.video = this.sanitizer.bypassSecurityTrustResourceUrl(reader.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  }

  agregarNoticia(): void {
    if (this.titulo && this.contenido) {
      const request$ = this.editando && this.noticiaId
        ? this.noticiaService.actualizarNoticia(this.noticiaId, this.titulo, this.contenido, this.imagenFile, this.videoFile)
        : this.noticiaService.crearNoticia(this.titulo, this.contenido, this.imagenFile, this.videoFile);

      request$.subscribe({
        next: (noticia) => {
          console.log('Noticia processed:', noticia);
          alert(this.editando ? 'Noticia actualizada exitosamente' : 'Noticia creada exitosamente');
          this.resetForm();
          this.cargarNoticias();
        },
        error: (error) => {
          console.error('Error processing noticia:', error);
          alert('Ocurrió un error: ' + (error.message || 'Unknown error'));
        }
      });
    } else {
      alert('Por favor completa los campos obligatorios (título y contenido).');
    }
  }

  cargarNoticias(): void {
    this.noticiaService.obtenerNoticias().subscribe({
      next: (data: Noticia[]) => {
        this.noticias = data;
        this.noticias.forEach(noticia => {
          this.cargarImagen(noticia);
          this.cargarVideo(noticia);
        });
      },
      error: (error) => {
        console.error('Error al cargar noticias:', error);
      }
    });
  }

  cargarImagen(noticia: Noticia): void {
    if (noticia.id && noticia.imagenPath) {
      this.noticiaService.obtenerImagenNoticia(noticia.id).subscribe({
        next: (blob) => {
          if (blob) {
            const objectURL = URL.createObjectURL(blob);
            noticia.imagen = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          }
        },
        error: (error) => {
          console.error('Error al cargar imagen:', error);
          noticia.imagen = null;
        }
      });
    }
  }

  cargarVideo(noticia: Noticia): void {
    if (noticia.id && noticia.videoPath) {
      this.noticiaService.obtenerVideoNoticia(noticia.id).subscribe({
        next: (blob) => {
          if (blob) {
            const objectURL = URL.createObjectURL(blob);
            noticia.video = this.sanitizer.bypassSecurityTrustUrl(objectURL);
            console.log('Video loaded for noticia:', noticia.id);
          }
        },
        error: (error) => {
          console.error('Error al cargar video:', error);
          noticia.video = null;
        }
      });
    }
  }
  editarNoticia(noticia: Noticia): void {
    this.titulo = noticia.titulo;
    this.contenido = noticia.contenido;
    this.noticiaId = noticia.id;
    this.imagen = noticia.imagen || null;
    this.video = noticia.video || null;
    this.imagenFile = null;
    this.videoFile = null;
    this.editando = true;
  }

  eliminarNoticia(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta noticia?')) {
      this.noticiaService.eliminarNoticia(id).subscribe({
        next: () => {
          alert('Noticia eliminada exitosamente');
          this.cargarNoticias();
        },
        error: (error) => {
          console.error('Error al eliminar noticia:', error);
          alert('Ocurrió un error al eliminar la noticia.');
        }
      });
    }
  }

  resetForm(): void {
    this.titulo = '';
    this.contenido = '';
    this.imagen = null;
    this.imagenFile = null;
    this.video = null;
    this.videoFile = null;
    this.editando = false;
    this.noticiaId = null;
  }
}