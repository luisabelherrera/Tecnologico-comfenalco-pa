import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/AuthService.service';
import {
  PrecioNivelEducativo,
  PreciosEducativosService,
} from 'src/app/services/servicios-escolares/PrecioNivelEducativo/precios-educativos.service';
import {
  InformacionInstitucionalService,
  InformacionInstitucional,
} from 'src/app/services/servicios-escolares/InformacionInsittucional/informacion-institucional.service';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';

@Component({
  selector: 'app-consultar-precios',
  templateUrl: './consultar-precios.component.html',
  styleUrls: ['./consultar-precios.component.scss'],
  animations: [
    trigger('cardAnimation', [
      transition(':enter', [
        query(
          '.card, .detail-card, .empty-state',
          [
            style({ opacity: 0, transform: 'translateY(50px)' }),
            stagger(100, [animate('500ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))]),
          ],
          { optional: true },
        ),
      ]),
    ]),
  ],
})
export class ConsultarPreciosComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  selectedSection = 'noticias';
  isMobileMenuOpen = false;
  isScrolled = false;
  isMobileNavHidden = false;
  selectedPrecio: PrecioNivelEducativo | null = null;
  institutionName = 'EduPortal';

  precios: PrecioNivelEducativo[] = [];
  filteredPrecios: PrecioNivelEducativo[] = [];
  imageUrls: { [key: string]: SafeUrl } = {};

  // Filtros
  searchTerm = '';
  selectedNivel = '';
  niveles: string[] = [];

  // Formulario
  formData = {
    nombre: '',
    email: '',
    telefono: '',
    mensaje: '',
  };
  formEnviado = false;

  constructor(
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private authService: AuthService,
    public router: Router,
    private preciosService: PreciosEducativosService,
    private informacionService: InformacionInstitucionalService,
  ) {}

  ngOnInit(): void {
    this.loadPrecios();
    this.loadInstitutionName();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadInstitutionName() {
    this.informacionService
      .getPublic()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: InformacionInstitucional) => {
          this.institutionName = data.nombreInstitucion || 'EduPortal';
          console.log('Nombre de la institución cargado:', this.institutionName);
        },
        error: (err) => {
          console.error('Error al cargar el nombre de la institución:', err);
          this.institutionName = 'EduPortal';
        },
      });
  }

  loadPrecios(): void {
    this.preciosService
      .getAllPublic()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (precios) => {
          this.precios = precios;
          this.filteredPrecios = [...precios];
          this.extractNiveles();
          this.loadImages();
        },
        error: (error) => console.error('Error loading precios:', error),
      });
  }

  extractNiveles(): void {
    this.niveles = [...new Set(this.precios.map((p) => p.nivel))];
  }

  loadImages(): void {
    this.precios.forEach((precio) => {
      if (precio.id && precio.imagenPath) {
        this.fetchImage(precio.id);
      }
    });
  }

  fetchImage(id: string): void {
    this.preciosService
      .getImagePublic(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (blob) => {
          const objectUrl = URL.createObjectURL(blob);
          this.imageUrls[id] = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
        },
        error: (error) => console.error('Error fetching image:', error),
      });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    document.body.classList.toggle('mobile-menu-open', this.isMobileMenuOpen);
  }

  smoothScrollToTop(): void {
    const scrollDuration = 1000;
    const scrollStep = -window.scrollY / (scrollDuration / 15);
    const scrollInterval = setInterval(() => {
      if (window.scrollY !== 0) window.scrollBy(0, scrollStep);
      else clearInterval(scrollInterval);
    }, 15);
  }

  irAOtraVentana(): void {
    this.router.navigate(['/login']).then(() => this.smoothScrollToTop());
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
    this.smoothScrollToTop();
  }

  backToList(): void {
    this.selectedPrecio = null;
  }

  formatPrice(price: number): string {
    return price.toLocaleString('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }

  applyFilters(): void {
    this.filteredPrecios = this.precios.filter((precio) => {
      const searchMatch =
        !this.searchTerm ||
        precio.concepto.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        precio.nivel.toLowerCase().includes(this.searchTerm.toLowerCase());

      const nivelMatch = !this.selectedNivel || precio.nivel === this.selectedNivel;

      return searchMatch && nivelMatch;
    });
  }

  resetFilters(): void {
    this.searchTerm = '';
    this.selectedNivel = '';
    this.filteredPrecios = [...this.precios];
  }

  enviarSolicitud(): void {
    if (this.selectedPrecio) {
      const asunto = `Solicitud de información: ${this.selectedPrecio.concepto}`;
      const cuerpo = `
Nombre: ${this.formData.nombre}
Email: ${this.formData.email}
Teléfono: ${this.formData.telefono}

Mensaje: ${this.formData.mensaje}

Información de la oferta solicitada:
- Nivel: ${this.selectedPrecio.nivel}
- Concepto: ${this.selectedPrecio.concepto}
- Precio: ${this.formatPrice(this.selectedPrecio.monto)}
- Periodicidad: ${this.selectedPrecio.periodicidad || 'No especificada'}
      `;

      const mailtoLink = `mailto:info@institucion.edu?subject=${encodeURIComponent(
        asunto,
      )}&body=${encodeURIComponent(cuerpo)}`;

      window.location.href = mailtoLink;

      this.formEnviado = true;

      setTimeout(() => {
        this.formData = {
          nombre: '',
          email: '',
          telefono: '',
          mensaje: '',
        };
        this.formEnviado = false;
      }, 3000);
    }
  }
}