  import { Component, OnInit } from '@angular/core';
  import { Router } from '@angular/router';
  import { NoticiaService } from 'src/app/services/Menu/Menu.service';
  import { Noticia } from 'src/app/models/entity/Noticia.interface';
  import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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
    noticias: Noticia[] = [];
    editando: boolean = false;
    noticiaId: string | null = null; 

    constructor(
      private noticiaService: NoticiaService, 
      private router: Router,
      private sanitizer: DomSanitizer 
    ) { }

    ngOnInit(): void {
      this.cargarNoticias(); 
    }
    getImagenNoticia(noticiaId: string): SafeResourceUrl | null {
      const noticia = this.noticias.find(n => n.id === noticiaId);
      return noticia ? noticia.imagen : null;
    }
    onImageSelected(event: any): void {
      const file = event.target.files[0];
      if (file) {
          this.imagenFile = file;
          const reader = new FileReader();
          reader.onload = () => {
              this.imagen = this.sanitizer.bypassSecurityTrustResourceUrl(reader.result as string);
          };
          reader.readAsDataURL(file);
      }
    }

    agregarNoticia(): void {
      if (this.titulo && this.contenido && (this.imagenFile || this.editando)) {
        const request$ = this.editando && this.noticiaId 
          ? this.noticiaService.actualizarNoticia(this.noticiaId, this.titulo, this.contenido, this.imagenFile) 
          : this.noticiaService.crearNoticia(this.titulo, this.contenido, this.imagenFile);

        request$.subscribe({
          next: () => {
            alert(this.editando ? 'Noticia actualizada exitosamente' : 'Noticia creada exitosamente');
            this.resetForm();
            this.cargarNoticias(); 
          },
          error: (error) => {
            console.error('Error:', error);
            alert('Ocurrió un error al procesar la solicitud.');
          }
        });
      } else {
        alert('Por favor completa todos los campos.');
      }
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

    editarNoticia(noticia: Noticia): void {
      this.titulo = noticia.titulo;
      this.contenido = noticia.contenido;
      this.noticiaId = noticia.id; 
      this.imagen = null; 
      this.editando = true; 
      this.imagenFile = null; 
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
          }
        });
      }
    }

    resetForm(): void {
      this.titulo = '';
      this.contenido = '';
      this.imagen = null;
      this.imagenFile = null; 
      this.editando = false;
      this.noticiaId = null;
    }
  }
