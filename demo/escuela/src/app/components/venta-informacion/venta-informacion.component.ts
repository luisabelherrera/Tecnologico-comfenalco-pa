import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { Router } from "@angular/router";
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Noticia } from "src/app/models/entity/Noticia.interface";
import { AuthService } from "src/app/services/auth/AuthService.service";
import { NoticiaService } from "src/app/services/Menu/Menu.service";
import { ImagenDialogComponent } from "../home/dialogo/ImagenDialog.component";
import { fadeInAnimation, fadeInStaggerAnimation, mobileMenuAnimation } from "./animations"; // Importa las animaciones

@Component({
  selector: "app-venta-informacion",
  templateUrl: "./venta-informacion.component.html",
  styleUrls: ["./venta-informacion.component.scss"],
  animations: [fadeInAnimation, fadeInStaggerAnimation, mobileMenuAnimation] // Vincula las animaciones
})
export class VentaInformacionComponent implements OnInit, OnDestroy {
  @ViewChild('newsTrack') newsTrack!: ElementRef;

  // State Management
  private destroy$ = new Subject<void>();

  noticias: Noticia[] = [];
  noticiasFiltradas: Noticia[] = [];
  selectedSection = "noticias";
  isScrolled = false;
  isMobileMenuOpen = false;
  newsError: boolean = false;
  isAuthenticated: boolean = false;
  currentUserId: string | null = null;
  menuOpen = false;
  featureCards = [
    { icon: "menu_book", emoji: "📚", title: "Educación Integral", description: "Programas adaptados al mundo actual." },
    { icon: "lightbulb", emoji: "💡", title: "Innovación y Tecnología", description: "Salones modernos y educación digital." },
    { icon: "public", emoji: "🌎", title: "Formación en Valores", description: "Preparamos a los estudiantes con principios sólidos." },
  ];

  staticNews = [
    { id: "1", titulo: "Semana Cultural 2024", fechaCreacion: "2024-09-15", subtitulo: "Del 15 al 20 de septiembre", contenido: "Disfruta de una semana llena de arte, música y tradición con presentaciones, concursos y mucho más.", imagen: "assets/img/IMG_2892-1536x2048.jpeg", action: "Leer más" },
    { id: "2", titulo: "Concurso de Lectura", fechaCreacion: "2024-10-01", subtitulo: "Inscripciones abiertas hasta el 10 de octubre", contenido: "Fomenta tu amor por la lectura participando en nuestro concurso anual. Premios y reconocimiento para los mejores.", imagen: "assets/img/dengue.jpg", action: "Participa aquí" },
    { id: "3", titulo: "Feria de Ciencias 2024", fechaCreacion: "2024-11-01", subtitulo: "Exhibición el 5 de noviembre", contenido: "Explora los proyectos innovadores de nuestros estudiantes en tecnología, medio ambiente y ciencias aplicadas.", imagen: "assets/img/Documento-A4-Portada-de-Ciencias-Infantil-Multicolor.png", action: "Ver detalles" },
  ];

  constructor(
    private noticiaService: NoticiaService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private authService: AuthService,
    public router: Router
  ) {}

  @HostListener("window:scroll", [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
  }

  ngOnInit(): void {
    this.initializeAuthState();
    this.cargarNoticias();
  }
  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initializeAuthState(): void {
    this.isAuthenticated = this.authService.isAuthenticated();
    this.currentUserId = this.authService.getCurrentUserId()?.toString() || null;
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe((auth) => {
        this.isAuthenticated = auth;
        this.currentUserId = this.authService.getCurrentUserId()?.toString() || null;
      });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  cargarNoticias(): void {
    this.noticiaService.obtenerNoticias()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Noticia[]) => {
          this.noticias = data.sort((a, b) => 
            new Date(b.fechaCreacion as string).getTime() - new Date(a.fechaCreacion as string).getTime());
          this.noticiasFiltradas = this.noticias.filter(noticia => !noticia.video && !noticia.videoPath);
          this.noticiasFiltradas.forEach((noticia) => this.cargarImagen(noticia));
          this.newsError = false;
        },
        error: (error) => {
          console.error("Error al cargar noticias", error);
          this.newsError = true;
        },
      });
  }

  scrollLeft(): void {
    if (this.newsTrack) {
      this.newsTrack.nativeElement.scrollBy({ left: -300, behavior: 'smooth' });
    }
  }

  scrollRight(): void {
    if (this.newsTrack) {
      this.newsTrack.nativeElement.scrollBy({ left: 300, behavior: 'smooth' });
    }
  }

  darLike(noticiaId: string): void {
    if (!this.isAuthenticated || !noticiaId) return;
    this.noticiaService.darLike(noticiaId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedNoticia) => {
          const noticia = this.noticiasFiltradas.find(n => n.id === noticiaId);
          if (noticia) {
            noticia.likedBy = updatedNoticia.likedBy;
          }
        },
        error: (error) => console.error("Error al dar like", error),
      });
  }

  trackByFn(index: number, item: any): string | number {
    return item.id || index;
  }

  handleImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/fallback-image.png'; // Asegúrate de que esta imagen exista
  }

  irAOtraVentana(): void {
    this.router.navigate(["/login"]).then(() => this.smoothScrollToTop());
  }

  smoothScrollToTop(): void {
    const scrollDuration = 1000;
    const scrollStep = -window.scrollY / (scrollDuration / 15);
    const scrollInterval = setInterval(() => {
      if (window.scrollY !== 0) window.scrollBy(0, scrollStep);
      else clearInterval(scrollInterval);
    }, 15);
  }

  cargarImagen(noticia: Noticia): void {
    if (noticia.id && !noticia.imagen) {
      this.noticiaService.obtenerImagenNoticia(noticia.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (blob) => {
            const objectURL = URL.createObjectURL(blob);
            noticia.imagen = this.sanitizer.bypassSecurityTrustUrl(objectURL);
          },
          error: (error) => console.error("Error al cargar la imagen de la noticia", error),
        });
    }
  }

  mostrarImagen(noticia: Noticia): void {
    this.dialog.open(ImagenDialogComponent, {
      data: { titulo: noticia.titulo, contenido: noticia.contenido, imagen: noticia.imagen, fechaCreacion: noticia.fechaCreacion },
    });
  }

  scrollToAbout(): void {
    document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' });
  }

  formatDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  accion4() { this.router.navigate(["/juego"]); }
  libro() { this.router.navigate(["/libros-api"]); }
  victor() { this.router.navigate(["/victor"]); }
  accion1() {}
  accion5() {}
  accion2() {}
  accion3() {}
}