import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { InformacionInstitucional, InformacionInstitucionalService } from 'src/app/services/servicios-escolares/InformacionInsittucional/informacion-institucional.service';

@Component({
  selector: 'app-ventana-informacion-public',
  templateUrl: './ventana-informacion-public.component.html',
  styleUrls: ['./ventana-informacion-public.component.scss'],
  animations: [
    trigger('fadeIn', [
      transition('* => *', [
        style({ opacity: 0, transform: 'translateY(20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class VentanaInformacionPublicComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  informacion: InformacionInstitucional | null = null;
  institutionName: string = 'EduPortal'; // Property to hold institution name
  errorMessage: string | null = null;
  isLoading: boolean = false;
  isMobileMenuOpen: boolean = false;
  selectedSection = 'noticias';
  activeSection: string = 'mision'; // Sección activa por defecto

  constructor(
    private informacionService: InformacionInstitucionalService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadInformacion();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadInformacion(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.informacionService.getPublic().pipe(takeUntil(this.destroy$)).subscribe({
      next: (data) => {
        this.informacion = data;
        this.institutionName = data.nombreInstitucion || 'EduPortal'; // Set institution name
        this.isLoading = false;
        console.log('Información pública cargada:', data);
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.institutionName = 'EduPortal'; // Fallback in case of error
        this.isLoading = false;
        console.error('Error al cargar información pública:', err);
      }
    });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    if (this.isMobileMenuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }
  }

  smoothScrollToTop(): void {
    const scrollDuration = 1000;
    const scrollStep = -window.scrollY / (scrollDuration / 15);
    const scrollInterval = setInterval(() => {
      if (window.scrollY !== 0) window.scrollBy(0, scrollStep);
      else clearInterval(scrollInterval);
    }, 15);
  }

  scrollToAbout(): void {
    this.router.navigate(['/ventana-informacion-public']).then(() => {
      const aboutSection = document.querySelector('#about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

  accion3(): void {
    this.router.navigate(['/ventana-informacion-public']).then(() => this.smoothScrollToTop());
  }

  accion4(): void {
    this.router.navigate(['/consultar-precios']).then(() => this.smoothScrollToTop());
  }

  libro(): void {
    this.router.navigate(['/libros-api']).then(() => this.smoothScrollToTop());
  }

  victor(): void {
    this.router.navigate(['/victor']).then(() => this.smoothScrollToTop());
  }

  accion1(): void {
    this.router.navigate(['/sedes']).then(() => this.smoothScrollToTop());
  }

  accion5(): void {}
  accion2(): void {}

  irAOtraVentana(): void {
    this.router.navigate(['/login']).then(() => this.smoothScrollToTop());
  }

  setActiveSection(section: string): void {
    this.activeSection = section;
  }
}
