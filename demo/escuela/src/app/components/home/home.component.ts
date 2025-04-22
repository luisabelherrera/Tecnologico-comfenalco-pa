import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Noticia } from 'src/app/models/entity/Noticia.interface';
import { NoticiaService } from 'src/app/services/Menu/Menu.service';
import { DomSanitizer, SafeStyle } from '@angular/platform-browser';
import { ImagenDialogComponent } from './dialogo/ImagenDialog.component';
import { AuthService } from 'src/app/services/auth/AuthService.service';
import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Mensaje } from './models/mensaje';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { TemaHeaderService } from 'src/app/services/tema-header/tema-header.service';
import { InformacionInstitucionalService, InformacionInstitucional } from 'src/app/services/servicios-escolares/InformacionInsittucional/informacion-institucional.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  noticias: Noticia[] = [];
  currentTheme$: Observable<any>;
  selectedSection: string = 'noticias';
  userName$ = this.authService.userName$;
  private client: Client;
  emojisVisible: boolean = false;
  conectado: boolean = false;
  mensaje: Mensaje = new Mensaje();
  mensajes: Mensaje[] = [];
  escribiendo: string = '';
  clienteId: string = 'id-' + new Date().getTime() + '-' + Math.random().toString(36).substr(2);
  chatVisible: boolean = false;
  currentYear: number = new Date().getFullYear();
  isAuthenticated: boolean = false;
  isAdmin: boolean = false;
  isBlocked: boolean = false;
  errorMessage: string = '';
  showComments: { [key: string]: boolean } = {};
  comentarioTexto: { [key: string]: string } = {};
  headerBackground: string | SafeStyle = '#ffffff';
  emojis: string[] = ['😊', '🏫', '📚', '✏️', '🎓', '✨', '❤️', '👍'];
  institutionName: string = 'EduPortal'; // Property to hold institution name
  recursosEducativos: Array<any> = [
    {
      titulo: 'Curso de Matemáticas',
      descripcion: 'Un curso completo sobre conceptos básicos y avanzados de matemáticas.',
    },
    {
      titulo: 'Guía de Historia',
      descripcion: 'Una guía completa para entender los eventos históricos más importantes.',
    },
    {
      titulo: 'Plataforma de Recursos de Ciencia',
      descripcion: 'Accede a una variedad de recursos educativos en ciencia.',
    }
  ];

  @ViewChild('scrollChat') scrollChat!: ElementRef;

  constructor(
    private noticiaService: NoticiaService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private authService: AuthService,
    private temaHeaderService: TemaHeaderService,
    private informacionService: InformacionInstitucionalService // Inject the service
  ) {
    this.currentTheme$ = this.temaHeaderService.currentTheme$;
    this.currentTheme$.subscribe(theme => {
      if (theme.backgroundColorLeft && theme.backgroundColorRight) {
        const gradient = `linear-gradient(to right, ${theme.backgroundColorLeft}, ${theme.backgroundColorRight})`;
        this.headerBackground = this.sanitizer.bypassSecurityTrustStyle(gradient);
      } else {
        this.headerBackground = theme.backgroundColor || '#ffffff';
      }
    });
    this.client = new Client(); // Initialize client to avoid undefined errors
  }

  ngOnInit() {
    this.cargarNoticias();
    this.iniciarConexiónWebSocket();
    this.loadInstitutionName(); // Load the institution name

    this.authService.isAuthenticated$.subscribe((authenticated) => {
      this.isAuthenticated = authenticated;
    });

    this.userName$.subscribe((username) => {
      if (username) {
        this.mensaje.username = username;
      }
    });

    this.authService.isAdmin$.subscribe((isAdmin) => {
      this.isAdmin = isAdmin;
    });
  }

  // Method to load the institution name
  loadInstitutionName() {
    this.informacionService.getPublic().subscribe({
      next: (data: InformacionInstitucional) => {
        this.institutionName = data.nombreInstitucion || 'EduPortal'; // Update with institution name
        console.log('Nombre de la institución cargado:', this.institutionName);
      },
      error: (err) => {
        console.error('Error al cargar el nombre de la institución:', err);
        this.institutionName = 'EduPortal'; // Fallback in case of error
      }
    });
  }

  darLike(noticia: Noticia): void {
    if (!this.isAuthenticated || !noticia.id || !this.mensaje.username) return;

    if (!noticia.likedBy) {
      noticia.likedBy = [];
    }

    const userIndex = noticia.likedBy.indexOf(this.mensaje.username);
    let optimisticLikesCount = noticia.likesCount || 0;

    if (userIndex === -1) {
      noticia.likedBy.push(this.mensaje.username);
      noticia.likesCount = optimisticLikesCount + 1;
    } else {
      noticia.likedBy.splice(userIndex, 1);
      noticia.likesCount = optimisticLikesCount - 1;
    }

    this.noticias = [...this.noticias];

    this.noticiaService.actualizarLikes(noticia.id, noticia.likedBy).subscribe({
      next: (updatedNoticia) => {
        noticia.likesCount = updatedNoticia.likesCount;
        noticia.likedBy = updatedNoticia.likedBy;
      },
      error: (error) => {
        console.error('Error al actualizar likes', error);
        if (userIndex === -1) {
          noticia.likedBy.splice(noticia.likedBy.indexOf(this.mensaje.username), 1);
          noticia.likesCount = optimisticLikesCount;
        } else {
          noticia.likedBy.push(this.mensaje.username);
          noticia.likesCount = optimisticLikesCount;
        }
        this.noticias = [...this.noticias];
      }
    });
  }

  hasLiked(noticia: Noticia): boolean {
    return this.isAuthenticated && noticia.likedBy?.includes(this.mensaje.username) || false;
  }

  toggleComments(noticiaId: string): void {
    this.showComments[noticiaId] = !this.showComments[noticiaId];
  }

  agregarComentario(noticia: Noticia): void {
    if (this.isAuthenticated && noticia.id && this.comentarioTexto[noticia.id]) {
      const comentario = {
        autor: this.mensaje.username,
        contenido: this.comentarioTexto[noticia.id],
        fechaCreacion: new Date()
      };

      if (!noticia.comentarios) {
        noticia.comentarios = [];
      }
      noticia.comentarios.push(comentario);

      const comentarioTextoTemp = this.comentarioTexto[noticia.id];
      this.comentarioTexto[noticia.id] = '';

      this.noticiaService.agregarComentario(noticia.id, comentario).subscribe({
        next: (updatedNoticia) => {
          noticia.comentarios = updatedNoticia.comentarios;
        },
        error: (error) => {
          console.error('Error al guardar comentario', error);
          noticia.comentarios = noticia.comentarios.filter(c => c !== comentario);
          this.comentarioTexto[noticia.id] = comentarioTextoTemp;
        }
      });
    }
  }

  mostrarEmojis(): void {
    if (this.conectado) {
      this.emojisVisible = !this.emojisVisible;
    }
  }

  toggleChat() {
    if (this.isAuthenticated) {
      this.chatVisible = !this.chatVisible;
    }
  }

  agregarEmoji(emoji: string): void {
    if (this.conectado) {
      this.mensaje.texto += emoji;
      this.emojisVisible = false;
    }
  }

  iniciarConexiónWebSocket(): void {
    this.client = new Client();
    this.client.webSocketFactory = () => {
      return new SockJS(`${environment.apiUrl}chat-websocket`);
    };

    this.client.onConnect = (frame) => {
      console.log('Conectados: ' + this.client.connected + ' : ' + frame);
      this.conectado = true;

      this.client.subscribe('/chat/mensaje', (e) => {
        let mensaje: Mensaje = JSON.parse(e.body) as Mensaje;
        mensaje.fecha = new Date(mensaje.fecha);
        if (
          !this.mensaje.color &&
          mensaje.tipo == 'NUEVO_USUARIO' &&
          this.mensaje.username == mensaje.username
        ) {
          this.mensaje.color = mensaje.color;
        }
        this.mensajes.push(mensaje);
        console.log(mensaje);
        if (this.scrollChat) {
          this.scrollChat.nativeElement.scrollTop = this.scrollChat.nativeElement.scrollHeight;
        }
      });

      this.client.subscribe('/chat/escribiendo', (e) => {
        this.escribiendo = e.body;
        setTimeout(() => (this.escribiendo = ''), 3000);
      });

      this.client.subscribe('/chat/historial/' + this.clienteId, (e) => {
        const historial = JSON.parse(e.body) as Mensaje[];
        this.mensajes = historial
          .map((m) => {
            m.fecha = new Date(m.fecha);
            return m;
          })
          .reverse();
      });

      this.client.publish({
        destination: '/app/historial',
        body: this.clienteId,
      });

      this.mensaje.tipo = 'NUEVO_USUARIO';
      this.client.publish({
        destination: '/app/mensaje',
        body: JSON.stringify(this.mensaje),
      });
    };

    this.client.onDisconnect = (frame) => {
      console.log('Desconectados: ' + !this.client.connected + ' : ' + frame);
      this.conectado = false;
      this.mensaje = new Mensaje();
      this.mensajes = [];
      this.isAuthenticated = false;
    };

    // Activate WebSocket connection if authenticated
    if (this.isAuthenticated && this.mensaje.username) {
      this.client.activate();
    }
  }

  conectar(): void {
    if (this.isAuthenticated && this.mensaje.username) {
      this.client.activate();
    }
  }

  desconectar(): void {
    this.client.deactivate();
    this.chatVisible = false;
  }

  enviarMensaje(): void {
    if (this.conectado && this.mensaje.texto) {
      this.mensaje.tipo = 'MENSAJE';
      this.client.publish({ destination: '/app/mensaje', body: JSON.stringify(this.mensaje) });
      this.mensaje.texto = '';
    }
  }

  escribiendoEvento(): void {
    if (this.conectado) {
      this.client.publish({ destination: '/app/escribiendo', body: this.mensaje.username });
    }
  }

  selectSection(section: string): void {
    this.selectedSection = section;
  }

  cargarNoticias(): void {
    const storedNoticias = localStorage.getItem('noticias');
    if (storedNoticias) {
      this.noticias = JSON.parse(storedNoticias);
      this.noticias.forEach(noticia => {
        noticia.fechaCreacion = new Date(noticia.fechaCreacion);
        this.cargarImagen(noticia);
        this.cargarVideo(noticia);
      });
    } else {
      this.noticiaService.obtenerNoticias().subscribe({
        next: (data: Noticia[]) => {
          this.noticias = data.sort((a, b) =>
            new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
          );
          this.noticias.forEach(noticia => {
            this.cargarImagen(noticia);
            this.cargarVideo(noticia);
          });
        },
        error: (error) => {
          console.error('Error al cargar noticias', error);
        }
      });
    }
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
          console.error('Error al cargar la imagen de la noticia', error);
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
          console.error('Error al cargar el video de la noticia', error);
          noticia.video = null;
        }
      });
    }
  }

  verNoticia(noticia: Noticia): void {
    this.dialog.open(ImagenDialogComponent, {
      data: {
        titulo: noticia.titulo,
        contenido: noticia.contenido,
        imagen: noticia.imagen,
        video: noticia.video,
        fechaCreacion: noticia.fechaCreacion
      },
      width: '600px',
      maxHeight: '90vh'
    });
  }

  mostrarImagen(noticia: Noticia): void {
    this.dialog.open(ImagenDialogComponent, {
      data: {
        titulo: noticia.titulo,
        contenido: noticia.contenido,
        imagen: noticia.imagen,
        video: noticia.video,
        fechaCreacion: noticia.fechaCreacion
      }
    });
  }
}
