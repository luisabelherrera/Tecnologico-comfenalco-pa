import 'package:flutter/material.dart';
import '../services/api_service.dart';


class TeacherGradesScreen extends StatefulWidget {
  const TeacherGradesScreen({super.key});

  @override
  State<TeacherGradesScreen> createState() => _TeacherGradesScreenState();
}

class _TeacherGradesScreenState extends State<TeacherGradesScreen> {
  final ApiService _apiService = ApiService();
  late Future<List<dynamic>> _studentsFuture;

  // We maintain a map of controllers. Key = idEstudiante
  final Map<int, TextEditingController> _gradeControllers = {};
  bool _isSaving = false;

  @override
  void initState() {
    super.initState();
    _studentsFuture = _apiService.getAllEstudiantes();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        elevation: 0,
        title: const Text(
          'Gestión de Notas',
          style: TextStyle(fontWeight: FontWeight.w600),
        ),
        backgroundColor: const Color(0xFF4F46E5),
        foregroundColor: Colors.white,
        centerTitle: true,
      ),
      body: FutureBuilder<List<dynamic>>(
        future: _studentsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          
          final students = snapshot.data ?? [];
          
          return Column(
            children: [
              // Header con gradiente
              Container(
                width: double.infinity,
                padding: const EdgeInsets.fromLTRB(20, 0, 20, 24),
                decoration: const BoxDecoration(
                  gradient: LinearGradient(
                    colors: [Color(0xFF4F46E5), Color(0xFF6366F1)],
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                  ),
                  borderRadius: BorderRadius.only(
                    bottomLeft: Radius.circular(24),
                    bottomRight: Radius.circular(24),
                  ),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      students.isEmpty ? 'Sin estudiantes' : 'Seleccione un estudiante',
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Ingrese las notas correspondientes',
                      style: TextStyle(
                        fontSize: 14,
                        color: Colors.white70,
                      ),
                    ),
                  ],
                ),
              ),
              // Lista de estudiantes
              Expanded(
                child: students.isEmpty
                    ? Center(
                        child: Text('No hay estudiantes disponibles', style: TextStyle(color: Colors.grey.shade600)),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.all(16.0),
                        itemCount: students.length,
                        itemBuilder: (context, index) {
                          final student = students[index];
                          final nombres = student['nombres'] ?? '';
                          final apellidos = student['apellidos'] ?? '';
                          final initials = (nombres.isNotEmpty && apellidos.isNotEmpty) 
                              ? '${nombres[0]}${apellidos[0]}'.toUpperCase()
                              : 'ST';
                          final idEstudiante = student['idEstudiante'] ?? student['id'] ?? 0;
                          
                          if (!_gradeControllers.containsKey(idEstudiante)) {
                            _gradeControllers[idEstudiante] = TextEditingController();
                          }

                          return _buildStudentListCard(
                            '$nombres $apellidos'.trim(),
                            student['codigo'] ?? 'Sin código',
                            initials,
                            _gradeControllers[idEstudiante]!,
                          );
                        },
                      ),
              ),
            ],
          );
        },
      ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _isSaving ? null : _saveGrades,
        backgroundColor: const Color(0xFF4F46E5),
        elevation: 4,
        icon: _isSaving ? const SizedBox(width: 20, height: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2)) : const Icon(Icons.save_rounded, color: Colors.white),
        label: Text(
          _isSaving ? 'Guardando...' : 'Guardar Notas',
          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
        ),
      ),
    );
  }

  Future<void> _saveGrades() async {
    setState(() => _isSaving = true);
    int savedCount = 0;
    
    try {
      for (var entry in _gradeControllers.entries) {
        final text = entry.value.text;
        if (text.isNotEmpty) {
          final nota = double.tryParse(text);
          if (nota != null) {
            final data = {
              "curricular": { "idCurricular": 1 }, // Default o mock curricular
              "estudiante": { "idEstudiante": entry.key },
              "nota": nota,
              "activo": true
            };
            await _apiService.createEntity('/calificaciones', data);
            savedCount++;
          }
        }
      }
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
           SnackBar(
            content: Row(
              children: [
                const Icon(Icons.check_circle, color: Colors.white),
                const SizedBox(width: 12),
                Text('Se guardaron $savedCount calificaciones'),
              ],
            ),
            backgroundColor: const Color(0xFF22C55E),
          ),
        );
      }
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  Widget _buildStudentListCard(String studentName, String course, String initials, TextEditingController controller) {

    return Container(
      margin: const EdgeInsets.only(bottom: 16.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Header del estudiante con avatar
            Row(
              children: [
                CircleAvatar(
                  radius: 24,
                  backgroundColor: const Color(0xFFEEF2FF),
                  child: Text(
                    initials,
                    style: const TextStyle(
                      color: Color(0xFF4F46E5),
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        studentName,
                        style: const TextStyle(
                          fontWeight: FontWeight.bold,
                          fontSize: 16,
                          color: Color(0xFF1F2937),
                        ),
                      ),
                      const SizedBox(height: 2),
                      Row(
                        children: [
                          const Icon(
                            Icons.school_outlined,
                            size: 14,
                            color: Color(0xFF6B7280),
                          ),
                          const SizedBox(width: 4),
                          Text(
                            course,
                            style: const TextStyle(
                              color: Color(0xFF6B7280),
                              fontSize: 13,
                            ),
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 16),
            // Divider estilizado
            Container(
              height: 1,
              color: const Color(0xFFE5E7EB),
            ),
            const SizedBox(height: 16),
            // Inputs de notas
            Row(
              children: [
                Expanded(child: _buildGradeInput('Nota', Icons.looks_one_outlined, controller: controller)),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildGradeInput(String label, IconData icon, {TextEditingController? controller}) {
    return TextField(
      controller: controller,
      keyboardType: const TextInputType.numberWithOptions(decimal: true),

      textAlign: TextAlign.center,
      style: const TextStyle(
        fontWeight: FontWeight.w600,
        fontSize: 16,
        color: Color(0xFF1F2937),
      ),
      decoration: InputDecoration(
        labelText: label,
        labelStyle: const TextStyle(
          fontSize: 12,
          color: Color(0xFF6B7280),
        ),
        filled: true,
        fillColor: const Color(0xFFF9FAFB),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFFE5E7EB)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFFE5E7EB)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12),
          borderSide: const BorderSide(color: Color(0xFF4F46E5), width: 2),
        ),
        isDense: true,
        contentPadding: const EdgeInsets.symmetric(vertical: 14, horizontal: 12),
      ),
    );
  }
}