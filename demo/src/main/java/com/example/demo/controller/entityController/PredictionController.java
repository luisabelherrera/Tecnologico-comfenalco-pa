package com.example.demo.controller.entityController;

import org.springframework.core.io.ClassPathResource;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.example.demo.model.entity.DatosEstudiante;
import com.example.demo.model.entity.Estudiante;
import com.example.demo.repositories.jpa.DatosEstudianteRepository;
import com.example.demo.repositories.jpa.EstudianteRepository;
import weka.classifiers.Classifier;
import weka.core.DenseInstance;
import weka.core.Instance;
import weka.core.Instances;
import weka.core.converters.ConverterUtils.DataSource;

import java.text.DecimalFormat;
import java.util.Arrays;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:4200")
public class PredictionController {

    private static final Logger LOGGER = Logger.getLogger(PredictionController.class.getName());
    private Classifier classifier;
    private Instances dataStructure;
    private final DatosEstudianteRepository datosEstudianteRepository;
    private final EstudianteRepository estudianteRepository;

    public PredictionController(DatosEstudianteRepository datosEstudianteRepository, EstudianteRepository estudianteRepository) {
        this.datosEstudianteRepository = datosEstudianteRepository;
        this.estudianteRepository = estudianteRepository;
        try {
            ClassPathResource modelResource = new ClassPathResource("estudiante.model");
            classifier = (Classifier) weka.core.SerializationHelper.read(modelResource.getInputStream());
            LOGGER.info("Modelo estudiante cargado exitosamente.");

            ClassPathResource arffResource = new ClassPathResource("estudiantes.arff");
            DataSource source = new DataSource(arffResource.getInputStream());
            dataStructure = source.getDataSet();
            dataStructure.setClassIndex(dataStructure.numAttributes() - 1); // Último atributo como clase
            LOGGER.info("Estructura estudiantes.arff cargada exitosamente.");
        } catch (Exception e) {
            LOGGER.severe("Error al inicializar PredictionController: " + e.getMessage());
            throw new RuntimeException("No se pudo inicializar el controlador de predicción", e);
        }
    }

    @PostMapping("/predecir")
    public ResponseEntity<Map<String, String>> predecir(@RequestBody DatosEstudiante datos) {
        try {
            LOGGER.info("Datos recibidos: " + datos.toString());
            if (dataStructure == null || classifier == null) {
                throw new IllegalStateException("Modelo o estructura no inicializados");
            }

            // Buscar el estudiante por documentoIdentidad y asignarlo (opcional)
            estudianteRepository.findByDocumentoIdentidad(String.valueOf(datos.getDocumento()))
                .ifPresent(estudiante -> datos.setEstudiante(estudiante));

            // Crear instancia con 14 atributos (13 + clase)
            Instance instance = new DenseInstance(dataStructure.numAttributes());
            instance.setDataset(dataStructure);

            LOGGER.info("Estructura del dataset: " + dataStructure.toSummaryString());
            LOGGER.info("Seteando valores...");

            // Asignar valores según el orden del ARFF
            instance.setValue(0, datos.getDocumento());
            instance.setValue(1, datos.getId() != null ? datos.getId() : 0); // ID_Estudiante
            instance.setValue(2, datos.getEdad());
            instance.setValue(3, dataStructure.attribute(3).indexOfValue(datos.getGenero()));
            instance.setValue(4, datos.getHorasEstudioSemanal());
            instance.setValue(5, datos.getAsistencia());
            instance.setValue(6, datos.getPromedioParciales());
            instance.setValue(7, dataStructure.attribute(7).indexOfValue(datos.getParticipacionClases()));
            instance.setValue(8, dataStructure.attribute(8).indexOfValue(datos.getUsoPlataformaVirtual()));
            instance.setValue(9, dataStructure.attribute(9).indexOfValue(datos.getAntecedentesPerdida()));
            instance.setValue(10, dataStructure.attribute(10).indexOfValue(datos.getApoyoFamiliar()));
            instance.setValue(11, datos.getCargaAcademica());
            instance.setValue(12, dataStructure.attribute(12).indexOfValue(datos.getProblemasPersonales()));

            LOGGER.info("Instancia creada: " + instance.toString());

            // Realizar la predicción
            double prediction = classifier.classifyInstance(instance);
            String resultado = dataStructure.classAttribute().value((int) prediction);
            LOGGER.info("Predicción obtenida: " + resultado);

            // Obtener la confianza
            double[] probabilities = classifier.distributionForInstance(instance);
            double confidence = probabilities[(int) prediction];
            DecimalFormat df = new DecimalFormat("#.#");
            String confidencePercentage = df.format(confidence * 100) + "%";

            // Guardar resultados en la entidad
            datos.setPerderaAsignatura(resultado);
            datos.setConfianza(confidencePercentage);
            LOGGER.info("ID antes de guardar: " + datos.getId());
            DatosEstudiante savedDatos = datosEstudianteRepository.save(datos);
            LOGGER.info("Datos guardados en la base de datos con id: " + savedDatos.getId());

            // Respuesta al frontend
            Map<String, String> response = new HashMap<>();
            response.put("prediccion", resultado);
            response.put("confianza", confidencePercentage);
            response.put("id", savedDatos.getId() != null ? savedDatos.getId().toString() : "No generado");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            LOGGER.severe("Error: " + e.getMessage() + " | Stacktrace: " + Arrays.toString(e.getStackTrace()));
            return ResponseEntity.status(500).body(Map.of("error", "Error interno: " + e.getMessage()));
        }
    }

    @GetMapping("/historial")
    public ResponseEntity<List<DatosEstudiante>> getHistorialPredicciones() {
        try {
            List<DatosEstudiante> historial = datosEstudianteRepository.findAll();
            if (historial.isEmpty()) {
                LOGGER.info("No hay predicciones en el historial.");
                return ResponseEntity.ok().body(historial);
            }
            LOGGER.info("Historial de predicciones obtenido: " + historial.size() + " registros.");
            return ResponseEntity.ok(historial);
        } catch (Exception e) {
            LOGGER.severe("Error al obtener el historial: " + e.getMessage());
            return ResponseEntity.status(500).body(null);
        }
    }
}