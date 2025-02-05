import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Noticia } from 'src/app/models/entity/Noticia.interface';
import { NoticiaService } from 'src/app/services/Menu/Menu.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ImagenDialogComponent } from './dialogo/ImagenDialog.component';
import { AuthService } from 'src/app/services/auth/AuthService.service';
import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { Mensaje } from './models/mensaje';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  noticias: Noticia[] = [];
  selectedSection: string = 'noticias';
  userName$ = this.authService.userName$;
  private client: Client;
  emojisVisible: boolean = false;
  conectado: boolean = false;
  mensaje: Mensaje = new Mensaje();
  mensajes: Mensaje[] = [];
  escribiendo: string;
  clienteId: string = 'id-' + new Date().getTime() + '-' + Math.random().toString(36).substr(2);
  chatVisible: boolean = false;
  currentYear: number = new Date().getFullYear();
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

  constructor(
    private noticiaService: NoticiaService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.cargarNoticias();
    this.iniciarConexiónWebSocket();
  }

  mostrarEmojis(): void {
    this.emojisVisible = !this.emojisVisible;
  }
  toggleChat() {
    this.chatVisible = !this.chatVisible;
  }
  agregarEmoji(emoji: string): void {
    this.mensaje.texto += emoji;
    this.emojisVisible = false;
  }

  iniciarConexiónWebSocket(): void {
    this.userName$.subscribe((username) => {
      if (username) {
        this.mensaje.username = username; // Asigna el nombre de usuario autenticado al mensaje
      }
    });
  
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
    };
  }
  

  conectar(): void {
    this.client.activate();
  }

  desconectar(): void {
    this.client.deactivate();
  }

  enviarMensaje(): void {
    this.mensaje.tipo = 'MENSAJE';
    this.client.publish({ destination: '/app/mensaje', body: JSON.stringify(this.mensaje) });
    this.mensaje.texto = '';
  }

  escribiendoEvento(): void {
    this.client.publish({ destination: '/app/escribiendo', body: this.mensaje.username });
  }

  selectSection(section: string): void {
    this.selectedSection = section;
  }

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

  onMouseMove(event: MouseEvent) {
    const container = event.target as HTMLElement;
    const rect = container.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    this.rotationX = (y / rect.height - 0.5) * 30; // Rango de -15 a 15
    this.rotationY = (x / rect.width - 0.5) * 30;  // Rango de -15 a 15
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
}
