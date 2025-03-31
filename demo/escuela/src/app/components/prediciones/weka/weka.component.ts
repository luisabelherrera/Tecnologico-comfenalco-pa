import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog } from '@angular/material/dialog';
import { Estudiante } from 'src/app/models/entity/Estudiante.interface';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { StudentSelectionDialogComponent } from './dialogo/student-selection-dialog.component';

@Component({
  selector: 'app-weka',
  templateUrl: './weka.component.html',
  styleUrls: ['./weka.component.scss']
})
export class WekaComponent implements OnInit {
  studentForm: FormGroup;
  resultado: string = '';
  showForm: boolean = true;
  historial: any[] = [];
  filteredHistorial: any[] = [];
  paginatedHistorial: any[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalPages: number = 1;
  showChart: boolean = false;

  positiveCount: number = 0;
  negativeCount: number = 0;
  maxBarHeight: number = 200;

  filterResultado: string = '';
  filterDocumento: string = '';

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private dialog: MatDialog,
    private estudianteService: EstudianteService
  ) {
    this.studentForm = this.fb.group({
      documento: ['', [Validators.required, Validators.pattern('^[0-9]{7,10}$')]],
      edad: ['', [Validators.required, Validators.min(5)]],
      genero: ['', Validators.required],
      horasEstudioSemanal: ['', [Validators.required, Validators.min(0)]],
      asistencia: ['', [Validators.required, Validators.min(0), Validators.max(100)]],
      promedioParciales: ['', [Validators.required, Validators.min(0), Validators.max(5)]], // Ajustado a 0-5 como en ARFF
      participacionClases: ['', Validators.required],
      usoPlataformaVirtual: ['', Validators.required],
      antecedentesPerdida: ['', Validators.required],
      apoyoFamiliar: ['', Validators.required],        // Nuevo
      cargaAcademica: ['', [Validators.required, Validators.min(1), Validators.max(5)]], // Nuevo
      problemasPersonales: ['', Validators.required]   // Nuevo
    });
  }

  ngOnInit() {
    this.cargarHistorial();
  }

  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('accessToken');
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  openStudentSelectionDialog() {
    const dialogRef = this.dialog.open(StudentSelectionDialogComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe((result: Estudiante) => {
      if (result) {
        this.populateForm(result);
      }
    });
  }

  populateForm(estudiante: Estudiante) {
    const edad = this.calculateAge(estudiante.fechaNacimiento);
    this.studentForm.patchValue({
      documento: estudiante.documentoIdentidad,
      edad: edad,
      genero: estudiante.sexo === 'M' ? 'Masculino' : estudiante.sexo === 'F' ? 'Femenino' : 'Otro',
      horasEstudioSemanal: '',
      asistencia: '',
      promedioParciales: '',
      participacionClases: '',
      usoPlataformaVirtual: '',
      antecedentesPerdida: '',
      apoyoFamiliar: '',
      cargaAcademica: '',
      problemasPersonales: ''
    });
  }

  calculateAge(fechaNacimiento?: Date): number {
    if (!fechaNacimiento) return 0;
    const today = new Date();
    const birthDate = new Date(fechaNacimiento);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  enviarDatos() {
    if (this.studentForm.valid) {
      const datos = this.studentForm.value;
      console.log('Datos enviados al backend:', datos);
      const headers = this.getHeaders();

      this.http.post('http://localhost:9098/api/predecir', datos, { headers })
        .subscribe({
          next: (response: any) => {
            this.resultado = `Resultado: ${response.prediccion} (Confianza: ${response.confianza})`;
            this.cargarHistorial();
          },
          error: (err) => {
            console.error('Error completo:', err);
            this.resultado = `Error: ${err.status} - ${err.error?.error || 'Error desconocido'}`;
          }
        });
    } else {
      this.resultado = 'Formulario inválido. Revisa los campos.';
    }
  }

  toggleView(show: boolean) {
    this.showForm = show;
    this.resultado = '';
    if (!this.showForm) {
      this.cargarHistorial();
    }
  }

  toggleChartView() {
    this.showChart = !this.showChart;
    if (this.showChart) {
      this.updateChartData();
    } else {
      this.updatePaginatedHistorial();
    }
  }

  cargarHistorial() {
    const headers = this.getHeaders();
    this.http.get('http://localhost:9098/api/historial', { headers })
      .subscribe({
        next: (data: any) => {
          this.historial = data;
          console.log('Datos recibidos del backend:', this.historial);
          this.applyFilters();
        },
        error: (err) => {
          console.error('Error al cargar historial:', err);
          this.resultado = `Error al cargar historial: ${err.message}`;
        }
      });
  }

  applyFilters() {
    this.filteredHistorial = this.historial.filter(item => {
      const resultado = item.perderaAsignatura ? item.perderaAsignatura.toLowerCase().trim() : '';
      const matchesResultado = this.filterResultado === '' || resultado === this.filterResultado;
      const matchesDocumento = this.filterDocumento === '' || 
        (item.documento && item.documento.toString().toLowerCase().includes(this.filterDocumento.toLowerCase()));
      return matchesResultado && matchesDocumento;
    });

    console.log('Historial filtrado:', this.filteredHistorial);
    this.totalPages = Math.ceil(this.filteredHistorial.length / this.itemsPerPage);
    this.currentPage = 1;
    this.updatePaginatedHistorial();
    this.updateChartData();
  }

  updatePaginatedHistorial() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedHistorial = this.filteredHistorial.slice(start, end);
    console.log('Historial paginado:', this.paginatedHistorial);
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedHistorial();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedHistorial();
    }
  }

  updateChartData() {
    this.positiveCount = this.filteredHistorial.filter(item => 
      item.perderaAsignatura && item.perderaAsignatura.toLowerCase().trim() === 'tested_positive').length;
    this.negativeCount = this.filteredHistorial.filter(item => 
      item.perderaAsignatura && item.perderaAsignatura.toLowerCase().trim() === 'tested_negative').length;
    console.log(`Conteo para barras - Positive: ${this.positiveCount}, Negative: ${this.negativeCount}`);
  }

  getBarHeight(count: number): number {
    const total = this.positiveCount + this.negativeCount;
    return total > 0 ? (count / total) * this.maxBarHeight : 0;
  }

  onFilterResultadoChange(value: string) {
    this.filterResultado = value;
    console.log('Filtro resultado cambiado a:', this.filterResultado);
    this.applyFilters();
  }

  onFilterDocumentoChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.filterDocumento = input.value;
    console.log('Filtro documento cambiado a:', this.filterDocumento);
    this.applyFilters();
  }
}