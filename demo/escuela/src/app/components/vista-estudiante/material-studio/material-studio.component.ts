import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Curricular } from 'src/app/models/entity/curricular.model';
import { Estudiante } from 'src/app/models/entity/Estudiante.interface';
import { CurricularService } from 'src/app/services/curricular/curricular.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable, forkJoin, map, catchError, of } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface Question {
  text: string;
  options: string[];
  correctAnswer: string;
}

interface StudyMaterial {
  title: string;
  content: string;
  activities: string[];
}

interface YouTubeVideo {
  title: string;
  videoId: string;
  thumbnail: string;
}

@Component({
  selector: 'app-material-studio',
  templateUrl: './material-studio.component.html',
  styleUrls: ['./material-studio.component.scss']
})
export class MaterialStudioComponent implements OnInit {
  curriculares: Curricular[] = [];
  selectedCurricular: Curricular | null = null;
  student: Estudiante = {
    idEstudiante: 1,
    nombres: 'Juan',
    apellidos: 'Pérez',
    fechaNacimiento: new Date('2010-05-15'), // Example: 15 years old in 2025
    activo: true
  };
  questions: Question[] = [];
  selectedQuestion: Question | null = null;
  userAnswer: string | null = null;
  studyMaterials: StudyMaterial[] = [];
  youtubeVideos: YouTubeVideo[] = [];
  isLoading = false;

  private geminiApiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent';

  constructor(
    private curricularService: CurricularService,
    private http: HttpClient,
    private snackBar: MatSnackBar,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadCurriculares();
  }

  loadCurriculares(): void {
    this.isLoading = true;
    this.curricularService.getCurriculares().subscribe(
      (data) => {
        this.curriculares = data;
        this.selectedCurricular = data[0] || null;
        if (this.selectedCurricular) {
          this.loadStudyContent();
        } else {
          this.showNotification('No se encontraron curriculares', 'Cerrar');
        }
        this.isLoading = false;
      },
      (error) => {
        this.isLoading = false;
        this.showNotification('Error al cargar los curriculares: ' + error.message, 'Cerrar');
      }
    );
  }

  onCurricularChange(curricular: Curricular): void {
    this.selectedCurricular = curricular;
    this.questions = [];
    this.studyMaterials = [];
    this.youtubeVideos = [];
    this.selectedQuestion = null;
    this.userAnswer = null;
    this.showNotification(`Curricular "${curricular.descripcion}" seleccionado`, 'Cerrar');
    this.loadStudyContent();
  }

  loadStudyContent(): void {
    if (!this.selectedCurricular || !this.student.fechaNacimiento) return;

    const age = this.calculateAge(this.student.fechaNacimiento);
    const subject = this.selectedCurricular.descripcion || 'General Subject';
    this.isLoading = true;

    forkJoin([
      this.generateQuestions(subject, age),
      this.generateStudyMaterials(subject, age),
      this.fetchYouTubeVideos(subject)
    ]).subscribe(
      ([questions, materials, videos]) => {
        this.questions = questions;
        this.studyMaterials = materials;
        this.youtubeVideos = videos;
        this.selectedQuestion = this.questions[0] || null;
        this.isLoading = false;
        if (questions.length === 0) {
          this.showNotification('No se generaron preguntas. Usando datos de respaldo.', 'Cerrar');
        }
        if (materials.length === 0) {
          this.showNotification('No se generaron materiales. Usando datos de respaldo.', 'Cerrar');
        }
      },
      (error) => {
        this.isLoading = false;
        this.showNotification('Error al cargar contenido de estudio: ' + error.message, 'Cerrar');
      }
    );
  }

  calculateAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }

  generateQuestions(subject: string, age: number): Observable<Question[]> {
    const prompt = `
Genera 5 preguntas de opción múltiple para un estudiante de ${age} años estudiando ${subject}. Cada pregunta debe tener 4 opciones y una respuesta correcta. Proporciona la respuesta en formato de texto plano con el siguiente formato para cada pregunta:

**Pregunta N**: [Texto de la pregunta]
a) [Opción 1]
b) [Opción 2]
c) [Opción 3]
d) [Opción 4]
**Respuesta correcta**: [Opción correcta]

Ejemplo:
**Pregunta 1**: ¿Cuál es la capital de Francia?
a) París
b) Londres
c) Madrid
d) Berlín
**Respuesta correcta**: París

No uses markdown code blocks (sin \`\`\`) y asegúrate de que el formato sea claro y consistente.
`;
    const geminiUrl = `${this.geminiApiUrl}?key=${environment.geminiApiKey}`;
    return this.http.post<any>(geminiUrl, {
      contents: [{ parts: [{ text: prompt }] }]
    }).pipe(
      map((response) => {
        try {
          console.log('Gemini API response (questions):', JSON.stringify(response, null, 2));
          if (!response.candidates || !response.candidates[0].content.parts[0].text) {
            throw new Error('Respuesta de API inválida o vacía');
          }
          const content = response.candidates[0].content.parts[0].text.trim();
          console.log('Raw content (questions):', content);
          return this.parseQuestionsFromText(content, subject);
        } catch (error) {
          console.error('Error processing Gemini API response for questions:', error);
          this.showNotification('Error al procesar las preguntas: ' + error.message, 'Cerrar');
          return this.getMockQuestions(subject);
        }
      }),
      catchError((error) => {
        console.error('Gemini API error (questions):', error);
        this.showNotification('Error al generar preguntas: ' + error.message, 'Cerrar');
        return of(this.getMockQuestions(subject));
      })
    );
  }

  generateStudyMaterials(subject: string, age: number): Observable<StudyMaterial[]> {
    const prompt = `
Genera materiales de estudio y actividades para un estudiante de ${age} años estudiando ${subject}. Incluye un título, contenido y una lista de actividades. Proporciona la respuesta en formato de texto plano con el siguiente formato:

**Título**: [Título del material]
**Contenido**: [Contenido del material]
**Actividades**:
- [Actividad 1]
- [Actividad 2]
- [Actividad 3]

Ejemplo:
**Título**: Introducción a las fracciones
**Contenido**: Las fracciones representan partes de un todo. Por ejemplo, 1/2 significa una de dos partes iguales.
**Actividades**:
- Resuelve 5 ejercicios de fracciones.
- Dibuja un pastel dividido en fracciones.
- Explica qué es una fracción a un compañero.

No uses markdown code blocks (sin \`\`\`) y asegúrate de que el formato sea claro y consistente. Genera al menos 2 materiales.
`;
    const geminiUrl = `${this.geminiApiUrl}?key=${environment.geminiApiKey}`;
    return this.http.post<any>(geminiUrl, {
      contents: [{ parts: [{ text: prompt }] }]
    }).pipe(
      map((response) => {
        try {
          console.log('Gemini API response (materials):', JSON.stringify(response, null, 2));
          if (!response.candidates || !response.candidates[0].content.parts[0].text) {
            throw new Error('Respuesta de API inválida o vacía');
          }
          const content = response.candidates[0].content.parts[0].text.trim();
          console.log('Raw content (materials):', content);
          return this.parseMaterialsFromText(content, subject);
        } catch (error) {
          console.error('Error processing Gemini API response for materials:', error);
          this.showNotification('Error al procesar los materiales: ' + error.message, 'Cerrar');
          return this.getMockMaterials(subject);
        }
      }),
      catchError((error) => {
        console.error('Gemini API error (materials):', error);
        this.showNotification('Error al generar materiales: ' + error.message, 'Cerrar');
        return of(this.getMockMaterials(subject));
      })
    );
  }

  parseQuestionsFromText(text: string, subject: string): Question[] {
    const questions: Question[] = [];
    const sections = text.split('**Pregunta').filter(section => section.trim());

    for (const section of sections) {
      const lines = section.split('\n').filter(line => line.trim());
      if (lines.length < 6) continue; // Expect question, 4 options, and correct answer

      const question: Partial<Question> = {};
      question.text = lines[0].replace(/^\d+:/, '').trim();
      question.options = lines.slice(1, 5).map(line => line.replace(/^[a-d]\)/, '').trim());
      question.correctAnswer = lines[5].replace('**Respuesta correcta**:', '').trim();

      if (question.text && question.options.length === 4 && question.correctAnswer) {
        questions.push(question as Question);
      }
    }

    return questions.length > 0 ? questions : this.getMockQuestions(subject);
  }

  parseMaterialsFromText(text: string, subject: string): StudyMaterial[] {
    const materials: StudyMaterial[] = [];
    const sections = text.split('**Título**:').filter(section => section.trim());

    for (const section of sections) {
      const lines = section.split('\n').filter(line => line.trim());
      const material: Partial<StudyMaterial> = {};

      material.title = lines[0].trim();
      const contentIndex = lines.findIndex(line => line.startsWith('**Contenido**:'));
      const activitiesIndex = lines.findIndex(line => line.startsWith('**Actividades**:'));

      if (contentIndex !== -1 && activitiesIndex !== -1) {
        material.content = lines.slice(contentIndex, activitiesIndex)
          .filter(line => !line.startsWith('**Contenido**:'))
          .join(' ').trim();
        material.activities = lines.slice(activitiesIndex + 1)
          .filter(line => line.startsWith('-'))
          .map(line => line.replace(/^-/, '').trim());
      }

      if (material.title && material.content && material.activities?.length) {
        materials.push(material as StudyMaterial);
      }
    }

    return materials.length > 0 ? materials : this.getMockMaterials(subject);
  }

  fetchYouTubeVideos(subject: string): Observable<YouTubeVideo[]> {
    const url = `${environment.youtubeApiUrl}?part=snippet&q=${encodeURIComponent(subject + ' educational')}&type=video&maxResults=5&key=${environment.youtubeApiKey}`;
    return this.http.get<any>(url).pipe(
      map((response) => {
        console.log('YouTube API response:', response);
        return response.items.map((item: any) => ({
          title: item.snippet.title,
          videoId: item.id.videoId,
          thumbnail: item.snippet.thumbnails.default.url
        }));
      }),
      catchError((error) => {
        console.error('YouTube API error:', error);
        this.showNotification('Error al cargar videos: ' + error.message, 'Cerrar');
        return of([]);
      })
    );
  }

  getSafeVideoUrl(videoId: string): SafeResourceUrl {
    const url = `https://www.youtube.com/embed/${videoId}?rel=0`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  checkAnswer(): void {
    if (!this.selectedQuestion || !this.userAnswer) return;
    const isCorrect = this.userAnswer === this.selectedQuestion.correctAnswer;
    this.showNotification(
      isCorrect ? '¡Respuesta correcta!' : `Incorrecto. La respuesta correcta es: ${this.selectedQuestion.correctAnswer}`,
      'Cerrar'
    );
    const currentIndex = this.questions.indexOf(this.selectedQuestion);
    this.selectedQuestion = this.questions[currentIndex + 1] || this.questions[0];
    this.userAnswer = null;
  }

  showNotification(message: string, action: string): void {
    this.snackBar.open(message, action, { duration: 3000 });
  }

  private getMockQuestions(subject: string): Question[] {
    return [
      {
        text: `¿Qué es un concepto clave en ${subject}?`,
        options: ['Opción A', 'Opción B', 'Opción C', 'Opción D'],
        correctAnswer: 'Opción A'
      },
      {
        text: `¿Cuál es un ejemplo de ${subject}?`,
        options: ['Ejemplo 1', 'Ejemplo 2', 'Ejemplo 3', 'Ejemplo 4'],
        correctAnswer: 'Ejemplo 1'
      }
    ];
  }

  private getMockMaterials(subject: string): StudyMaterial[] {
    return [
      {
        title: `Introducción a ${subject}`,
        content: `Este material cubre los fundamentos de ${subject} para estudiantes.`,
        activities: [`Escribe un resumen sobre ${subject}`, `Crea un diagrama de conceptos de ${subject}`]
      }
    ];
  }
}
