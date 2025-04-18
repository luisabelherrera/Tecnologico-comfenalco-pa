import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/AuthService.service';
import { PrecioNivelEducativo, PreciosEducativosService } from 'src/app/services/servicios-escolares/PrecioNivelEducativo/precios-educativos.service';
import { trigger, transition, style, animate, stagger, query } from '@angular/animations';

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
export class ConsultarPreciosComponent implements OnInit {
  selectedSection = 'noticias';
  isMobileMenuOpen = false;
  isScrolled = false;
  isMobileNavHidden = false;
  selectedPrecio: PrecioNivelEducativo | null = null;

  precios: PrecioNivelEducativo[] = [];
  imageUrls: { [key: string]: SafeUrl } = {};

  constructor(
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private authService: AuthService,
    public router: Router,
    private preciosService: PreciosEducativosService
  ) { }

  ngOnInit(): void {
    this.loadPrecios();
  }

  loadPrecios(): void {
    this.preciosService.getAllPublic().subscribe({
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
    this.preciosService.getImagePublic(id).subscribe({
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

  libro(): void { this.router.navigate(['/libros-api']); }
  victor(): void { this.router.navigate(['/victor']); }
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
    else if (descuento >= 25) return '¡GRAN DESCUENTO!'; // Matches the screenshot
    else if (descuento > 0) return 'Oferta Especial';
    else return '';
  }

  getDiscountColor(descuento: number | null): string {
    if (descuento === null) return 'transparent';
    else if (descuento >= 50) return '#ff4081'; // Pink
    else if (descuento >= 25) return '#00bcd4'; // Cyan, matches the screenshot
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