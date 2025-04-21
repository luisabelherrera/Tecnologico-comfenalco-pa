
import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Curricular } from 'src/app/models/entity/curricular.model';
import { CurricularService } from 'src/app/services/curricular/curricular.service';
import { Estudiante } from 'src/app/models/entity/Estudiante.interface';
import { DesempenoEstudiante } from 'src/app/models/entity/desempeno-estudiante.model';
import { EncuestaEstudiante } from 'src/app/models/entity/EncuestaEstudiante.interface';
import { DomSanitizer } from '@angular/platform-browser';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { environment } from 'src/environments/environment';

interface EstudiantePrediccion {
  estudiante: Estudiante;
  prediccion?: string;
  confianza?: number;
  nota?: number;
  showConfidence?: boolean;
}

interface DialogData {
  estudiantePrediccion: EstudiantePrediccion;
  curriculares?: Curricular[];
  curricularId?: number;
}

interface Tema {
  nombre: string;
  contenido: string;
  id: string;
}

@Component({
  selector: 'app-material-docente',
  templateUrl: './material-docente.component.html',
  styleUrls: ['./material-docente.component.scss', './material-docente-print.scss'],
})
export class MaterialDocenteComponent implements OnInit {
  materialForm: FormGroup;
  isLoadingReport = false;
  temas: Tema[] = [];
  temaSeleccionado: Tema | null = null;
  curriculares: Curricular[] = [];
  selectedCurricular: Curricular | null = null;
  isLoadingCurriculares = false;
  today: Date = new Date();
  references: string = `
        <p>Hall, M., Frank, E., Holmes, G., Pfahringer, B., Reutemann, P., & Witten, I. H. (2009). The WEKA data mining software: An update. <i>SIGKDD Explorations Newsletter, 11</i>(1), 10–18. https://doi.org/10.1145/1656274.1656278</p>
        <p>Oxford University Press. (n.d.). Oxford Learner's Dictionaries. Retrieved from https://www.oxfordlearnersdictionaries.com</p>
        <p>Cambridge University Press. (n.d.). English Language Teaching. Retrieved from https://www.cambridge.org/elt</p>
      `;

  @ViewChild('reportContent') reportContent!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private curricularService: CurricularService,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<MaterialDocenteComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) {
    this.materialForm = this.fb.group({
      material: ['', Validators.required],
      curricular: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.loadCurriculares();
    if (this.data.curricularId) {
      this.loadCurricularById(this.data.curricularId);
    }
    this.validateStudentAge();
  }

  validateStudentAge(): void {
    const age = this.calculateAge(this.data.estudiantePrediccion.estudiante.fechaNacimiento);
    if (age < 10 || age > 20) {
      this.snackBar.open(`Advertencia: La edad del estudiante (${age} años) parece inusual para Bachillerato. Verifica la fecha de nacimiento.`, 'Cerrar', { duration: 5000 });
    }
  }

  loadCurriculares(): void {
    this.isLoadingCurriculares = true;
    if (this.data.curriculares && this.data.curriculares.length > 0) {
      this.curriculares = this.data.curriculares;
      this.isLoadingCurriculares = false;
      if (this.data.curricularId) {
        const preSelectedCurricular = this.curriculares.find(c => c.idCurricular === this.data.curricularId);
        if (preSelectedCurricular) {
          this.selectedCurricular = preSelectedCurricular;
          this.materialForm.patchValue({ curricular: preSelectedCurricular });
        }
      }
    } else {
      this.isLoadingCurriculares = false;
      this.snackBar.open('No se encontraron asignaturas asignadas al docente.', 'Cerrar', { duration: 5000 });
    }
  }

  loadCurricularById(id: number): void {
    if (!this.curriculares.some(c => c.idCurricular === id)) {
      this.curricularService.getCurricularById(id).subscribe({
        next: (curricular) => {
          this.curriculares.push(curricular);
          this.selectedCurricular = curricular;
          this.materialForm.patchValue({ curricular: curricular });
        },
        error: (error) => {
          this.snackBar.open('Error al cargar la asignatura seleccionada.', 'Cerrar', { duration: 3000 });
        },
      });
    }
  }

  generateEvaluativeReport(): void {
    if (!this.selectedCurricular) {
      this.snackBar.open('Selecciona una asignatura antes de generar el informe.', 'Cerrar', { duration: 3000 });
      return;
    }

    this.isLoadingReport = true;
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${environment.geminiApiKey}`;
    const estudiante = this.data.estudiantePrediccion.estudiante;
    const desempeno: DesempenoEstudiante | undefined = estudiante.desempeno;
    const encuesta: EncuestaEstudiante | undefined = estudiante.encuesta;

    const prompt = `
Eres un asistente académico experto en generar informes evaluativos para docentes en un colegio, siguiendo las normas APA 7. Genera un informe evaluativo detallado en español para el estudiante ${
      estudiante.nombres || 'Nombre no disponible'
    } ${estudiante.apellidos || ''}, que cursa la asignatura "${this.selectedCurricular.descripcion}" en el nivel "${
      this.selectedCurricular.docenteNivelDetalleCurso?.nivelDetalleCurso.nivelDetalle.nivel.descripcionNivel ||
      this.selectedCurricular.descripcion
    }". El informe debe tener exactamente 3 páginas de contenido (750-1000 palabras, Arial 12, doble espacio, márgenes de 1 pulgada, en papel A4), excluyendo portada y referencias, y estar estructurado en secciones claras con títulos en formato "## Título de la Sección". Usa markdown limpio y consistente, evitando énfasis innecesario (e.g., **texto** sin motivo), numeración manual (e.g., "4.2"), o saltos de página dentro del contenido. Coloca "Página X de 3" al final de cada página, sin repetir "INFORME EVALUATIVO" o números adicionales.

**Datos académicos del estudiante:**
- Predicción académica (Weka): "${this.data.estudiantePrediccion.prediccion || 'desconocida'}" (tested_positive indica riesgo de reprobar, tested_negative indica probabilidad de aprobar)
- Confianza de la predicción: ${(this.data.estudiantePrediccion.confianza !== undefined ? this.data.estudiantePrediccion.confianza * 100 : 'no disponible')}%
- Calificación actual: ${this.data.estudiantePrediccion.nota ?? 'no disponible'} sobre 5
- Horas de estudio semanal: ${desempeno?.horasEstudioSemanal ?? 'no disponible'} horas
- Asistencia: ${desempeno?.asistencia ?? 'no disponible'}%
- Promedio de parciales: ${desempeno?.promedioParciales ?? 'no disponible'} sobre 5
- Participación en clases: ${desempeno?.participacionClases ?? 'no disponible'}
- Uso de plataforma virtual: ${desempeno?.usoPlataformaVirtual ?? 'no disponible'}
- Antecedentes de pérdida de asignatura: ${desempeno?.antecedentesPerdida ?? 'no disponible'}
- Predicción de pérdida de asignatura: ${desempeno?.perderaAsignatura ?? 'no disponible'}

**Datos personales y socioeconómicos:**
- Documento: ${estudiante.documentoIdentidad ?? 'no disponible'}
- Edad: ${this.calculateAge(estudiante.fechaNacimiento) || 'no disponible'} años
- Género: ${estudiante.sexo === 'M' ? 'Masculino' : estudiante.sexo === 'F' ? 'Femenino' : 'No especificado'}
- Problemas personales: ${encuesta?.problemasPersonales ?? 'no disponible'}
- Apoyo familiar: ${encuesta?.apoyoFamiliar ?? 'no disponible'}
- Nivel de estrés: ${encuesta?.nivelEstres ?? 'no disponible'}
- Estrato socioeconómico: ${encuesta?.estrato ?? 'no disponible'}
- Acceso a internet: ${encuesta?.tieneAccesoInternet ? 'Sí' : 'No'}
- Posee computador: ${encuesta?.tieneComputador ? 'Sí' : 'No'}
- Vive con padres: ${encuesta?.viveConPadres ? 'Sí' : 'No'}
- Tiene trabajo: ${encuesta?.tieneTrabajo ? 'Sí' : 'No'}

**Análisis Weka:**
- **Metodología**: La predicción se realizó con un clasificador Weka (J48 decision tree, según Hall et al., 2009), entrenado con un conjunto de datos que incluye 13 atributos: documento, ID estudiante, edad, género, horas de estudio semanal, asistencia, promedio de parciales, participación en clases, uso de plataforma virtual, antecedentes de pérdida, apoyo familiar, carga académica, y problemas personales. La clase objetivo es "perderaAsignatura" (tested_positive o tested_negative).
- **Atributos utilizados**: ${[
    `Edad: ${this.calculateAge(estudiante.fechaNacimiento) || 'no disponible'} años`,
    `Género: ${estudiante.sexo === 'M' ? 'Masculino' : estudiante.sexo === 'F' ? 'Femenino' : 'No especificado'}`,
    `Horas de estudio: ${desempeno?.horasEstudioSemanal ?? 'no disponible'} horas`,
    `Asistencia: ${desempeno?.asistencia ?? 'no disponible'}%`,
    `Promedio de parciales: ${desempeno?.promedioParciales ?? 'no disponible'}/5`,
    `Participación: ${desempeno?.participacionClases ?? 'no disponible'}`,
    `Plataforma virtual: ${desempeno?.usoPlataformaVirtual ?? 'no disponible'}`,
    `Antecedentes: ${desempeno?.antecedentesPerdida ?? 'no disponible'}`,
    `Apoyo familiar: ${encuesta?.apoyoFamiliar ?? 'no disponible'}`,
    `Problemas personales: ${encuesta?.problemasPersonales ?? 'no disponible'}`,
  ].join('; ')}
- **Confianza**: La probabilidad de la predicción (${this.data.estudiantePrediccion.confianza !== undefined ? this.data.estudiantePrediccion.confianza * 100 : 'no disponible'}%) refleja la certeza del modelo basada en la distribución de probabilidades para la clase predicha.

**Requisitos del informe:**
1. **Introducción (0.5 página)**: Explica el propósito del informe, el contexto académico (asignatura, nivel), y un resumen del perfil del estudiante (nombre, predicción Weka, calificación, situación personal). Cita el análisis Weka (Hall et al., 2009). Termina con "Página 1 de 3".
2. **Perfil del Estudiante (0.5 página)**: Describe edad, género, nivel educativo, fortalezas (e.g., alta participación), y áreas de oportunidad (e.g., baja asistencia, problemas personales). Termina with "Página 1 de 3".
3. **Análisis de Desempeño (1 página)**: Evalúa el rendimiento en la asignatura:
   - Para 'tested_positive', asistencia < 60%, o promedio < 3.0, detalla dificultades específicas (e.g., fundamentos de programación en Informática).
   - Para 'tested_negative' o participación 'Alta', destaca logros y desafíos avanzados.
   - Integra factores Weka (e.g., horas de estudio, apoyo familiar) y ejemplos específicos.
   - Termina with "Página 2 de 3".
4. **Recomendaciones para la Mejora (0.75 página)**:
   - Propón exactamente 3 estrategias específicas (e.g., tutorías, ejercicios, manejo del estrés, evitando énfasis innecesario como "**estrés**").
   - Sugiere exactamente 2 recursos educativos (lecturas, sitios web, no videos) with citas APA (e.g., Oxford University Press, n.d.).
   - Incluye un cronograma de 2 semanas with 4 actividades (2 por semana), ajustado al tiempo disponible.
   - Adapta estrategias según Weka ('tested_positive' requiere apoyo básico, 'tested_negative' desafíos avanzados).
   - Considera limitaciones personales (e.g., sin internet, usar materiales impresos).
   - Usa subtítulo "### Recursos Educativos" para los recursos and "### Cronograma" for the schedule.
   - Termina with "Página 3 de 3".
5. **Conclusión (0.25 página)**: Resume puntos clave, enfatiza las recomendaciones, and motiva la colaboración entre estudiante, docente, y familia. Termina with "Página 3 de 3".

**Instrucciones adicionales:**
- Usa un tono profesional, motivador, y claro, dirigido a docentes y padres, comprensible para estudiantes de secundaria.
- Estructura with subtítulos "##" y "###" sin numeración manual (e.g., no "4.2"). Evita bold innecesario.
- Genera 750-1000 palabras, excluyendo portada y referencias.
- NO incluyas enlaces a YouTube or duplicar referencias.
- Usa markdown with título "# Informe Evaluativo" followed by sections and "Página X de 3" at the end of each page.
- Ensure all sections are complete, with no truncation.
`;

    this.http.post(geminiUrl, { contents: [{ parts: [{ text: prompt }] }] }).subscribe({
      next: (response: any) => {
        let report = response.candidates?.[0]?.content?.parts?.[0]?.text || 'No se pudo generar el informe.';
        this.materialForm.patchValue({ material: report });
        this.clasificarTemas(report);
        this.isLoadingReport = false;
        this.snackBar.open('Informe evaluativo generado con éxito.', 'Cerrar', { duration: 3000 });
      },
      error: (error) => {
        this.materialForm.patchValue({ material: 'Error al generar el informe. Intenta de nuevo.' });
        this.isLoadingReport = false;
        this.snackBar.open('Error al generar el informe.', 'Cerrar', { duration: 3000 });
      },
    });
  }

  parseMarkdown(content: string): string {
    let html = content
      // Headers
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      // Unordered lists
      .replace(/^\* (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.+<\/li>\n?)+/g, '<ul>$&</ul>')
      // Paragraphs and line breaks
      .replace(/\n\n(.+?)(?=\n\n|$)/g, '<p>$1</p>')
      .replace(/\n/g, '<br>')
      // Remove extra breaks after lists
      .replace(/<\/ul>\s*<br>/g, '</ul>');
    return html;
  }

  clasificarTemas(material: string): void {
    this.temas = [];
    const secciones = material.split('## ').filter((seccion) => seccion.trim());
    let pageCount = 0;
    secciones.forEach((seccion, index) => {
      const lineas = seccion.split('\n');
      const nombre = lineas[0].trim();
      let contenido = lineas.slice(1).join('\n').trim();
      // Remove "Página X de 3" from content and track page
      contenido = contenido.replace(/Página \d de \d/, () => {
        pageCount++;
        return '';
      });
      contenido = this.parseMarkdown(contenido);
      this.temas.push({ nombre, contenido, id: `tema-${index}` });
    });
    this.temaSeleccionado = this.temas.length > 0 ? this.temas[0] : null;
    // Validate expected sections
    const expectedSections = ['Introducción', 'Perfil del Estudiante', 'Análisis de Desempeño', 'Recomendaciones para la Mejora', 'Conclusión'];
    const missingSections = expectedSections.filter(section => !this.temas.some(tema => tema.nombre === section));
    if (missingSections.length > 0) {
      this.snackBar.open(`Advertencia: Faltan secciones: ${missingSections.join(', ')}. Revisa el informe generado.`, 'Cerrar', { duration: 5000 });
    }
  }

  enviarMaterial(): void {
    if (this.materialForm.valid) {
      this.dialogRef.close({ material: this.materialForm.value.material, curricular: this.selectedCurricular });
    } else {
      this.snackBar.open('Por favor, completa el formulario correctamente.', 'Cerrar', { duration: 3000 });
    }
  }

  exportAsPDF(): void {
    if (!this.materialForm.valid || !this.reportContent) {
      this.snackBar.open('Por favor, genera un informe válido antes de exportar.', 'Cerrar', { duration: 3000 });
      return;
    }

    const reportElement = this.reportContent.nativeElement;
    const fileName = `Informe_${this.data.estudiantePrediccion.estudiante.nombres || 'Estudiante'}_${this.selectedCurricular?.descripcion}.pdf`;

    reportElement.classList.add('print-mode');

    html2canvas(reportElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgWidth = 190; // 210mm - 2 * 10mm margins
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;

      let position = 0;

      pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 10, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save(fileName);
      this.snackBar.open('Informe exportado como PDF con éxito.', 'Cerrar', { duration: 3000 });
      reportElement.classList.remove('print-mode');
    }).catch((error) => {
      this.snackBar.open('Error al exportar el informe como PDF.', 'Cerrar', { duration: 3000 });
    });
  }

  exportAsWord(): void {
    if (!this.materialForm.valid) {
      this.snackBar.open('Por favor, genera un informe válido antes de exportar.', 'Cerrar', { duration: 3000 });
      return;
    }

    const content = this.materialForm.value.material;
    const htmlContent = this.parseMarkdown(content);
    const referencesHtml = this.references;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: Arial, sans-serif;
            font-size: 12pt;
            line-height: 2;
            margin: 25.4mm;
          }
          h1, h2, h3 {
            font-weight: bold;
          }
          h1 { font-size: 16pt; text-align: center; }
          h2 { font-size: 14pt; }
          h3 { font-size: 12pt; }
          .running-head {
            font-size: 10pt;
            text-transform: uppercase;
            position: absolute;
            top: 12.7mm;
            left: 25.4mm;
          }
          .page-number {
            font-size: 10pt;
            position: absolute;
            top: 12.7mm;
            right: 25.4mm;
          }
          .references p {
            text-indent: -36pt;
            margin-left: 36pt;
          }
          .cover-page {
            text-align: center;
            page-break-after: always;
          }
          .page-break { page-break-before: always; }
          ul { margin-left: 36pt; }
        </style>
      </head>
      <body>
        <!-- Cover Page -->
        <div class="cover-page">
          <div class="running-head">Running head: INFORME EVALUATIVO</div>
          <h1>Informe Evaluativo</h1>
          <h2>${this.data.estudiantePrediccion.estudiante.nombres || 'Estudiante'} ${this.data.estudiantePrediccion.estudiante.apellidos || ''}</h2>
          <h3>${this.selectedCurricular?.descripcion || ''}</h3>
          <p>Institución Educativa [Nombre]</p>
          <p>Fecha: ${this.today.toLocaleDateString('es-ES', { dateStyle: 'long' })}</p>
        </div>
        <!-- Report Content -->
        ${this.temas.map((tema, index) => `
          <div class="page-break"></div>
          <div class="running-head">INFORME EVALUATIVO</div>
          <div class="page-number">Página ${index + 1} de ${this.temas.length}</div>
          <h2>${tema.nombre}</h2>
          ${tema.contenido}
        `).join('')}
        <!-- References Page -->
        <div class="page-break"></div>
        <div class="running-head">INFORME EVALUATIVO</div>
        <div class="page-number">Página ${this.temas.length + 1} de ${this.temas.length + 1}</div>
        <h2>Referencias</h2>
        <div class="references">${referencesHtml}</div>
      </body>
      </html>
    `;

    const blob = new Blob([html], { type: 'application/msword' });
    const fileName = `Informe_${this.data.estudiantePrediccion.estudiante.nombres || 'Estudiante'}_${this.selectedCurricular?.descripcion}.doc`;
    saveAs(blob, fileName);
    this.snackBar.open('Informe exportado como Word con éxito.', 'Cerrar', { duration: 3000 });
  }

  closeDialog(): void {
    this.dialogRef.close();
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
}
