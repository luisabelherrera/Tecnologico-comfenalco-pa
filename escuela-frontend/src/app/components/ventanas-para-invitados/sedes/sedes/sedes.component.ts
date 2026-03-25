import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import {
  InformacionInstitucionalService,
  InformacionInstitucional,
} from "src/app/services/servicios-escolares/InformacionInsittucional/informacion-institucional.service";

interface GalleryImage {
  src: string;
  caption: string;
}

@Component({
  selector: "app-sedes",
  templateUrl: "./sedes.component.html",
  styleUrls: ["./sedes.component.scss"],
})
export class SedesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  isMobileMenuOpen = false;
  selectedSection = "instalaciones";
  institutionName = "EduPortal";

  // Gallery properties
  showGallery = false;
  currentGalleryImage = "";
  currentGalleryCaption = "";
  currentImageIndex = 0;
  galleryImages: GalleryImage[] = [];

  // Gallery collections
  galleryCollections: { [key: string]: GalleryImage[] } = {
    aulas: [
      {
        src: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        caption: "Aula principal con iluminación natural",
      },
      {
        src: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        caption: "Aula moderna con herramientas digitales",
      },
      {
        src: "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        caption: "Aula de tecnología educativa",
      },
    ],
    biblioteca: [
      {
        src: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        caption: "Sala de lectura principal",
      },
      {
        src: "https://images.unsplash.com/photo-1532012197267-da84d127e765?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        caption: "Biblioteca escolar con espacios de estudio",
      },
      {
        src: "https://images.unsplash.com/photo-1568667256549-094345857637?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        caption: "Área de estudio individual",
      },
    ],
    laboratorio: [
      {
        src: "https://images.unsplash.com/photo-1581093588401-fbb62a02f120?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        caption: "Laboratorio de ciencias",
      },
      {
        src: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        caption: "Equipos de última generación",
      },
      {
        src: "https://images.unsplash.com/photo-1612278675351-4961dd65b50b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        caption: "Laboratorio escolar para experimentos",
      },
    ],
    deportes: [
      {
        src: "https://images.unsplash.com/photo-1577741314755-048d8525d31e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        caption: "Cancha multideportiva",
      },
      {
        src: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        caption: "Área de juegos recreativos",
      },
      {
        src: "https://images.unsplash.com/photo-1551958219-acbc608c6377?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        caption: "Espacio para actividades físicas",
      },
    ],
    comedor: [
      {
        src: "https://images.unsplash.com/photo-1544427920-c49ccfb85579?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        caption: "Comedor principal",
      },
      {
        src: "https://images.unsplash.com/photo-1579208030886-c5a6f9e7e0c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        caption: "Cafetería escolar con estudiantes",
      },
      {
        src: "https://images.unsplash.com/photo-1567521464027-f127ff144326?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        caption: "Espacio para meriendas",
      },
    ],
    tecnologia: [
      {
        src: "https://images.unsplash.com/photo-1593642532973-d31b97d0e6b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        caption: "Sala de computación escolar",
      },
      {
        src: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        caption: "Laboratorio de robótica",
      },
      {
        src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80",
        caption: "Espacio de innovación digital",
      },
    ],
  };

  constructor(
    private router: Router,
    private informacionService: InformacionInstitucionalService
  ) {}

  ngOnInit(): void {
    this.loadInstitutionName();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadInstitutionName(): void {
    this.informacionService
      .getPublic()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (data: InformacionInstitucional) => {
          this.institutionName = data.nombreInstitucion || "EduPortal";
          console.log("Nombre de la institución cargado:", this.institutionName);
        },
        error: (err) => {
          console.error("Error al cargar el nombre de la institución:", err);
          this.institutionName = "EduPortal";
        },
      });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
    document.body.classList.toggle("mobile-menu-open", this.isMobileMenuOpen);
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
    this.router.navigate(["/login"]).then(() => this.smoothScrollToTop());
  }

  openGallery(galleryType: string): void {
    if (this.galleryCollections[galleryType]) {
      this.galleryImages = this.galleryCollections[galleryType];
      this.currentImageIndex = 0;
      this.currentGalleryImage = this.galleryImages[0].src;
      this.currentGalleryCaption = this.galleryImages[0].caption;
      this.showGallery = true;
      document.body.style.overflow = "hidden";
    }
  }

  closeGallery(): void {
    this.showGallery = false;
    document.body.style.overflow = "";
  }

  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.galleryImages.length;
    this.currentGalleryImage = this.galleryImages[this.currentImageIndex].src;
    this.currentGalleryCaption = this.galleryImages[this.currentImageIndex].caption;
  }

  prevImage(): void {
    this.currentImageIndex = (this.currentImageIndex - 1 + this.galleryImages.length) % this.galleryImages.length;
    this.currentGalleryImage = this.galleryImages[this.currentImageIndex].src;
    this.currentGalleryCaption = this.galleryImages[this.currentImageIndex].caption;
  }

  downloadBrochure(event: Event): void {
    event.preventDefault();
    alert("Descargando folleto informativo...");
  }
}