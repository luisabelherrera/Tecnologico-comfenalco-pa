import 'package:flutter/material.dart';
import '../models/datos_estudiante_request.dart';
import '../models/prediccion_response.dart';
import '../models/prediction_history_entry.dart';
import '../services/api_service.dart';
import '../services/prediction_history_service.dart';

class PredictionFormScreen extends StatefulWidget {
  const PredictionFormScreen({super.key});

  @override
  State<PredictionFormScreen> createState() => _PredictionFormScreenState();
}

class _PredictionFormScreenState extends State<PredictionFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final ApiService _apiService = ApiService();
  final PredictionHistoryService _historyService = PredictionHistoryService();
  bool _isLoading = false;
  String _selectedStudentName = '';

  List<dynamic> _estudiantes = [];

  // Controllers for text fields
  final _documentoController = TextEditingController();
  final _edadController = TextEditingController();
  final _horasEstudioController = TextEditingController();
  final _asistenciaController = TextEditingController();
  final _promedioController = TextEditingController();
  final _cargaAcademicaController = TextEditingController();

  // Dropdown values
  String _genero = 'Masculino';
  String _participacionClases = 'Media';
  String _usoPlataforma = 'Medio';
  String _antecedentes = 'No';
  String _apoyoFamiliar = 'Medio';
  String _problemasPersonales = 'Ninguno';

  @override
  void initState() {
    super.initState();
    _fetchEstudiantes();
  }

  Future<void> _fetchEstudiantes() async {
    try {
      final data = await _apiService.getAllEstudiantes();
      if (mounted) {
        setState(() {
          _estudiantes = data;
        });
      }
    } catch (e) {
      debugPrint('Error obteniendo estudiantes: $e');
    }
  }

  @override
  void dispose() {
    _documentoController.dispose();
    _edadController.dispose();
    _horasEstudioController.dispose();
    _asistenciaController.dispose();
    _promedioController.dispose();
    _cargaAcademicaController.dispose();
    super.dispose();
  }

  void _onStudentSelected(Map<String, dynamic> est) {
    final nombres = (est['nombres'] ?? '').toString();
    final apellidos = (est['apellidos'] ?? '').toString();
    setState(() {
      _selectedStudentName = '$nombres $apellidos'.trim();
      _documentoController.text = (est['documentoIdentidad'] ?? est['documento'] ?? '').toString();
      _edadController.text = est['edad']?.toString() ?? '';
      _horasEstudioController.text = est['horasEstudioSemanal']?.toString() ?? '';
      _asistenciaController.text = est['asistencia']?.toString() ?? '';
      _promedioController.text = est['promedioParciales']?.toString() ?? '';
      _cargaAcademicaController.text = est['cargaAcademica']?.toString() ?? '';

      _setDropdownIfValid(est['genero'], ['Masculino', 'Femenino', 'Otro'], (v) => _genero = v);
      _setDropdownIfValid(est['participacionClases'], ['Baja', 'Media', 'Alta'], (v) => _participacionClases = v);
      _setDropdownIfValid(est['usoPlataformaVirtual'], ['Bajo', 'Medio', 'Alto'], (v) => _usoPlataforma = v);
      _setDropdownIfValid(est['antecedentesPerdida'], ['Sí', 'No'], (v) => _antecedentes = v);
      _setDropdownIfValid(est['apoyoFamiliar'], ['Bajo', 'Medio', 'Alto'], (v) => _apoyoFamiliar = v);
      _setDropdownIfValid(est['problemasPersonales'], ['Ninguno', 'Leves', 'Graves'], (v) => _problemasPersonales = v);
    });
    
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text('Datos del estudiante auto-completados'), backgroundColor: Colors.green),
    );
  }

  void _setDropdownIfValid(dynamic value, List<String> options, void Function(String) setter) {
    if (value == null) return;
    final valStr = value.toString().toLowerCase();
    
    // Fix common mapping issues (e.g. Si -> Sí)
    final normalizedOptions = options.map((e) => e.toLowerCase().replaceAll('í', 'i')).toList();
    final normalizedValue = valStr.replaceAll('í', 'i');

    for (int i = 0; i < options.length; i++) {
      if (normalizedOptions[i] == normalizedValue) {
        setter(options[i]);
        return;
      }
    }
  }

  void _submitForm() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    final request = DatosEstudianteRequest(
      documento: int.tryParse(_documentoController.text),
      edad: int.parse(_edadController.text),
      genero: _genero,
      horasEstudioSemanal: int.parse(_horasEstudioController.text),
      asistencia: double.parse(_asistenciaController.text),
      promedioParciales: double.parse(_promedioController.text),
      participacionClases: _participacionClases,
      usoPlataformaVirtual: _usoPlataforma,
      antecedentesPerdida: _antecedentes,
      apoyoFamiliar: _apoyoFamiliar,
      cargaAcademica: int.parse(_cargaAcademicaController.text),
      problemasPersonales: _problemasPersonales,
    );

    final response = await _apiService.predecir(request);

    setState(() => _isLoading = false);

    if (response != null && mounted) {
      // Guardar en historial local
      final isRiesgo = response.prediccion.toLowerCase().contains('positive') ||
          response.prediccion.toLowerCase().contains('perdera');
      final entry = PredictionHistoryEntry(
        id: DateTime.now().millisecondsSinceEpoch.toString(),
        fecha: DateTime.now(),
        documento: request.documento,
        nombreEstudiante: _selectedStudentName,
        edad: request.edad,
        genero: request.genero,
        horasEstudioSemanal: request.horasEstudioSemanal,
        asistencia: request.asistencia,
        promedioParciales: request.promedioParciales,
        participacionClases: request.participacionClases,
        usoPlataformaVirtual: request.usoPlataformaVirtual,
        antecedentesPerdida: request.antecedentesPerdida,
        apoyoFamiliar: request.apoyoFamiliar,
        cargaAcademica: request.cargaAcademica,
        problemasPersonales: request.problemasPersonales,
        prediccion: response.prediccion,
        confianza: response.confianza,
        esRiesgoAlto: isRiesgo,
        factoresRiesgo: response.factoresRiesgoPrincipales,
        modelo: response.modelo,
      );
      await _historyService.saveEntry(entry);
      _showResultDialog(response);
    } else if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Error al obtener la predicción.'), backgroundColor: Colors.red),
      );
    }
  }

  void _showResultDialog(PrediccionResponse response) {
    final isHighRisk = response.prediccion.toLowerCase().contains('positive') || response.prediccion.toLowerCase().contains('perdera');
    final color = isHighRisk ? Colors.red : Colors.green;
    final icon = isHighRisk ? Icons.warning_rounded : Icons.check_circle_rounded;
    final message = isHighRisk ? 'Riesgo Alto de Pérdida' : 'Bajo Riesgo (No perderá)';

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: Row(
          children: [
            Icon(icon, color: color, size: 28),
            const SizedBox(width: 8),
            const Text('Resultado', style: TextStyle(fontWeight: FontWeight.bold)),
          ],
        ),
        content: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(message, style: TextStyle(color: color, fontSize: 18, fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            Text('Confianza: ${response.confianza}', style: const TextStyle(fontWeight: FontWeight.w600)),
            const SizedBox(height: 12),
            if (response.factoresRiesgoPrincipales.isNotEmpty) ...[
              const Text('Factores Principales:', style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              ...response.factoresRiesgoPrincipales.map((f) => Text('• ${f["variable"]} (Imp: ${f["importancia"]})')),
            ]
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cerrar'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Nueva Predicción'),
        backgroundColor: const Color(0xFF4F46E5),
        foregroundColor: Colors.white,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(color: Color(0xFF4F46E5)))
          : SingleChildScrollView(
              padding: const EdgeInsets.all(16.0),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    const Text('Datos Personales', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 12),
                    _buildAutocompleteField(),
                    Row(
                      children: [
                        Expanded(child: _buildTextField(_edadController, 'Edad', TextInputType.number)),
                        const SizedBox(width: 12),
                        Expanded(child: _buildDropdown('Género', ['Masculino', 'Femenino', 'Otro'], _genero, (v) => setState(() => _genero = v!))),
                      ],
                    ),
                    const SizedBox(height: 24),
                    const Text('Desempeño Académico', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 12),
                    Row(
                      children: [
                        Expanded(child: _buildTextField(_asistenciaController, 'Asistencia (%)', const TextInputType.numberWithOptions(decimal: true))),
                        const SizedBox(width: 12),
                        Expanded(child: _buildTextField(_promedioController, 'Promedio', const TextInputType.numberWithOptions(decimal: true))),
                      ],
                    ),
                    Row(
                      children: [
                        Expanded(child: _buildTextField(_horasEstudioController, 'Horas Estudio/Sem', TextInputType.number)),
                        const SizedBox(width: 12),
                        Expanded(child: _buildTextField(_cargaAcademicaController, 'Carga Académica', TextInputType.number)),
                      ],
                    ),
                    _buildDropdown('Participación en Clases', ['Baja', 'Media', 'Alta'], _participacionClases, (v) => setState(() => _participacionClases = v!)),
                    _buildDropdown('Uso Plataforma Virtual', ['Bajo', 'Medio', 'Alto'], _usoPlataforma, (v) => setState(() => _usoPlataforma = v!)),
                    const SizedBox(height: 24),
                    const Text('Contexto Personal', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                    const SizedBox(height: 12),
                    _buildDropdown('Antecedentes de Pérdida', ['Sí', 'No'], _antecedentes, (v) => setState(() => _antecedentes = v!)),
                    _buildDropdown('Apoyo Familiar', ['Bajo', 'Medio', 'Alto'], _apoyoFamiliar, (v) => setState(() => _apoyoFamiliar = v!)),
                    _buildDropdown('Problemas Personales', ['Ninguno', 'Leves', 'Graves'], _problemasPersonales, (v) => setState(() => _problemasPersonales = v!)),
                    const SizedBox(height: 32),
                    ElevatedButton(
                      onPressed: _submitForm,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: const Color(0xFF4F46E5),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      child: const Text('Realizar Predicción', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                    ),
                    const SizedBox(height: 40),
                  ],
                ),
              ),
            ),
    );
  }

  Widget _buildAutocompleteField() {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: Autocomplete<Map<String, dynamic>>(
        displayStringForOption: (option) {
          final doc = option['documentoIdentidad'] ?? option['documento'] ?? '';
          final nombres = option['nombres'] ?? '';
          final apellidos = option['apellidos'] ?? '';
          return '$doc - $nombres $apellidos'.trim();
        },
        optionsBuilder: (textEditingValue) {
          if (textEditingValue.text.isEmpty) return const Iterable<Map<String, dynamic>>.empty();
          
          final query = textEditingValue.text.toLowerCase();
          return _estudiantes.cast<Map<String, dynamic>>().where((est) {
            final doc = (est['documentoIdentidad'] ?? est['documento'] ?? '').toString().toLowerCase();
            final nombres = (est['nombres'] ?? '').toString().toLowerCase();
            final apellidos = (est['apellidos'] ?? '').toString().toLowerCase();
            return doc.contains(query) || nombres.contains(query) || apellidos.contains(query);
          });
        },
        onSelected: (est) {
          _onStudentSelected(est as Map<String, dynamic>);
        },
        fieldViewBuilder: (context, textEditingController, focusNode, onFieldSubmitted) {
          textEditingController.addListener(() {
            final text = textEditingController.text;
            if (text.contains(' - ')) {
              _documentoController.text = text.split(' - ').first;
            } else {
              _documentoController.text = text;
            }
          });
          return TextFormField(
            controller: textEditingController,
            focusNode: focusNode,
            keyboardType: TextInputType.text,
            decoration: InputDecoration(
              labelText: 'Buscar Estudiante (Opcional)',
              hintText: 'Ej. 1047... o Juan Perez',
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
              filled: true,
              fillColor: Colors.white,
              suffixIcon: const Icon(Icons.search_rounded, color: Colors.grey),
            ),
          );
        },
      ),
    );
  }

  Widget _buildTextField(TextEditingController controller, String label, TextInputType type, {bool required = true}) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: TextFormField(
        controller: controller,
        keyboardType: type,
        decoration: InputDecoration(
          labelText: label,
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
          filled: true,
          fillColor: Colors.white,
        ),
        validator: (value) {
          if (required && (value == null || value.isEmpty)) {
            return 'Requerido';
          }
          return null;
        },
      ),
    );
  }

  Widget _buildDropdown(String label, List<String> options, String currentValue, void Function(String?) onChanged) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16.0),
      child: DropdownButtonFormField<String>(
        value: currentValue,
        decoration: InputDecoration(
          labelText: label,
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(12)),
          filled: true,
          fillColor: Colors.white,
        ),
        items: options.map((opt) => DropdownMenuItem(value: opt, child: Text(opt))).toList(),
        onChanged: onChanged,
      ),
    );
  }
}
