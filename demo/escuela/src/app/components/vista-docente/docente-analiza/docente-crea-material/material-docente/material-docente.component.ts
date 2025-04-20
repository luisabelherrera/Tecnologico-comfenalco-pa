import { Component, OnInit, Inject, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Curricular } from 'src/app/models/entity/curricular.model';
import { CurricularService } from 'src/app/services/curricular/curricular.service';
import { Estudiante } from 'src/app/models/entity/Estudiante.interface';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

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

interface GenerateContentResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

interface YouTubeSearchResponse {
  items: Array<{
    id: { videoId: string };
    snippet: { title: string; description: string };
  }>;
}

interface Tema {
  nombre: string;
  contenido: string;
  id: string;
  videos?: string[];
}

@Component({
  selector: 'app-material-docente',
  templateUrl: './material-docente.component.html',
  styleUrls: ['./material-docente.component.scss'],
})
export class MaterialDocenteComponent implements OnInit {
  materialForm: FormGroup;
  isLoadingSuggestions = false;
  isLoadingReport = false;
  temas: Tema[] = [];
  temaSeleccionado: Tema | null = null;
  curriculares: Curricular[] = [];
  selectedCurricular: Curricular | null = null;
  isLoadingCurriculares = false;

  private fallbackVideos: { [key: string]: { url: string; description: string }[] } = {
    'Inglés Período 1': [
      {
        url: 'https://www.youtube.com/watch?v=36IBDpTRVNE',
        description: 'Phonics Song for Children | Alphabet Song | Letter Sounds | Patty Shukla - Enseña el alfabeto inglés con sonidos de letras.',
      },
      {
        url: 'https://www.youtube.com/watch?v=0N0jODwY9fk',
        description: 'Learn English for Kids – Hello, Goodbye, Please, Thank You - Cubre saludos básicos y presentaciones.',
      },
    ],
  };

  private apiKey = 'AIzaSyB9HNN9nYfHK07TlZiCjMG-qVXZ2u70Rxc';

  @ViewChild('materialContent') materialContent!: ElementRef;

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
    console.log('Estudiante seleccionado:', this.data.estudiantePrediccion.estudiante);
    this.loadCurriculares();
    if (this.data.curricularId) {
      this.loadCurricularById(this.data.curricularId);
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
      this.curriculares = [];
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
          console.error('Error al cargar curricular:', error);
          this.snackBar.open('Error al cargar la asignatura seleccionada.', 'Cerrar', { duration: 3000 });
        },
      });
    }
  }

  generateStudyMaterialSuggestions(): void {
    if (!this.selectedCurricular) {
      this.snackBar.open('Selecciona una asignatura antes de generar material.', 'Cerrar', { duration: 3000 });
      return;
    }

    this.isLoadingSuggestions = true;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.apiKey}`;

    const prompt = `
Eres un asistente académico para docentes en un colegio. Genera material de estudio en español para el estudiante ${
      this.data.estudiantePrediccion.estudiante.nombres
    } ${this.data.estudiantePrediccion.estudiante.apellidos}, 
que está cursando la asignatura "${this.selectedCurricular.descripcion}" correspondiente al nivel "${
      this.selectedCurricular.docenteNivelDetalleCurso?.nivelDetalleCurso.nivelDetalle.nivel.descripcionNivel ||
      this.selectedCurricular.descripcion
    }".

Este estudiante tiene una predicción académica de "${this.data.estudiantePrediccion.prediccion || 'desconocida'}", con una confianza de ${
      this.data.estudiantePrediccion.confianza ?? 'no disponible'
    }%. 
Su calificación actual es de ${this.data.estudiantePrediccion.nota ?? 'no disponible'} sobre 5.

Genera una lista de recursos personalizados para ayudarle a mejorar su rendimiento en la asignatura "${this.selectedCurricular.descripcion}":
- Propón 3 ejercicios prácticos numerados relacionados con los temas de la asignatura "${this.selectedCurricular.descripcion}".
  - Si la predicción indica bajo rendimiento o la confianza es menor a 70%, los ejercicios deben be introductorios y guiados.
  - Si la predicción indica buen rendimiento o la confianza es mayor o igual a 70%, los ejercicios pueden ser más desafiantes.
- Sugiere una lectura educativa relevante para la asignatura "${this.selectedCurricular.descripcion}", con una URL completa.
  - Ajusta la complejidad de la lectura según la predicción y confianza.
- Organiza el contenido en secciones con títulos claros, usando el formato "## Título de la sección".
- NO incluyas enlaces a videos de YouTube en esta respuesta.

Usa un tono amigable y motivador, como si hablaras con un estudiante de secundaria. Sé claro, educativo y personaliza las recomendaciones según la predicción y confianza del estudiante.
`;

    this.http.post(geminiUrl, { contents: [{ parts: [{ text: prompt }] }] }).subscribe({
      next: (response: any) => {
        let suggestions = response.candidates?.[0]?.content?.parts?.[0]?.text || 'No se pudieron generar sugerencias.';
        console.log('Material generado por Gemini:', suggestions);

        const youtubeUrl = `https://www.googleapis.com/youtube/v3/search`;
        const searchQuery =
          this.selectedCurricular.descripcion === 'Inglés Período 1'
            ? this.data.estudiantePrediccion.confianza && this.data.estudiantePrediccion.confianza >= 70
              ? 'english for kids vocabulary grammar'
              : 'english for kids alphabet greetings'
            : `${this.selectedCurricular.descripcion} educativo`;

        const youtubeParams = {
          key: this.apiKey,
          part: 'snippet',
          q: searchQuery,
          type: 'video',
          maxResults: '2',
          videoEmbeddable: 'true',
          safeSearch: 'strict',
        };

        this.http.get<YouTubeSearchResponse>(youtubeUrl, { params: youtubeParams }).subscribe({
          next: (youtubeResponse) => {
            const videos = youtubeResponse.items
              .map((item) => ({
                url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
                description: `${item.snippet.title} - ${item.snippet.description.slice(0, 100)}...`,
              }))
              .filter((video) => this.isValidVideoUrl(video.url));

            console.log('Videos obtenidos de YouTube:', videos);

            let videoSection = `## Videos sugeridos\n`;
            if (videos.length >= 2) {
              videoSection += videos
                .slice(0, 2)
                .map((video, index) => `${index + 1}. ${video.url} - ${video.description}`)
                .join('\n');
            } else {
              const fallback = this.fallbackVideos[this.selectedCurricular?.descripcion || ''] || [];
              videoSection += fallback
                .slice(0, 2)
                .map((video, index) => `${index + 1}. ${video.url} - ${video.description}`)
                .join('\n');
              console.log('Usando videos de respaldo:', fallback);
            }

            suggestions = suggestions.replace(/## Videos sugeridos\n([\s\S]*?)(##|$)/, '') + '\n' + videoSection;
            this.materialForm.patchValue({ material: suggestions });
            this.clasificarTemas(suggestions);
            this.isLoadingSuggestions = false;
            this.snackBar.open('Sugerencias y videos generados con éxito.', 'Cerrar', { duration: 3000 });
          },
          error: (youtubeError) => {
            console.error('Error al buscar videos en YouTube:', youtubeError);
            const fallback = this.fallbackVideos[this.selectedCurricular?.descripcion || ''] || [];
            const videoSection = `## Videos sugeridos\n${fallback
              .slice(0, 2)
              .map((video, index) => `${index + 1}. ${video.url} - ${video.description}`)
              .join('\n')}`;
            suggestions = suggestions.replace(/## Videos sugeridos\n([\s\S]*?)(##|$)/, '') + '\n' + videoSection;
            this.materialForm.patchValue({ material: suggestions });
            this.clasificarTemas(suggestions);
            this.isLoadingSuggestions = false;
            this.snackBar.open('Error al buscar videos, se usaron videos de respaldo.', 'Cerrar', { duration: 3000 });
          },
        });
      },
      error: (geminiError) => {
        console.error('Error al generar sugerencias con Gemini:', geminiError);
        if (this.selectedCurricular?.descripcion === 'Inglés Período 1') {
          const fallbackMaterial = `
## Conceptos básicos
¡Hola ${this.data.estudiantePrediccion.estudiante.nombres} ${this.data.estudiantePrediccion.estudiante.apellidos}! Vamos a trabajar juntos para mejorar en Inglés Período 1. Con práctica, ¡verás grandes resultados!

## Videos sugeridos
1. https://www.youtube.com/watch?v=36IBDpTRVNE - Phonics Song for Children | Alphabet Song | Letter Sounds | Patty Shukla - Enseña el alfabeto inglés con sonidos de letras.
2. https://www.youtube.com/watch?v=0N0jODwY9fk - Learn English for Kids – Hello, Goodbye, Please, Thank You - Cubre saludos básicos y presentaciones.

## Ejercicios recomendados
1. Escribe el alfabeto inglés (A-Z) en mayúsculas y minúsculas. Luego, elige 5 letras y escribe una palabra en inglés para cada una (ejemplo: A - Apple).
2. Practica diciendo en voz alta: "Hello", "Good morning", "Goodbye", "My name is ${this.data.estudiantePrediccion.estudiante.nombres}". Grábate y escucha tu pronunciación.
3. Escribe 3 oraciones sobre ti en inglés, como: "My name is ${this.data.estudiantePrediccion.estudiante.nombres}.", "I am a student.", "I like soccer."

## Lectura recomendada
- https://www.oxfordowl.co.uk/for-home/find-a-book/library-page/ - Regístrate gratis y elige un cuento sencillo como "The Magic Paintbrush" para practicar lectura en inglés.
            `;
          this.materialForm.patchValue({ material: fallbackMaterial });
          this.clasificarTemas(fallbackMaterial);
          console.log('Usando material de respaldo completo');
        } else {
          this.materialForm.patchValue({ material: 'Error al generar sugerencias. Intenta de nuevo.' });
        }
        this.isLoadingSuggestions = false;
        this.snackBar.open('Error al generar sugerencias.', 'Cerrar', { duration: 3000 });
      },
    });
  }

  generateEvaluativeReport(): void {
    if (!this.selectedCurricular) {
      this.snackBar.open('Selecciona una asignatura antes de generar el informe.', 'Cerrar', { duration: 3000 });
      return;
    }

    this.isLoadingReport = true;

    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${this.apiKey}`;

    const prompt = `
Eres un asistente académico experto en la generación de informes evaluativos para docentes en un colegio. Genera un informe evaluativo detallado en español para el estudiante ${
      this.data.estudiantePrediccion.estudiante.nombres
    } ${this.data.estudiantePrediccion.estudiante.apellidos}, que cursa la asignatura "${this.selectedCurricular.descripcion}" en el nivel "${
      this.selectedCurricular.docenteNivelDetalleCurso?.nivelDetalleCurso.nivelDetalle.nivel.descripcionNivel ||
      this.selectedCurricular.descripcion
    }". El informe debe tener un mínimo de 7 páginas de contenido (aproximadamente 2500-3000 palabras en fuente Arial 12, espaciado sencillo, en papel A4) y estar estructurado en secciones claras con títulos en formato "## Título de la Sección".

**Datos del estudiante:**
- Predicción académica: "${this.data.estudiantePrediccion.prediccion || 'desconocida'}"
- Confianza de la predicción: ${this.data.estudiantePrediccion.confianza ?? 'no disponible'}%
- Calificación actual: ${this.data.estudiantePrediccion.nota ?? 'no disponible'} sobre 5

**Requisitos del informe:**
1. **Introducción (1 página)**: Presenta el propósito del informe, el contexto académico (asignatura, nivel), y un resumen del perfil del estudiante, incluyendo su nombre, predicción académica, confianza, y calificación actual. Usa un tono profesional pero accesible.
2. **Perfil del Estudiante (1 página)**: Describe al estudiante (edad, género, nivel educativo, intereses si se infieren del contexto) y su situación académica actual en la asignatura. Menciona fortalezas y áreas de oportunidad basadas en la predicción y confianza.
3. **Análisis de Desempeño (2 páginas)**: Evalúa el rendimiento del estudiante en la asignatura:
   - Si la predicción indica bajo rendimiento o confianza < 70%, detalla dificultades específicas (ejemplo: problemas con vocabulario básico en Inglés Período 1).
   - Si la predicción indica buen rendimiento o confianza ≥ 70%, destaca logros y áreas para desafíos avanzados (ejemplo: capacidad para formar oraciones complejas).
   - Incluye ejemplos concretos relacionados con la asignatura y compara el desempeño con los objetivos del curso.
4. **Desafíos Identificados (1 página)**: Identifica barreras específicas que afectan el rendimiento (ejemplo: falta de práctica, dificultades de comprensión, o factores externos como asistencia). Personaliza según la predicción y confianza.
5. **Recomendaciones para la Mejora (2 páginas)**: Propón un plan detallado para mejorar el rendimiento:
   - Incluye al menos 5 estrategias específicas (ejemplo: ejercicios guiados, lecturas complementarias, tutorías).
   - Sugiere 3 recursos educativos (lecturas, sitios web, no videos) con URLs completas, ajustados al nivel de rendimiento.
   - Propón un cronograma de actividades semanales para las próximas 4 semanas.
   - Ajusta la complejidad según la predicción: estrategias introductorias para bajo rendimiento, avanzadas para buen rendimiento.
6. **Conclusión (0.5-1 página)**: Resume los puntos clave, enfatiza la importancia de seguir las recomendaciones, y motiva al estudiante y docente a trabajar juntos para el éxito.
7. **Anexos (opcional, 0.5 página)**: Incluye una lista de recursos adicionales o herramientas recomendadas (sin videos).

**Instrucciones adicionales:**
- Usa un tono profesional, motivador y claro, dirigido a docentes y padres, pero comprensible para un estudiante de secundaria.
- Organiza el contenido con subtítulos claros (### Subsección) dentro de cada sección para mayor claridad.
- Asegúrate de que el informe sea extenso (2500-3000 palabras) para cumplir con el requisito de 7 páginas.
- NO incluyas enlaces a videos de YouTube, ya que se manejan por separado.
- Personaliza el contenido según la predicción, confianza y calificación del estudiante, asegurando que las recomendaciones sean relevantes para la asignatura "${this.selectedCurricular.descripcion}".

**Formato:**
- Usa markdown para estructurar el informe.
- Incluye un título principal con "# Informe Evaluativo" seguido del nombre del estudiante y la asignatura.
- Numera las páginas en el texto (ejemplo: "Página 1 de 7") for reference.
`;

    this.http.post(geminiUrl, { contents: [{ parts: [{ text: prompt }] }] }).subscribe({
      next: (response: any) => {
        let report = response.candidates?.[0]?.content?.parts?.[0]?.text || 'No se pudo generar el informe.';
        console.log('Informe generado por Gemini:', report);

        this.materialForm.patchValue({ material: report });
        this.clasificarTemas(report);
        this.isLoadingReport = false;
        this.snackBar.open('Informe evaluativo generado con éxito.', 'Cerrar', { duration: 3000 });
      },
      error: (error) => {
        console.error('Error al generar el informe con Gemini:', error);
        this.materialForm.patchValue({ material: 'Error al generar el informe. Intenta de nuevo.' });
        this.isLoadingReport = false;
        this.snackBar.open('Error al generar el informe.', 'Cerrar', { duration: 3000 });
      },
    });
  }

  clasificarTemas(material: string): void {
    this.temas = [];
    const secciones = material.split('## ').filter((seccion) => seccion.trim());

    secciones.forEach((seccion, index) => {
      const lineas = seccion.split('\n');
      const nombre = lineas[0].trim();
      const contenido = seccion;
      const videos = Array.from(
        new Set(
          (seccion.match(/https:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)[^\s&)]+/g) || []).filter((url) =>
            this.isValidVideoUrl(url)
          )
        )
      ).slice(0, 2);
      console.log(`Videos extraídos para ${nombre}:`, videos);

      this.temas.push({
        nombre,
        contenido,
        id: `tema-${index}`,
        videos,
      });
    });

    this.temaSeleccionado = this.temas.length > 0
      ? this.temas.find((t) => t.nombre.toLowerCase().includes('videos')) || this.temas[0]
      : null;
  }

  seleccionarTema(tema: Tema): void {
    this.temaSeleccionado = tema;
    console.log('Tema seleccionado:', tema.nombre, 'Videos:', tema.videos);
    const elemento = document.getElementById(tema.id);
    if (elemento && this.materialContent) {
      this.materialContent.nativeElement.scrollTo({
        top: elemento.offsetTop,
        behavior: 'smooth',
      });
    }
  }

  enviarMaterial(): void {
    if (this.materialForm.valid) {
      console.log('Enviando material:', this.materialForm.value.material, 'a', this.data.estudiantePrediccion.estudiante);
      this.dialogRef.close({ material: this.materialForm.value.material, curricular: this.selectedCurricular });
    } else {
      this.snackBar.open('Por favor, completa el formulario correctamente.', 'Cerrar', { duration: 3000 });
    }
  }

  exportMaterial(): void {
    if (this.materialForm.valid) {
      const material = this.materialForm.value.material;
      const fileName = `Informe_${this.data.estudiantePrediccion.estudiante.nombres}_${this.selectedCurricular?.descripcion}.docx`;
      const blob = new Blob([material], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
      this.snackBar.open('Informe exportado con éxito.', 'Cerrar', { duration: 3000 });
    } else {
      this.snackBar.open('Por favor, genera un informe válido antes de exportar.', 'Cerrar', { duration: 3000 });
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  getVideoEmbedUrl(url: string): SafeResourceUrl {
    let videoId = '';
    const watchMatch = url.match(/v=([^&]+)/);
    const shortMatch = url.match(/youtu\.be\/([^?]+)/);
    const embedMatch = url.match(/embed\/([^?]+)/);
    const shortsMatch = url.match(/shorts\/([^?]+)/);

    if (watchMatch) videoId = watchMatch[1];
    else if (shortMatch) videoId = shortMatch[1];
    else if (embedMatch) videoId = embedMatch[1];
    else if (shortsMatch) videoId = shortsMatch[1];

    const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1` : '';
    console.log(`URL original: ${url}, Embed URL: ${embedUrl}`);
    return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
  }

  isValidVideoUrl(url: string): boolean {
    const videoId = url.match(/v=([^&]+)/)?.[1] || url.match(/youtu\.be\/([^?]+)/)?.[1] || url.match(/embed\/([^?]+)/)?.[1] || url.match(/shorts\/([^?]+)/)?.[1];
    return !!videoId && videoId.length === 11;
  }

  getIconForTema(nombre: string): string {
    const nombreLower = nombre.toLowerCase();
    if (nombreLower.includes('introducción') || nombreLower.includes('perfil')) return '📄';
    if (nombreLower.includes('análisis') || nombreLower.includes('desempeño')) return '📊';
    if (nombreLower.includes('desafíos')) return '⚠️';
    if (nombreLower.includes('recomendaciones') || nombreLower.includes('plan')) return '📋';
    if (nombreLower.includes('conclusión') || nombreLower.includes('anexos')) return '✅';
    return '🌟';
  }
}