import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Client } from '@stomp/stompjs';
import * as SockJS from 'sockjs-client';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/services/auth/AuthService.service'; // Adjust path
import { NoticiaService } from 'src/app/services/Menu/Menu.service'; // Adjust path
import { Noticia } from 'src/app/models/entity/Noticia.interface'; // Adjust path
import { NotificacionService } from 'src/app/services/notificacion/NotificacionService';
import { Mensaje } from '../../home/models/mensaje';

@Component({
  selector: 'app-chat-gestion',
  templateUrl: './chat-gestion.component.html',
  styleUrls: ['./chat-gestion.component.scss']
})
export class ChatGestionComponent implements OnInit {
  private client: Client;
  conectado: boolean = false;
  mensaje: Mensaje = new Mensaje();
  mensajes: Mensaje[] = []; // WebSocket chat messages
  clienteId: string = 'id-' + new Date().getTime() + '-' + Math.random().toString(36).substr(2);
  isAuthenticated: boolean = false;
  noticias: Noticia[] = []; // News articles with comments
  notificaciones: any[] = []; // Notifications (optional)
  activeTab: 'chat' | 'comments' = 'chat';
  @ViewChild('scrollChat') scrollChat!: ElementRef;
  @ViewChild('scrollComments') scrollComments!: ElementRef;

  constructor(
    private authService: AuthService,
    private noticiaService: NoticiaService,
    private notificacionService: NotificacionService
  ) {}

  ngOnInit(): void {
    this.iniciarConexiónWebSocket();

    // Authentication status
    this.authService.isAuthenticated$.subscribe((authenticated) => {
      this.isAuthenticated = authenticated;
      if (authenticated) {
        this.conectar();
        this.cargarNoticias(); // Load news with comments
        this.cargarNotificaciones(); // Load notifications (optional)
      }
    });

    // Set username for messages
    this.authService.userName$.subscribe((username) => {
      if (username) {
        this.mensaje.username = username;
      }
    });
  }

  // WebSocket Chat Logic
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
        this.mensajes.push(mensaje);
        this.scrollToBottom('chat');
      });

      this.client.subscribe('/chat/historial/' + this.clienteId, (e) => {
        const historial = JSON.parse(e.body) as Mensaje[];
        this.mensajes = historial
          .map((m) => {
            m.fecha = new Date(m.fecha);
            return m;
          })
          .reverse();
        this.scrollToBottom('chat');
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
      this.mensajes = [];
    };
  }

  conectar(): void {
    if (this.isAuthenticated && this.mensaje.username) {
      this.client.activate();
    }
  }

  desconectar(): void {
    this.client.deactivate();
  }

  enviarMensaje(): void {
    if (this.conectado && this.mensaje.texto) {
      this.mensaje.tipo = 'MENSAJE';
      this.client.publish({ destination: '/app/mensaje', body: JSON.stringify(this.mensaje) });
      this.mensaje.texto = '';
    }
  }

  // News Comments Logic
  cargarNoticias(): void {
    this.noticiaService.obtenerNoticias().subscribe({
      next: (data: Noticia[]) => {
        this.noticias = data.sort((a, b) =>
          new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
        );
        this.scrollToBottom('comments');
      },
      error: (error) => {
        console.error('Error al cargar noticias', error);
      }
    });
  }

  agregarComentario(noticia: Noticia): void {
    if (this.isAuthenticated && noticia.id && this.mensaje.texto) {
      const comentario = {
        autor: this.mensaje.username,
        contenido: this.mensaje.texto,
        fechaCreacion: new Date()
      };

      noticia.comentarios = noticia.comentarios || [];
      noticia.comentarios.push(comentario);
      this.noticiaService.agregarComentario(noticia.id, comentario).subscribe({
        next: (updatedNoticia) => {
          noticia.comentarios = updatedNoticia.comentarios;
          this.scrollToBottom('comments');
        },
        error: (error) => {
          console.error('Error al guardar comentario', error);
          noticia.comentarios = noticia.comentarios.filter(c => c !== comentario);
        }
      });
      this.mensaje.texto = ''; // Clear input after sending
    }
  }

  // Notifications Logic (Optional)
  cargarNotificaciones(): void {
    this.notificacionService.obtenerNotificaciones().subscribe({
      next: (data) => {
        this.notificaciones = data;
      },
      error: (error) => {
        console.error('Error al cargar notificaciones', error);
      }
    });
  }

  scrollToBottom(section: 'chat' | 'comments'): void {
    if (section === 'chat' && this.scrollChat) {
      this.scrollChat.nativeElement.scrollTop = this.scrollChat.nativeElement.scrollHeight;
    } else if (section === 'comments' && this.scrollComments) {
      // Note: Since we have multiple comment sections, this scrolls the last one.
      // You might want to adjust this based on which noticia is being commented on.
      this.scrollComments.nativeElement.scrollTop = this.scrollComments.nativeElement.scrollHeight;
    }
  
  }
}