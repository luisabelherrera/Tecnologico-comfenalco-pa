// src/app/components/recurso/recurso.component.ts
import { Component, OnInit } from '@angular/core';
import { ResponseFile, ResponseMessage } from 'src/app/models/entity/FileModel';
import { FileService } from 'src/app/services/recurso/recurso.service';

@Component({
  selector: 'app-recurso',
  templateUrl: './recurso.component.html',
  styleUrls: ['./recurso.component.scss']
})
export class RecursoComponent implements OnInit {
  files: ResponseFile[] = []; // Lista de archivos
  selectedFile!: File; // Archivo seleccionado para subir
  message: string = ''; // Mensaje de respuesta

  constructor(private fileService: FileService) {}

  ngOnInit(): void {
    this.getFiles(); // Obtener lista de archivos al iniciar
  }

  // Obtener archivos
  getFiles(): void {
    this.fileService.getFiles().subscribe(
      (data) => {
        this.files = data;
      },
      (error) => {
        console.error('Error al obtener archivos:', error);
      }
    );
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0]; // Obtener el archivo seleccionado
    if (file) {
      const validTypes = ['image/png', 'image/jpeg', 'application/pdf'];
      if (!validTypes.includes(file.type)) {
        this.message = 'Tipo de archivo no permitido. Por favor selecciona una imagen o un PDF.';
        this.selectedFile = null; // Restablecer el archivo seleccionado
        return;
      }
      this.selectedFile = file; // Asignar el archivo válido
    }
  }
  
  uploadFile(): void {
    if (this.selectedFile) {
        this.fileService.uploadFile(this.selectedFile).subscribe(
            (response: ResponseMessage) => {
                this.message = response.message;
                this.getFiles(); // Actualizar lista de archivos después de la carga
            },
            (error) => {
                console.error('Error al subir el archivo:', error);
                if (error.error instanceof ErrorEvent) {
                    // Errores de cliente
                    this.message = `Error del cliente: ${error.error.message}`;
                } else {
                    // Errores de servidor
                    this.message = `Error del servidor: ${error.status} ${error.message}`;
                }
            }
        );
    } else {
        this.message = 'Por favor, selecciona un archivo antes de subir.';
    }
}




downloadFile(file: ResponseFile): void {
  this.fileService.downloadFile(file.url).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name; // Usa el nombre del archivo real para descargar
      document.body.appendChild(a); // Asegúrate de agregar el elemento al DOM
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a); // Elimina el elemento después de la descarga
  }, (error) => {
      console.error('Error al descargar el archivo:', error);
  });
}
}