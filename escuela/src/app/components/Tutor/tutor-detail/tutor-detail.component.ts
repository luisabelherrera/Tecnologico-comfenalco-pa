import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { tutor } from 'src/app/models/tutor.interface';


import { TutorService } from 'src/app/services/tutor/tutor.service';

@Component({
  selector: 'app-tutor-detail',
  templateUrl: './tutor-detail.component.html',
  styleUrls: ['./tutor-detail.component.css']
})
export class TutorDetailComponent implements OnInit {
  tutor: tutor | undefined;

  constructor(
    private tutorService: TutorService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.tutorService.getTutorById(+id).subscribe(data => {
        this.tutor = data;
      });
    }
  }



  exportToWord(): void {
    if (this.tutor) {
      const doc = document.createElement('a');
      doc.href = 'data:application/msword;base64,' + btoa(`
        <html>
          <head><title>Tutor Detail</title></head>
          <body>
            <h2>Detalle del Tutor</h2>
            <p><strong>Nombre:</strong> ${this.tutor.nombre}</p>
            <p><strong>Apellido:</strong> ${this.tutor.apellido}</p>
            <p><strong>Teléfono:</strong> ${this.tutor.telefono}</p>
            <p><strong>Email:</strong> ${this.tutor.email}</p>
          </body>
        </html>
      `);
      doc.download = 'tutor-detail.doc';
      doc.click();
    }
  }

  exportToExcel(): void {
    if (this.tutor) {
      const csvData = `Nombre,Apellido,Teléfono,Email\n${this.tutor.nombre},${this.tutor.apellido},${this.tutor.telefono},${this.tutor.email}`;
      const blob = new Blob([csvData], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'tutor-detail.csv';
      a.click();
      window.URL.revokeObjectURL(url);
    }
  }
}
