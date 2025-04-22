import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/AuthService.service';
import { PrecioNivelEducativo, PreciosEducativosService } from 'src/app/services/servicios-escolares/PrecioNivelEducativo/precios-educativos.service';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { InformacionInstitucionalService, InformacionInstitucional } from 'src/app/services/servicios-escolares/InformacionInsittucional/informacion-institucional.service';

@Component({
  selector: 'app-consultar-precios',
  templateUrl: './consultar-precios.component.html',
  styleUrls: ['./consultar-precios.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        query('.card, .detail-card', [
          style({ opacity: 0, transform: 'translateY(50px)' }),
          stagger(100, [
            animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ]
})
export class ConsultarPreciosComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  selectedSection = 'noticias';
  isMobileMenuOpen = false;
  isScrolled = false;
  isMobileNavHidden = false;
  selectedPrecio: PrecioNivelEducativo | null = null;
  institutionName: string = 'EduPortal'; // Property to hold institution name

  precios: PrecioNivelEducativo[] = [];
  imageUrls: { [key: string]: SafeUrl } = {};

  constructor(
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private authService: AuthService,
    public router: Router,
    private preciosService: PreciosEducativosService,
    private informacionService: InformacionInstitucionalService // Inject the service
  ) { }

  ngOnInit(): void {
    this.loadPrecios();
    this.loadInstitutionName(); // Load the institution name
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Method to load the institution name
  loadInstitutionName() {
    this.informacionService.getPublic().pipe(takeUntil(this.destroy$)).subscribe({
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

  loadPrecios(): void {
    this.preciosService.getAllPublic().pipe(takeUntil(this.destroy$)).subscribe({
      next: (precios) => {
        this.precios = precios;
        this.loadImages();
      },
      error: (error) => console.error('Error loading precios:', error)
    });
  }

  loadImages(): void {
    this.precios.forEach(precio => {
      if (precio.id && precio.imagenPath) {
        this.fetchImage(precio.id);
      }
    });
  }

  fetchImage(id: string): void {
    this.preciosService.getImagePublic(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (blob) => {
        const objectUrl = URL.createObjectURL(blob);
        this.imageUrls[id] = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
      },
      error: (error) => console.error('Error fetching image:', error)
    });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    document.body.classList.toggle('mobile-menu-open', this.isMobileMenuOpen);
  }

  toggleMobileNav(): void {
    this.isMobileNavHidden = !this.isMobileNavHidden;
  }

  smoothScrollToTop(): void {
    const scrollDuration = 1000;
    const scrollStep = -window.scrollY / (scrollDuration / 15);
    const scrollInterval = setInterval(() => {
      if (window.scrollY !== 0) window.scrollBy(0, scrollStep);
      else clearInterval(scrollInterval);
    }, 15);
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

  accion1(): void {}
  accion5(): void {}
  accion2(): void {}

  irAOtraVentana(): void {
    this.router.navigate(['/login']).then(() => this.smoothScrollToTop());
  }

  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  getDiscountText(descuento: number | null): string {
    if (descuento === null) return '';
    else if (descuento >= 50) return '¡SÚPER OFERTA!';
    else if (descuento >= 25) return '¡GRAN DESCUENTO!';
    else if (descuento > 0) return 'Oferta Especial';
    else return '';
  }

  getDiscountColor(descuento: number | null): string {
    if (descuento === null) return 'transparent';
    else if (descuento >= 50) return '#ff4081'; // Pink
    else if (descuento >= 25) return '#00bcd4'; // Cyan
    else if (descuento > 0) return '#ffca28'; // Yellow
    else return 'transparent';
  }

  exploreOffer(precio: PrecioNivelEducativo): void {
    this.selectedPrecio = precio;
  }

  backToList(): void {
    this.selectedPrecio = null;
  }
}
