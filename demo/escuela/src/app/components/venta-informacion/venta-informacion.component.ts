import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Noticia } from 'src/app/models/entity/Noticia.interface';
import { AuthService } from 'src/app/services/auth/AuthService.service';
import { NoticiaService } from 'src/app/services/Menu/Menu.service';
import { ImagenDialogComponent } from '../home/dialogo/ImagenDialog.component';
import { InformacionInstitucionalService, InformacionInstitucional } from 'src/app/services/servicios-escolares/InformacionInsittucional/informacion-institucional.service';

interface FeatureCard {
  icon: string;
  emoji: string;
  title: string;
  description: string;
}

@Component({
  selector: 'app-venta-informacion',
  templateUrl: './venta-informacion.component.html',
  styleUrls: ['./venta-informacion.component.scss'],
})
export class VentaInformacionComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('newsTrack') newsTrack!: ElementRef;

  private destroy$ = new Subject<void>();

  noticias: Noticia[] = [];
  noticiasFiltradas: Noticia[] = [];
  selectedSection = 'noticias';
  isScrolled = false;
  isMobileMenuOpen = false;
  newsError: boolean = false;
  isAuthenticated: boolean = false;
  currentUserId: string | null = null;
  menuOpen = false;
  institutionName: string = 'EduPortal';
  isNavHidden = false;
  isMobileNavHidden = false;
  showBackToTop = false;

  // Formulario
  contactData = {
    name: '',
    email: '',
    subject: '',
    message: ''
  };
  formEnviado = false;

  featureCards: FeatureCard[] = [
    { icon: 'menu_book', emoji: '📋', title: 'Gestión Académica Eficiente', description: 'Centraliza matrículas, cursos y horarios en una plataforma intuitiva.' },
    { icon: 'schedule', emoji: '⏰', title: 'Optimización de Horarios', description: 'Organiza y asigna cursos de manera efectiva, ahorrando tiempo.' },
    { icon: 'chat', emoji: '💬', title: 'Mejor Comunicación', description: 'Facilita la interacción entre estudiantes y profesores con herramientas integradas.' }
  ];

  staticNews: Noticia[] = [
    {
      id: '1',
      titulo: 'Semana Cultural 2024',
      fechaCreacion: '2024-09-15',
      contenido: 'Disfruta de una semana llena de arte, música y tradición con presentaciones, concursos y mucho más.',
      imagen: 'assets/img/image1.png',
      action: 'Leer más',
      likedBy: []
    },
    {
      id: '2',
      titulo: 'Concurso de Lectura',
      fechaCreacion: '2024-10-01',
      contenido: 'Fomenta tu amor por la lectura participando en nuestro concurso anual. Premios y reconocimiento para los mejores.',
      imagen: 'assets/img/image2.png',
      action: 'Participa aquí',
      likedBy: []
    },
    {
      id: '3',
      titulo: 'Feria de Ciencias 2024',
      fechaCreacion: '2024-11-01',
      contenido: 'Explora los proyectos innovadores de nuestros estudiantes en tecnología, medio ambiente y ciencias aplicadas.',
      imagen: 'assets/img/image3.png',
      action: 'Ver detalles',
      likedBy: []
    }
  ];

  constructor(
    private noticiaService: NoticiaService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private authService: AuthService,
    public router: Router,
    private informacionService: InformacionInstitucionalService
  ) {}

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled = window.scrollY > 50;
    this.showBackToTop = window.scrollY > 200;
  }

  ngOnInit(): void {
    this.initializeAuthState();
    this.cargarNoticias();
    this.loadInstitutionName();
  }

  ngAfterViewInit(): void {
    console.log('AfterViewInit: Checking if sections are present');
    console.log('Features section:', document.querySelector('#features'));
    console.log('News section:', document.querySelector('#news'));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadInstitutionName() {
    this.informacionService.getPublic().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data: InformacionInstitucional) => {
        this.institutionName = data.nombreInstitucion || 'EduPortal';
        console.log('Nombre de la institución cargado:', this.institutionName);
      },
      error: (err) => {
        console.error('Error al cargar el nombre de la institución:', err);
        this.institutionName = 'EduPortal';
      }
    });
  }

  toggleDesktopNav() {
    this.isNavHidden = !this.isNavHidden;
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
  }

  toggleMobileNav() {
    this.isMobileNavHidden = !this.isMobileNavHidden;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
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

  cargarNoticias(): void {
    this.noticiaService.obtenerNoticias()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: Noticia[]) => {
          this.noticias = data.sort((a, b) =>
            new Date(b.fechaCreacion as string).getTime() - new Date(a.fechaCreacion as string).getTime()
          );
          this.noticiasFiltradas = this.noticias.filter(noticia => !noticia.video && !noticia.videoPath);
          this.noticiasFiltradas.forEach((noticia) => this.cargarImagen(noticia));
          this.newsError = false;
        },
        error: (error) => {
          console.error('Error al cargar noticias', error);
          this.newsError = true;
        }
      });
  }

  get newsItems(): Noticia[] {
    return this.newsError ? this.staticNews : this.noticiasFiltradas;
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
        error: (error) => console.error('Error al dar like', error)
      });
  }

  trackByFn(index: number, item: Noticia): string {
    return item.id || index.toString();
  }

  trackByFeatureCard(index: number, item: FeatureCard): string {
    return item.title;
  }

  handleImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/img/pexels-panditwiguna-3401403.jpg';
  }

  submitContactForm(): void {
    if (this.contactData.name && this.contactData.email && this.contactData.message) {
      const asunto = this.contactData.subject || 'Consulta desde el formulario de contacto';
      const cuerpo = `
Nombre: ${this.contactData.name}
Email: ${this.contactData.email}
Asunto: ${this.contactData.subject || 'No especificado'}

Mensaje: ${this.contactData.message}
      `;

      const mailtoLink = `mailto:info@hobocolegio.edu?subject=${encodeURIComponent(
        asunto
      )}&body=${encodeURIComponent(cuerpo)}`;

      window.location.href = mailtoLink;

      this.formEnviado = true;

      setTimeout(() => {
        this.contactData = {
          name: '',
          email: '',
          subject: '',
          message: ''
        };
        this.formEnviado = false;
      }, 3000);
    }
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  irAOtraVentana(): void {
    this.router.navigate(['/login']).then(() => this.smoothScrollToTop());
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
          error: (error) => console.error('Error al cargar la imagen de la noticia', error)
        });
    }
  }

  mostrarImagen(noticia: Noticia): void {
    this.dialog.open(ImagenDialogComponent, {
      data: { titulo: noticia.titulo, contenido: noticia.contenido, imagen: noticia.imagen, fechaCreacion: noticia.fechaCreacion }
    });
  }

  scrollToFeatures(): void {
    const featuresSection = document.querySelector('#features');
    if (featuresSection) {
      const headerHeight = document.querySelector('.header')?.getBoundingClientRect().height || 80;
      const offsetTop = featuresSection.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    } else {
      console.error('Features section not found.');
    }
  }

  scrollToNews(): void {
    const newsSection = document.querySelector('#news');
    if (newsSection) {
      const headerHeight = document.querySelector('.header')?.getBoundingClientRect().height || 80;
      const offsetTop = newsSection.getBoundingClientRect().top + window.scrollY - headerHeight;
      window.scrollTo({ top: offsetTop, behavior: 'smooth' });
    } else {
      console.error('News section not found.');
    }
  }

  formatDate(date: string | Date): string {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }


  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  accion3(): void {
    this.router.navigate(['/ventana-informacion-public']).then(() => this.smoothScrollToTop());
  }

  accion4(): void {
    this.router.navigate(['/consultar-precios']).then(() => this.smoothScrollToTop());
  }

  libro() {
    this.router.navigate(['/Explora']).then(() => this.smoothScrollToTop());
  }

  victor() {
    this.router.navigate(['/live2']).then(() => this.smoothScrollToTop());
  }

  accion1(): void {
    this.router.navigate(['/sedes']).then(() => this.smoothScrollToTop());
  }

  accion5() {}
  accion2() {}
}