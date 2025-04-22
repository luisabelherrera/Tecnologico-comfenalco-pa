import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { InformacionInstitucionalService, InformacionInstitucional } from 'src/app/services/servicios-escolares/InformacionInsittucional/informacion-institucional.service';

@Component({
  selector: 'app-sedes',
  templateUrl: './sedes.component.html',
  styleUrls: ['./sedes.component.scss']
})
export class SedesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  isMobileMenuOpen = false;
  selectedSection = 'sedes'; // Set to 'sedes' to highlight the active navigation link
  institutionName: string = 'EduPortal'; // Property to hold institution name

  constructor(
    public router: Router,
    private informacionService: InformacionInstitucionalService // Inject the service
  ) {}

  ngOnInit(): void {
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

  getCurrentYear(): number {
    return new Date().getFullYear();
  }

  // Navigation methods for consistency with other components
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
}
