import 'package:flutter/material.dart';
import '../services/api_service.dart';

class TeacherAttendanceScreen extends StatefulWidget {
  const TeacherAttendanceScreen({super.key});

  @override
  State<TeacherAttendanceScreen> createState() => _TeacherAttendanceScreenState();
}

class _TeacherAttendanceScreenState extends State<TeacherAttendanceScreen> {
  final ApiService _apiService = ApiService();
  late Future<List<Map<String, dynamic>>> _studentsFuture;

  @override
  void initState() {
    super.initState();
    _studentsFuture = _loadStudents();
  }

  Future<List<Map<String, dynamic>>> _loadStudents() async {
    final data = await _apiService.getAllEstudiantes();
    return data.map<Map<String, dynamic>>((e) {
      final nombres = e['nombres'] ?? '';
      final apellidos = e['apellidos'] ?? '';
      return {
        'id': e['idEstudiante'] ?? e['id'],
        'name': '$nombres $apellidos'.trim(),
        'codigo': e['codigo'] ?? '',
        'present': true,
      };
    }).toList();
  }

  int _presentCount(List<Map<String, dynamic>> students) =>
      students.where((s) => s['present'] == true).length;
  int _absentCount(List<Map<String, dynamic>> students) =>
      students.where((s) => s['present'] == false).length;

  Future<void> _guardarAsistencia(List<Map<String, dynamic>> students) async {
    final today = DateTime.now().toIso8601String().split('T').first;
    int saved = 0;
    for (final s in students) {
      final payload = {
        'estudiante': {'idEstudiante': s['id']},
        'nivelDetalleCurso': {'idNivelDetalleCurso': 1},
        'asistio': s['present'],
        'fecha': today,
      };
      final ok = await _apiService.registrarAsistencia(payload);
      if (ok) saved++;
    }

    if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Row(
            children: [
              const Icon(Icons.check_circle, color: Colors.white),
              const SizedBox(width: 12),
              Text('Asistencia guardada ($saved/${students.length} registros)'),
            ],
          ),
          backgroundColor: const Color(0xFF22C55E),
          behavior: SnackBarBehavior.floating,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
          margin: const EdgeInsets.all(16),
        ),
      );
      Future.delayed(const Duration(milliseconds: 800), () {
        if (mounted) Navigator.pop(context);
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<Map<String, dynamic>>>(
      future: _studentsFuture,
      builder: (context, snapshot) {
        final students = snapshot.data ?? [];

        return Scaffold(
          backgroundColor: const Color(0xFFF5F7FA),
          appBar: AppBar(
            elevation: 0,
            title: const Text('Tomar Asistencia', style: TextStyle(fontWeight: FontWeight.w600)),
            backgroundColor: const Color(0xFF4F46E5),
            foregroundColor: Colors.white,
            centerTitle: true,
          ),
          body: Column(
            children: [
              // Header con estadísticas
              Container(
                width: double.infinity,
                padding: const EdgeInsets.fromLTRB(20, 20, 20, 24),
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
                    const Text('Registro de Hoy',
                        style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white)),
                    const SizedBox(height: 16),
                    snapshot.connectionState == ConnectionState.waiting
                        ? const Center(child: CircularProgressIndicator(color: Colors.white))
                        : Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              _buildStatItem(label: 'Presentes', count: _presentCount(students), color: const Color(0xFF22C55E), icon: Icons.check_circle_rounded),
                              _buildStatItem(label: 'Ausentes', count: _absentCount(students), color: const Color(0xFFEF4444), icon: Icons.cancel_rounded),
                              _buildStatItem(label: 'Total', count: students.length, color: Colors.white.withOpacity(0.8), icon: Icons.people_rounded),
                            ],
                          ),
                  ],
                ),
              ),
              // Lista de estudiantes
              Expanded(
                child: snapshot.connectionState == ConnectionState.waiting
                    ? const Center(child: CircularProgressIndicator(color: Color(0xFF4F46E5)))
                    : snapshot.hasError || students.isEmpty
                        ? Center(
                            child: Column(
                              mainAxisAlignment: MainAxisAlignment.center,
                              children: [
                                Icon(Icons.people_outline, size: 60, color: Colors.grey.shade400),
                                const SizedBox(height: 16),
                                Text(snapshot.hasError ? 'Error al cargar estudiantes' : 'No hay estudiantes registrados',
                                    style: TextStyle(color: Colors.grey.shade600)),
                              ],
                            ),
                          )
                        : StatefulBuilder(
                            builder: (context, setInnerState) {
                              return ListView.builder(
                                padding: const EdgeInsets.all(16.0),
                                itemCount: students.length,
                                itemBuilder: (context, index) {
                                  return _buildStudentAttendanceCard(
                                    students[index],
                                    index,
                                    students,
                                    setInnerState,
                                  );
                                },
                              );
                            },
                          ),
              ),
            ],
          ),
          floatingActionButton: snapshot.data != null && snapshot.data!.isNotEmpty
              ? FloatingActionButton.extended(
                  onPressed: () => _guardarAsistencia(snapshot.data!),
                  backgroundColor: const Color(0xFF4F46E5),
                  elevation: 4,
                  icon: const Icon(Icons.save_rounded, color: Colors.white),
                  label: const Text('Guardar Asistencia', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w600)),
                )
              : null,
        );
      },
    );
  }

  Widget _buildStatItem({required String label, required int count, required Color color, required IconData icon}) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
        decoration: BoxDecoration(color: Colors.white.withOpacity(0.15), borderRadius: BorderRadius.circular(12)),
        child: Column(
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(height: 6),
            Text(count.toString(), style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white)),
            const SizedBox(height: 2),
            Text(label, style: const TextStyle(fontSize: 12, color: Colors.white70)),
          ],
        ),
      ),
    );
  }

  Widget _buildStudentAttendanceCard(
    Map<String, dynamic> student,
    int index,
    List<Map<String, dynamic>> students,
    StateSetter setInnerState,
  ) {
    final isPresent = student['present'] as bool;
    return Container(
      margin: const EdgeInsets.only(bottom: 12.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: isPresent ? const Color(0xFFE5E7EB) : const Color(0xFFFECDCD), width: 1.5),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        child: Row(
          children: [
            Container(
              width: 48, height: 48,
              decoration: BoxDecoration(
                color: isPresent ? const Color(0xFFDCFCE7) : const Color(0xFFFECDCD),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(isPresent ? Icons.check_rounded : Icons.close_rounded,
                  color: isPresent ? const Color(0xFF22C55E) : const Color(0xFFEF4444), size: 24),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(student['name'] as String,
                      style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 15, color: Color(0xFF1F2937))),
                  const SizedBox(height: 2),
                  if ((student['codigo'] as String).isNotEmpty)
                    Text('Cód: ${student['codigo']}',
                        style: const TextStyle(fontSize: 11, color: Color(0xFF9CA3AF))),
                  Text(isPresent ? 'Presente' : 'Ausente',
                      style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600,
                          color: isPresent ? const Color(0xFF22C55E) : const Color(0xFFEF4444))),
                ],
              ),
            ),
            GestureDetector(
              onTap: () {
                setInnerState(() => students[index]['present'] = !isPresent);
                setState(() {});
              },
              child: Container(
                width: 52, height: 32,
                decoration: BoxDecoration(
                  color: isPresent ? const Color(0xFF22C55E).withOpacity(0.2) : const Color(0xFFEF4444).withOpacity(0.2),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Stack(
                  children: [
                    AnimatedPositioned(
                      duration: const Duration(milliseconds: 200),
                      left: isPresent ? 24 : 4, top: 4,
                      child: Container(
                        width: 24, height: 24,
                        decoration: BoxDecoration(
                          color: isPresent ? const Color(0xFF22C55E) : const Color(0xFFEF4444),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Icon(isPresent ? Icons.check : Icons.close, color: Colors.white, size: 14),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}