import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Docente } from 'src/app/models/entity/docente.model';
import { DocenteService } from 'src/app/services/Docente/Docente.service';
import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar'; // Importa MatSnackBar

@Component({
  selector: 'app-docente',
  templateUrl: './docente.component.html',
  styleUrls: ['./docente.component.scss']
})
export class DocenteComponent implements OnInit {
  docentes: Docente[] = [];
  displayedDocentes: Docente[] = [];
  selectedDocente: Docente | null = null;
  docenteForm: FormGroup;
  
  pageSize: number = 5; 
  pageIndex: number = 0; 
  filterValue: string = ''; 
  displayedColumns: string[] = ['codigo', 'nombres', 'apellidos', 'documentoIdentidad', 'fechaNacimiento', 'email', 'numeroTelefono', 'ciudad', 'activo', 'acciones'];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private docenteService: DocenteService, private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.docenteForm = this.fb.group({
      idDocente: [null],
      valorCodigo: [null],
      codigo: ['', Validators.required],
      documentoIdentidad: ['', Validators.required],
      nombres: ['', Validators.required],
      apellidos: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      sexo: [''],
      gradoEstudio: [''],
      ciudad: ['', Validators.required],
      direccion: [''],
      email: ['', [Validators.required, Validators.email]],
      numeroTelefono: [''],
      activo: [true],
      fechaRegistro: [new Date()],
      username: ['', Validators.required], 
      password: ['', Validators.required]   
    });
}


  ngOnInit(): void {
    this.loadDocentes();
  }

  loadDocentes() {
    this.docenteService.getAllDocentes().subscribe((data: Docente[]) => {
        console.log('Fetched docentes:', data);
        this.docentes = data;
        this.updateDisplayedDocentes();
    }, error => {
        console.error('Error fetching docentes:', error);
    });
  }

  updateDisplayedDocentes() {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    console.log('Start index:', startIndex, 'End index:', endIndex);
    this.displayedDocentes = this.docentes
        .filter(docente => this.filterDocente(docente))
        .slice(startIndex, endIndex);
    console.log('Displayed docentes:', this.displayedDocentes);
  }

  applyFilter(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    this.filterValue = input.value.toLowerCase();
    this.pageIndex = 0;
    this.updateDisplayedDocentes();
  }

  filterDocente(docente: Docente): boolean {
    console.log('Filtering docente:', docente, 'Filter value:', this.filterValue);
    return (
        (docente.nombres && docente.nombres.toLowerCase().includes(this.filterValue)) ||
        (docente.apellidos && docente.apellidos.toLowerCase().includes(this.filterValue)) ||
        (docente.codigo && docente.codigo.toLowerCase().includes(this.filterValue)) ||
        (docente.documentoIdentidad && docente.documentoIdentidad.toLowerCase().includes(this.filterValue)) ||
        (docente.ciudad && docente.ciudad.toLowerCase().includes(this.filterValue)) ||
        (docente.email && docente.email.toLowerCase().includes(this.filterValue))
    );
  }

  onSelect(docente: Docente) {
    this.selectedDocente = docente;
    this.docenteForm.patchValue(docente);
  }

  onSubmit() {
    if (this.selectedDocente) {
      this.docenteService.update(this.selectedDocente.idDocente, this.docenteForm.value).subscribe(() => {
        this.loadDocentes();
        this.resetForm();
        this.snackBar.open('Docente actualizado con éxito', 'Cerrar', { duration: 2000 }); 
      }, error => {
        this.snackBar.open(`No se pudo actualizar el docente: ${error}`, 'Cerrar', { duration: 5000 });  
      });
    } else {
      this.docenteService.create(this.docenteForm.value).subscribe(() => {
        this.loadDocentes();
        this.resetForm();
        this.snackBar.open('Docente creado con éxito', 'Cerrar', { duration: 2000 }); 
      }, error => {
        this.snackBar.open(`No se pudo crear el docente: ${error}`, 'Cerrar', { duration: 5000 }); 
      });
    }
  }

  onDelete(docente: Docente) {
    this.docenteService.delete(docente.idDocente).subscribe(() => {
        this.loadDocentes();
        this.resetForm();
        this.snackBar.open('Docente eliminado con éxito', 'Cerrar', { duration: 2000 });
    }, error => {
        this.snackBar.open(`No se pudo eliminar el docente: ${error}`, 'Cerrar', { duration: 5000 });
    });
  }

  onPageChange(event: PageEvent) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.updateDisplayedDocentes();
  }

  resetForm() {
    this.selectedDocente = null;
    this.docenteForm.reset({
      activo: true,
      fechaRegistro: new Date()
    });
  }
}
