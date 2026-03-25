import { Component } from '@angular/core';
import { ChatMessage } from './models-ia/chat-message.interface';
import { ChatHistoryService } from './services-ia/chat-history.service';
import { PlatformHandlerService } from './services-ia/platform-handler.service';
import { StudentHandlerService } from './services-ia/student-handler.service';
import { Router } from '@angular/router';
import { WekaService } from './WekaService/weka.service';
import { GeminiService } from './constants-ia/constants-ia';
import { PeriodoHandlerService } from './services-ia/periodo-handler.service';
import { EstudianteService } from 'src/app/services/estudiante/estudiante.service';
import { DocenteService } from 'src/app/services/Docente/Docente.service';
import { PeriodoService } from 'src/app/services/periodo/periodo.service';
import { Estudiante } from '../../models/entity/Estudiante.interface';
import { Docente } from '../../models/entity/docente.model';
import { Periodo } from '../../models/entity/Periodo.interface';

@Component({
  selector: 'app-icono-ia',
  templateUrl: './icono-ia.component.html',
  styleUrls: ['./icono-ia.component.scss'],
})
export class IconoIaComponent {
  userInput: string = '';
  responseText: string = 'Esperando comando...';
  isInStudentPlatform: boolean = false;
  recognition: any;
  isRecording: boolean = false;
  isInHoboPlatform: boolean = true;
  userRole: string = 'administrador';
  chatHistory: ChatMessage[] = [];
  isExpanded: boolean = false;

  constructor(
    private chatHistoryService: ChatHistoryService,
    private studentHandlerService: StudentHandlerService,
    private platformHandlerService: PlatformHandlerService,
    private wekaService: WekaService,
    private geminiService: GeminiService,
    private router: Router,
    private periodoHandlerService: PeriodoHandlerService,
    private estudianteService: EstudianteService,
    private docenteService: DocenteService,
    private periodoService: PeriodoService
  ) {
    this.chatHistory = this.chatHistoryService.getChatHistory();
    if ('webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition();
      this.recognition.lang = 'es-ES';
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 1;

      this.recognition.onend = () => {
        this.isRecording = false;
        console.log('Grabación finalizada.');
      };
    } else {
      console.warn('El reconocimiento de voz no está soportado en este navegador.');
      this.responseText = 'El reconocimiento de voz no está soportado.';
      this.chatHistoryService.addToChatHistory('ai', this.responseText);
    }
  }

  startVoiceRecognition() {
    if (this.isRecording) {
      this.recognition.stop();
      this.isRecording = false;
      this.responseText = 'Grabación detenida.';
      this.chatHistoryService.addToChatHistory('ai', this.responseText);
    } else {
      try {
        this.recognition.start();
        this.isRecording = true;
        this.responseText = 'Escuchando...';
        this.chatHistoryService.addToChatHistory('ai', this.responseText);
      } catch (error) {
        console.error('Error al iniciar el reconocimiento de voz:', error);
        this.responseText = 'Error al iniciar el reconocimiento.';
        this.chatHistoryService.addToChatHistory('ai', this.responseText);
      }
    }

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase().trim();
      console.log('Texto reconocido:', transcript);
      this.handleQuery(transcript);
    };

    this.recognition.onerror = (event) => {
      console.error('Error en reconocimiento:', event.error);
      this.responseText = 'Error en el reconocimiento.';
      this.chatHistoryService.addToChatHistory('ai', this.responseText);
      this.isRecording = false;
    };
  }

  submitTextInput() {
    if (this.userInput.trim()) {
      this.chatHistoryService.addToChatHistory('user', this.userInput);
      console.log('Texto enviado manualmente:', this.userInput);
      const transcript = this.userInput.toLowerCase().trim();
      this.handleQuery(transcript);
      this.userInput = '';
    }
  }

  private handleQuery(transcript: string) {
    const entityKeywords = {
      estudiante: ['estudiante', 'alumno', 'alumnos', 'estudiantes'],
      docente: ['docente', 'profesor', 'maestro', 'profesores', 'instructor', 'maestra'],
      periodo: ['periodo', 'periodos', 'semestre'],
    };

    // Prioritize student/teacher if name or ID is present
    const nameMatch = transcript.match(/[a-zA-Z\s]+(?<!\d{4})/); // Match names (letters only), exclude years
    const idMatch = transcript.match(/\b\d{6,}\b/); // Match IDs (e.g., document numbers)
    let matchedEntity: string | undefined;

    // First, check for student or teacher with name or ID
    if (nameMatch || idMatch) {
      matchedEntity = Object.keys(entityKeywords)
        .filter((entity) => entity !== 'periodo') // Exclude periodo initially
        .find((entity) =>
          entityKeywords[entity].some((keyword) => transcript.includes(keyword))
        );
    }

    // Only check periodo for explicit consultation terms
    if (!matchedEntity && transcript.match(/(consultar\s+periodos|periodo\s+\d{4}|semestre\s+\d{4})/i)) {
      matchedEntity = 'periodo';
    }

    if (matchedEntity) {
      console.log(`Entidad detectada: ${matchedEntity}`);
      this.handleEntityQuery(transcript, matchedEntity);
    } else if (this.isGreeting(transcript)) {
      this.geminiService.generateContent(transcript).subscribe({
        next: (geminiResponse: any) => {
          this.responseText = geminiResponse.candidates[0].content.parts[0].text;
          this.speak(this.responseText);
        },
        error: (geminiError: any) => {
          console.error('Gemini - ❌ Error al comunicarse con Gemini:', geminiError);
          this.responseText = 'Lo siento, no pude obtener una respuesta.';
          this.speak(this.responseText);
        },
      });
    } else {
      this.wekaService.predictIntention(transcript).subscribe({
        next: (response) => {
          const predictedIntention = response.intencion;
          console.log('Weka - 🎯 Intención predicha por Weka:', predictedIntention);

          switch (predictedIntention) {
            case 'consultar_periodos':
              this.responseText = 'Mostrando los periodos...';
              this.speak(this.responseText);
              this.router.navigate(['/periodo'], {
                queryParams: { action: 'consultar' },
              });
              break;
            case 'crear_periodo':
              this.responseText = 'La creación de periodos no está permitida. Usa "consultar periodos" o "periodo 2024" para consultar.';
              this.speak(this.responseText);
              break;
            case 'crear_estudiante':
              this.responseText = 'Dirigiéndote a la página de creación de estudiantes...';
              this.speak(this.responseText);
              this.router.navigate(['/matricula'], {
                queryParams: { action: 'crear' },
              });
              break;
            case 'consultar_estudiantes':
              this.responseText = 'Mostrando la lista de estudiantes...';
              this.speak(this.responseText);
              this.router.navigate(['/listar'], {
                queryParams: { action: 'consultar' },
              });
              break;
            case 'crear_docente':
              this.responseText = 'Dirigiéndote a la página de creación de docentes...';
              this.speak(this.responseText);
              this.router.navigate(['/docentes'], {
                queryParams: { action: 'crear' },
              });
              break;
            case 'consultar_docentes':
              this.responseText = 'Mostrando la lista de docentes...';
              this.speak(this.responseText);
              this.router.navigate(['/docentes'], {
                queryParams: { action: 'consultar' },
              });
              break;
            default:
              this.responseText = 'No entendí la solicitud. Intenta con "consultar estudiantes", "crear docente", "consultar periodos" o "periodo 2024".';
              this.speak(this.responseText);
              console.log(`Intención no reconocida: ${predictedIntention}`);
          }
        },
        error: (wekaError) => {
          console.error('Weka - ❌ Error al comunicarse con Weka:', wekaError);
          this.responseText = 'Hubo un error al procesar tu solicitud. Por favor, intenta de nuevo.';
          this.speak(this.responseText);
        },
      });
    }
  }

  private handleEntityQuery(transcript: string, entity: string) {
    const platformContext = `
Eres un asistente de inteligencia artificial para la plataforma educativa EduPortal. La plataforma gestiona entidades con la siguiente estructura:

- Estudiante: Representa un estudiante con idEstudiante, nombres, apellidos, documentoIdentidad, fechaNacimiento, sexo, ciudad, direccion, activo. Relacionado con:
  - EncuestaEstudiante: Datos socioeconómicos como problemasPersonales, apoyoFamiliar, nivelEstres, estrato, tieneAccesoInternet, tieneComputador, viveConPadres, tieneTrabajo.
  - DesempenoEstudiante: Rendimiento académico con horasEstudioSemanal, asistencia, promedioParciales, participacionClases (Baja/Media/Alta), usoPlataformaVirtual (Bajo/Medio/Alto), antecedentesPerdida, perderaAsignatura.
  - Calificacion: Notas con idCalificacion, curricular, estudiante, nota, fechaRegistro.
  - Inscripcion: Matrícula con idInscripcion, estudiante, acudiente, nivelDetalle, montoPago, estadoPago (PENDIENTE, PAGADO, EN_PROCESO).
- Docente: Representa un docente con idDocente, nombres, apellidos, documentoIdentidad, fechaNacimiento, sexo, gradoEstudio, email, numeroTelefono, activo. Vinculado a Curricular mediante DocenteNivelDetalleCurso.
- Curricular: Representa una asignatura con idCurricular, descripcion, activo.
- Periodo: Representa un periodo académico con idPeriodo, descripcion, fechaInicio, fechaFin, activo.
- Acudiente: Representa un acudiente con idAcudiente, nombres, apellidos, documentoIdentidad, telefono, parentesco.
- Nivel: Representa un nivel académico con idNivel, periodo, descripcionNivel, descripcionTurno, horaInicio, horaFin.
- NivelDetalle: Detalla un nivel con idNivelDetalle, nivel, gradoSeccion, totalVacantes, vacantesDisponibles.
- GradoSeccion: Representa grado y sección con idGradoSeccion, descripcionGrado, descripcionSeccion.
- Horario: Representa un horario con idHorario, diaSemana, horaInicio, horaFin, nivelDetalleCurso.
- Noticia: Representa noticias con id, titulo, contenido, imagen, video, likesCount, comentarios.
- Notificacion: Representa notificaciones con id, titulo, mensaje, leida, fechaHora.
- UserDto: Representa un usuario con id, username, email, roles, opcionalmente vinculado a estudiante o docente.

Relaciones:
- Un Estudiante tiene una Inscripcion, una EncuestaEstudiante, un DesempenoEstudiante y múltiples Calificacion.
- Un Docente está vinculado a múltiples Curricular mediante DocenteNivelDetalleCurso.
- Un Periodo contiene múltiples Nivel, que contiene NivelDetalle, que se vincula a Curso mediante NivelDetalleCurso.
- Una Inscripcion vincula un Estudiante a un NivelDetalle y un Acudiente.

Instrucciones:
- Eres un administrador con acceso completo a todos los datos.
- Responde a consultas sobre entidades específicas (estudiantes, docentes, periodos) con información detallada basada en los datos proporcionados.
- Si no hay datos específicos, indica que la información no está disponible, pero describe qué se podría recuperar (e.g., notas de estudiantes, asignaturas de docentes).
- Usa un tono profesional, claro y en español, adecuado para una plataforma educativa.
- Si la consulta incluye un nombre o identificador (e.g., "estudiante Juan"), busca coincidencias y proporciona detalles relevantes.
`;

    switch (entity) {
      case 'estudiante': {
        const nameMatch = transcript.match(/(estudiante|alumno)\s+([a-zA-Z\s]+)/i);
        const idMatch = transcript.match(/documento\s+(\d+)/i);
        const name = nameMatch ? nameMatch[2].trim() : null;
        const id = idMatch ? idMatch[1] : null;

        if (name || id) {
          this.estudianteService.getAllEstudiantes().subscribe({
            next: (estudiantes: Estudiante[]) => {
              const estudiante = estudiantes.find(
                (e) =>
                  (name &&
                    (`${e.nombres} ${e.apellidos}`.toLowerCase().includes(name.toLowerCase()) ||
                     e.nombres?.toLowerCase().includes(name.toLowerCase()) ||
                     e.apellidos?.toLowerCase().includes(name.toLowerCase()))) ||
                  (id && e.documentoIdentidad === id)
              );
              if (estudiante) {
                const prompt = `
${platformContext}

Consulta: "${transcript}"
Datos: Estudiante encontrado con los siguientes detalles:
- ID: ${estudiante.idEstudiante}
- Nombre: ${estudiante.nombres} ${estudiante.apellidos}
- Documento: ${estudiante.documentoIdentidad || 'No disponible'}
- Fecha de nacimiento: ${estudiante.fechaNacimiento?.toISOString() || 'No disponible'}
- Sexo: ${estudiante.sexo || 'No disponible'}
- Ciudad: ${estudiante.ciudad || 'No disponible'}
- Activo: ${estudiante.activo ? 'Sí' : 'No'}
- Rendimiento: ${
                  estudiante.desempeno
                    ? `Horas de estudio semanales: ${estudiante.desempeno.horasEstudioSemanal}, Asistencia: ${estudiante.desempeno.asistencia}%`
                    : 'No disponible'
                }
- Encuesta: ${
                  estudiante.encuesta
                    ? `Nivel de estrés: ${estudiante.encuesta.nivelEstres}, Apoyo familiar: ${estudiante.encuesta.apoyoFamiliar}`
                    : 'No disponible'
                }

Proporciona un resumen detallado de la información de este estudiante, incluyendo su rendimiento académico y contexto socioeconómico si está disponible. Responde en español con un tono profesional.
`;
                this.geminiService.generateContent(prompt).subscribe({
                  next: (geminiResponse: any) => {
                    this.responseText = geminiResponse.candidates[0].content.parts[0].text;
                    this.speak(this.responseText);
                  },
                  error: (geminiError: any) => {
                    console.error('Gemini - ❌ Error al comunicarse con Gemini:', geminiError);
                    this.responseText = 'Lo siento, no pude obtener información del estudiante.';
                    this.speak(this.responseText);
                  },
                });
              } else {
                this.responseText = `No se encontró un estudiante con el nombre "${name || ''}" o documento "${id || ''}".`;
                this.speak(this.responseText);
              }
            },
            error: (error) => {
              console.error('Error al obtener estudiantes:', error);
              this.responseText = 'Error al buscar el estudiante.';
              if (error.status === 401) {
                this.router.navigate(['/login']);
                this.responseText = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
              }
              this.speak(this.responseText);
            },
          });
        } else {
          this.responseText = 'Por favor, proporciona el nombre o documento del estudiante para buscar su información.';
          this.speak(this.responseText);
        }
        break;
      }
      case 'docente': {
        const nameMatch = transcript.match(/(docente|profesor|maestro|instructor|maestra)\s+([a-zA-Z\s]+)/i);
        const idMatch = transcript.match(/documento\s+(\d+)/i);
        const name = nameMatch ? nameMatch[2].trim() : null;
        const id = idMatch ? idMatch[1] : null;

        if (name || id) {
          this.docenteService.getAllDocentes().subscribe({
            next: (docentes: Docente[]) => {
              const docente = docentes.find(
                (d) =>
                  (name &&
                    (`${d.nombres} ${d.apellidos}`.toLowerCase().includes(name.toLowerCase()) ||
                     d.nombres.toLowerCase().includes(name.toLowerCase()) ||
                     d.apellidos.toLowerCase().includes(name.toLowerCase()))) ||
                  (id && d.documentoIdentidad === id)
              );
              if (docente) {
                const prompt = `
${platformContext}

Consulta: "${transcript}"
Datos: Docente encontrado con los siguientes detalles:
- ID: ${docente.idDocente}
- Nombre: ${docente.nombres} ${docente.apellidos}
- Documento: ${docente.documentoIdentidad || 'No disponible'}
- Email: ${docente.email || 'No disponible'}
- Teléfono: ${docente.numeroTelefono || 'No disponible'}
- Grado de estudio: ${docente.gradoEstudio || 'No disponible'}
- Activo: ${docente.activo ? 'Sí' : 'No'}

Proporciona un resumen detallado de la información de este docente, incluyendo su rol y asignaturas impartidas si están disponibles. Responde en español con un tono profesional.
`;
                this.geminiService.generateContent(prompt).subscribe({
                  next: (geminiResponse: any) => {
                    this.responseText = geminiResponse.candidates[0].content.parts[0].text;
                    this.speak(this.responseText);
                  },
                  error: (geminiError: any) => {
                    console.error('Gemini - ❌ Error al comunicarse con Gemini:', geminiError);
                    this.responseText = 'Lo siento, no pude obtener información del docente.';
                    this.speak(this.responseText);
                  },
                });
              } else {
                this.responseText = `No se encontró un docente con el nombre "${name || ''}" o documento "${id || ''}".`;
                this.speak(this.responseText);
              }
            },
            error: (error) => {
              console.error('Error al obtener docentes:', error);
              this.responseText = 'Error al buscar el docente.';
              if (error.status === 401) {
                this.router.navigate(['/login']);
                this.responseText = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
              }
              this.speak(this.responseText);
            },
          });
        } else {
          this.responseText = 'Por favor, proporciona el nombre o documento del docente para buscar su información.';
          this.speak(this.responseText);
        }
        break;
      }
      case 'periodo': {
        const yearMatch = transcript.match(/(periodo|semestre)\s+(\d{4})/i);
        const year = yearMatch ? yearMatch[2] : null;

        if (year || transcript.includes('consultar periodos')) {
          this.periodoService.getAll().subscribe({
            next: (periodos: Periodo[]) => {
              if (transcript.includes('consultar periodos')) {
                this.responseText = 'Mostrando los periodos...';
                this.speak(this.responseText);
                this.router.navigate(['/periodo'], {
                  queryParams: { action: 'consultar' },
                });
              } else if (year) {
                const periodo = periodos.find(
                  (p) =>
                    p.descripcion.toLowerCase().includes(year.toLowerCase()) ||
                    p.fechaInicio.getFullYear().toString() === year ||
                    p.fechaFin.getFullYear().toString() === year
                );
                if (periodo) {
                  const prompt = `
${platformContext}

Consulta: "${transcript}"
Datos: Periodo encontrado con los siguientes detalles:
- ID: ${periodo.idPeriodo}
- Descripción: ${periodo.descripcion}
- Fecha de inicio: ${periodo.fechaInicio.toISOString()}
- Fecha de fin: ${periodo.fechaFin.toISOString()}
- Activo: ${periodo.activo ? 'Sí' : 'No'}

Proporciona un resumen detallado de este periodo académico, incluyendo su duración y estado. Responde en español con un tono profesional.
`;
                  this.geminiService.generateContent(prompt).subscribe({
                    next: (geminiResponse: any) => {
                      this.responseText = geminiResponse.candidates[0].content.parts[0].text;
                      this.speak(this.responseText);
                    },
                    error: (geminiError: any) => {
                      console.error('Gemini - ❌ Error al comunicarse con Gemini:', geminiError);
                      this.responseText = 'Lo siento, no pude obtener información del periodo.';
                      this.speak(this.responseText);
                    },
                  });
                } else {
                  this.responseText = `No se encontró un periodo para el año ${year}.`;
                  this.speak(this.responseText);
                }
              }
            },
            error: (error) => {
              console.error('Error al obtener periodos:', error);
              this.responseText = 'Error al buscar el periodo.';
              if (error.status === 401) {
                this.router.navigate(['/login']);
                this.responseText = 'Sesión expirada. Por favor, inicia sesión nuevamente.';
              }
              this.speak(this.responseText);
            },
          });
        } else {
          this.responseText = 'Por favor, proporciona el año del periodo (e.g., "periodo 2024") o di "consultar periodos".';
          this.speak(this.responseText);
        }
        break;
      }
      default:
        this.responseText = 'No se pudo procesar la consulta. Intenta con "consultar estudiantes", "crear docente" o "periodo 2024".';
        this.speak(this.responseText);
    }
  }

  private isGreeting(text: string): boolean {
    const greetings = [
      'hola',
      'buenos dias',
      'buenas tardes',
      'buenas noches',
      'que tal',
      'como estas',
      'como te va',
    ];
    return greetings.some((greeting) => text.includes(greeting));
  }

  enterStudentPlatform() {
    this.isInStudentPlatform = true;
    this.studentHandlerService.enterStudentPlatform(this.speak.bind(this));
  }

  exitStudentPlatform() {
    this.isInStudentPlatform = false;
    this.studentHandlerService.exitStudentPlatform(this.speak.bind(this));
  }

  enterHoboPlatform() {
    this.platformHandlerService.enterHoboPlatform(this.speak.bind(this));
  }

  exitHoboPlatform() {
    this.isInHoboPlatform = false;
    this.platformHandlerService.exitHoboPlatform(this.speak.bind(this));
  }

  speak(text: string) {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'es-ES';
      const voiceIndicator = document.querySelector('.voice-indicator');
      if (voiceIndicator) voiceIndicator.classList.add('active');
      utterance.onend = () => {
        if (voiceIndicator) voiceIndicator.classList.remove('active');
      };
      speechSynthesis.speak(utterance);
    } else {
      console.warn('La síntesis de voz no está soportada en este navegador.');
    }
    this.chatHistoryService.addToChatHistory('ai', text);
  }

  stopAI() {
    if (this.isRecording) {
      this.recognition.stop();
      this.isRecording = false;
    }
    if ('speechSynthesis' in window) {
      speechSynthesis.cancel();
      const voiceIndicator = document.querySelector('.voice-indicator');
      if (voiceIndicator) voiceIndicator.classList.remove('active');
    }
    this.responseText = 'IA detenida en EduPortal.';
    this.chatHistoryService.addToChatHistory('ai', this.responseText);
  }

  toggleChatSize() {
    if (window.innerWidth > 768) {
      this.isExpanded = !this.isExpanded;
    }
  }
}
