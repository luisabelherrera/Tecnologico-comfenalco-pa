import { Component, OnInit } from '@angular/core';
import { InformacionInstitucional, InformacionInstitucionalService } from 'src/app/services/servicios-escolares/InformacionInsittucional/informacion-institucional.service';

@Component({
  selector: 'app-informacion-educativa',
  templateUrl: './informacion-educativa.component.html',
  styleUrls: ['./informacion-educativa.component.scss']
})
export class InformacionEducativaComponent implements OnInit {
  informacion: InformacionInstitucional | null = null;
  errorMessage: string | null = null;
  isLoading: boolean = false;
  isEditing: boolean = false;
  editedInfo: InformacionInstitucional = {
    nombreInstitucion: '',
    mision: '',
    vision: '',
    historia: '',
    valores: '',
    objetivos: '',
    contacto: '',
    manualConvivenciaPath: '',
    reglamentoInternoPath: '',
    logoPath: '',
    nivelesEducativos: '',
    enfasisInstitucional: '',
    preparacionIcfes: '',
    programasEspeciales: '',
    convenios: '',
    actividadesExtracurriculares: '',
    pastoralOCatequesis: '',
    planDeEstudiosPath: '',
    calendarioAcademicoPath: ''
  };

  constructor(private informacionService: InformacionInstitucionalService) {}

  ngOnInit(): void {
    this.loadInformacion();
  }

  // Cargar la única información
  loadInformacion(): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.informacionService.get().subscribe({
      next: (data) => {
        this.informacion = data;
        this.isLoading = false;
        console.log('Información cargada:', data);
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
        console.error('Error al cargar información:', err);
      }
    });
  }

  // Iniciar edición o creación
  startEditingOrCreating(): void {
    if (this.informacion) {
      this.editedInfo = { ...this.informacion }; // Clonar para edición
    } else {
      this.editedInfo = { ...this.editedInfo }; // Mantener valores iniciales para creación
    }
    this.isEditing = true;
  }

  // Guardar (crear o actualizar)
  saveInformacion(): void {
    this.isLoading = true;
    this.errorMessage = null;
    const request = this.informacion
      ? this.informacionService.update(this.editedInfo) // Actualizar si existe
      : this.informacionService.create(this.editedInfo); // Crear si no existe
    request.subscribe({
      next: (data) => {
        this.informacion = data;
        this.isLoading = false;
        this.isEditing = false;
        console.log('Información guardada:', data);
      },
      error: (err) => {
        this.errorMessage = err.message;
        this.isLoading = false;
        console.error('Error al guardar información:', err);
      }
    });
  }

  // Cancelar edición o creación
  cancelEditing(): void {
    this.isEditing = false;
    this.errorMessage = null;
  }
}