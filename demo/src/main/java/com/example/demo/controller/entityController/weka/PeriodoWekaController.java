package com.example.demo.controller.entityController.weka;

import weka.classifiers.Classifier;
import weka.core.DenseInstance;
import weka.core.Instances;
import weka.core.SerializationHelper;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.annotation.PostConstruct;

import java.io.BufferedReader;
import java.io.FileNotFoundException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ia")
public class PeriodoWekaController {

    private Classifier classifier;
    private Instances dataStructure;

    @PostConstruct
    public void init() {
        try {
            // Cargar el modelo Weka desde resources
            InputStream modelStream = getClass().getClassLoader().getResourceAsStream("intents_model.model");
            if (modelStream == null) {
                throw new FileNotFoundException("❌ No se encontró el archivo intents_model.model en el classpath");
            }
            this.classifier = (Classifier) SerializationHelper.read(modelStream);

            // Cargar la estructura ARFF
            InputStream arffStream = getClass().getClassLoader().getResourceAsStream("intents_structure.arff");
            if (arffStream == null) {
                throw new FileNotFoundException("❌ No se encontró el archivo intents_structure.arff en el classpath");
            }
            BufferedReader reader = new BufferedReader(new InputStreamReader(arffStream));
            this.dataStructure = new Instances(reader);
            this.dataStructure.setClassIndex(this.dataStructure.numAttributes() - 1);

            System.out.println("✅ Modelo y estructura ARFF cargados correctamente");

        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("❌ Error al cargar el modelo o la estructura", e);
        }
    }

    @PostMapping("/predict")
    public ResponseEntity<Map<String, String>> predict(@RequestBody Map<String, String> request) throws Exception {
        String texto = request.get("texto");
    
        DenseInstance instance = new DenseInstance(2); // 2 atributos (texto + clase)
        instance.setDataset(dataStructure);
        instance.setValue(dataStructure.attribute(0), texto); // Primer atributo: texto
    
        Instances data = new Instances(dataStructure, 0);
        data.add(instance);
        data.setClassIndex(data.numAttributes() - 1);
    
        double labelIndex = classifier.classifyInstance(data.firstInstance());
        String predictedClass = dataStructure.classAttribute().value((int) labelIndex);
    
        // 🔥 Aquí imprimes en consola la intención predicha
        System.out.println("🎯 Intención predicha por Weka: " + predictedClass);
    
        Map<String, String> response = new HashMap<>();
        response.put("intencion", predictedClass);
        return ResponseEntity.ok(response);
    }
}    