import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { PrecioNivelEducativo, PreciosEducativosService } from 'src/app/services/servicios-escolares/PrecioNivelEducativo/precios-educativos.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-precios-niveleducativo',
  templateUrl: './precios-niveleducativo.component.html',
  styleUrls: ['./precios-niveleducativo.component.scss']
})
export class PreciosNiveleducativoComponent implements OnInit {

  precios: PrecioNivelEducativo[] = [];
  precioForm: FormGroup;
  selectedFile: File | null = null;
  isEditing: boolean = false;
  selectedPrecioId: string | null = null;
  apiBaseUrl = environment.apiUrl;
  imageUrls: { [key: string]: SafeUrl } = {};

  constructor(
    private preciosService: PreciosEducativosService,
    private fb: FormBuilder,
    private sanitizer: DomSanitizer
  ) {
    this.precioForm = this.fb.group({
      nivel: ['', [Validators.required]],
      concepto: ['', [Validators.required]],
      monto: [0, [Validators.required, Validators.min(0)]],
      descripcion: [''],
      periodicidad: [''],
      fechaInicio: [''],
      fechaFin: [''],
      descuento: [null],
      categoria: ['']
    });
  }

  ngOnInit(): void {
    this.loadPrecios();
  }

  loadPrecios(): void {
    this.preciosService.getAll().subscribe({
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
    fetch(`${this.apiBaseUrl}api/precios/imagen/${id}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    })
    .then(response => response.blob())
    .then(blob => {
      const objectUrl = URL.createObjectURL(blob);
      this.imageUrls[id] = this.sanitizer.bypassSecurityTrustUrl(objectUrl);
    })
    .catch(error => console.error('Error fetching image:', error));
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onSubmit(): void {
    if (this.precioForm.invalid) return;

    const precioData: PrecioNivelEducativo = this.precioForm.value;

    if (this.isEditing && this.selectedPrecioId) {
      this.preciosService.update(this.selectedPrecioId, precioData, this.selectedFile)
        .subscribe({
          next: () => {
            this.loadPrecios();
            this.resetForm();
          },
          error: (error) => console.error('Error updating precio:', error)
        });
    } else {
      this.preciosService.create(precioData, this.selectedFile)
        .subscribe({
          next: () => {
            this.loadPrecios();
            this.resetForm();
          },
          error: (error) => console.error('Error creating precio:', error)
        });
    }
  }

  editPrecio(precio: PrecioNivelEducativo): void {
    this.isEditing = true;
    this.selectedPrecioId = precio.id || null;
    this.precioForm.patchValue(precio);
    this.selectedFile = null;
  }

  deletePrecio(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar este precio?')) {
      this.preciosService.delete(id).subscribe({
        next: () => this.loadPrecios(),
        error: (error) => console.error('Error deleting precio:', error)
      });
    }
  }

  resetForm(): void {
    this.precioForm.reset({
      nivel: '', concepto: '', monto: 0, descripcion: '', periodicidad: '',
      fechaInicio: '', fechaFin: '', descuento: null, categoria: ''
    });
    this.selectedFile = null;
    this.isEditing = false;
    this.selectedPrecioId = null;
  }
}