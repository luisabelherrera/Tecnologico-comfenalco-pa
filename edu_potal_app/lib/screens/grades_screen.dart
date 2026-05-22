import 'package:flutter/material.dart';
import '../models/calificacion_model.dart';
import '../services/api_service.dart';

class GradesScreen extends StatefulWidget {
  const GradesScreen({super.key});

  @override
  State<GradesScreen> createState() => _GradesScreenState();
}

class _GradesScreenState extends State<GradesScreen> {
  final ApiService _apiService = ApiService();
  late Future<List<CalificacionModel>> _gradesFuture;

  @override
  void initState() {
    super.initState();
    _gradesFuture = _fetchGrades();
  }

  Future<List<CalificacionModel>> _fetchGrades() async {
    final profile = await _apiService.getUserProfile();
    final idEstudiante = profile != null && profile['estudiante'] != null ? profile['estudiante']['idEstudiante'] : null;

    final data = await _apiService.getAllCalificaciones();
    if (idEstudiante != null) {
      final filteredData = data.where((c) => c['estudiante'] != null && c['estudiante']['idEstudiante'] == idEstudiante).toList();
      return filteredData.map((json) => CalificacionModel.fromJson(json)).toList();
    }
    return data.map((json) => CalificacionModel.fromJson(json)).toList();
  }

  Color _getGradeColor(double nota) {
    if (nota >= 4.5) return const Color(0xFF22C55E);
    if (nota >= 3.5) return const Color(0xFF10B981);
    if (nota >= 3.0) return const Color(0xFFF59E0B);
    return const Color(0xFFEF4444);
  }

  IconData _getGradeIcon(double nota) {
    if (nota >= 4.5) return Icons.emoji_events_rounded;
    if (nota >= 3.5) return Icons.thumb_up_rounded;
    if (nota >= 3.0) return Icons.check_circle_rounded;
    return Icons.warning_rounded;
  }

  String _getGradeLabel(double nota) {
    if (nota >= 4.5) return 'Excelente';
    if (nota >= 3.5) return 'Bueno';
    if (nota >= 3.0) return 'Aprobado';
    return 'Reprobado';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        elevation: 0,
        title: const Text(
          'Mis Calificaciones',
          style: TextStyle(fontWeight: FontWeight.w600),
        ),
        backgroundColor: const Color(0xFF4F46E5),
        foregroundColor: Colors.white,
        centerTitle: true,
        actions: [
          IconButton(
            onPressed: () {
              setState(() {
                _gradesFuture = _fetchGrades();
              });
            },
            icon: const Icon(Icons.refresh_rounded),
            tooltip: 'Actualizar',
          ),
        ],
      ),
      body: Column(
        children: [
          // Header con gradiente
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
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text(
                        'Rendimiento Academico',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        'Revisa tus notas por asignatura',
                        style: TextStyle(
                          fontSize: 14,
                          color: Colors.white70,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(
                    Icons.grade_rounded,
                    color: Colors.white,
                    size: 32,
                  ),
                ),
              ],
            ),
          ),
          // Lista de calificaciones
          Expanded(
            child: FutureBuilder<List<CalificacionModel>>(
              future: _gradesFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: const [
                        CircularProgressIndicator(
                          valueColor:
                              AlwaysStoppedAnimation<Color>(Color(0xFF4F46E5)),
                        ),
                        SizedBox(height: 16),
                        Text(
                          'Cargando calificaciones...',
                          style: TextStyle(
                            color: Color(0xFF6B7280),
                            fontSize: 14,
                          ),
                        ),
                      ],
                    ),
                  );
                } else if (snapshot.hasError) {
                  return _buildEmptyState(
                    icon: Icons.error_outline_rounded,
                    title: 'Error al cargar',
                    subtitle: 'No se pudieron cargar las calificaciones.',
                    color: const Color(0xFFEF4444),
                  );
                } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return _buildEmptyState(
                    icon: Icons.assignment_outlined,
                    title: 'Sin calificaciones',
                    subtitle: 'No hay calificaciones registradas aun.',
                    color: const Color(0xFF6B7280),
                  );
                }

                final grades = snapshot.data!;
                return ListView.builder(
                  padding: const EdgeInsets.all(16.0),
                  itemCount: grades.length,
                  itemBuilder: (context, index) {
                    final grade = grades[index];
                    return _buildGradeCard(grade);
                  },
                );
              },
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState({
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
  }) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              borderRadius: BorderRadius.circular(16),
            ),
            child: Icon(icon, size: 48, color: color),
          ),
          const SizedBox(height: 16),
          Text(
            title,
            style: const TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: Color(0xFF1F2937),
            ),
          ),
          const SizedBox(height: 4),
          Text(
            subtitle,
            style: const TextStyle(
              fontSize: 14,
              color: Color(0xFF6B7280),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildGradeCard(CalificacionModel grade) {
    final gradeColor = _getGradeColor(grade.nota);
    final gradeIcon = _getGradeIcon(grade.nota);
    final gradeLabel = _getGradeLabel(grade.nota);

    return Container(
      margin: const EdgeInsets.only(bottom: 12.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: gradeColor.withOpacity(0.2),
          width: 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          // Barra lateral de color
          Container(
            width: 4,
            height: 120,
            decoration: BoxDecoration(
              color: gradeColor,
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(16),
                bottomLeft: Radius.circular(16),
              ),
            ),
          ),
          // Contenido principal
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Header con curso
                  Row(
                    children: [
                      Container(
                        width: 44,
                        height: 44,
                        decoration: BoxDecoration(
                          color: const Color(0xFFEEF2FF),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: const Icon(
                          Icons.menu_book_rounded,
                          color: Color(0xFF4F46E5),
                          size: 22,
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              grade.cursoDescripcion,
                              style: const TextStyle(
                                fontWeight: FontWeight.bold,
                                fontSize: 16,
                                color: Color(0xFF1F2937),
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 2),
                            Row(
                              children: [
                                const Icon(
                                  Icons.person_outline_rounded,
                                  size: 14,
                                  color: Color(0xFF6B7280),
                                ),
                                const SizedBox(width: 4),
                                Expanded(
                                  child: Text(
                                    grade.nombreDocente,
                                    style: const TextStyle(
                                      fontSize: 13,
                                      color: Color(0xFF6B7280),
                                    ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                              ],
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  // Divider
                  Container(
                    height: 1,
                    color: const Color(0xFFE5E7EB),
                  ),
                  const SizedBox(height: 12),
                  // Descripcion y nota
                  Row(
                    children: [
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              grade.descripcion,
                              style: const TextStyle(
                                fontSize: 14,
                                color: Color(0xFF4B5563),
                                height: 1.4,
                              ),
                              maxLines: 2,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 8),
                            // Badge de estado
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 10,
                                vertical: 4,
                              ),
                              decoration: BoxDecoration(
                                color: gradeColor.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(gradeIcon, color: gradeColor, size: 14),
                                  const SizedBox(width: 4),
                                  Text(
                                    gradeLabel,
                                    style: TextStyle(
                                      color: gradeColor,
                                      fontWeight: FontWeight.w600,
                                      fontSize: 12,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 16),
                      // Nota grande
                      Container(
                        width: 64,
                        height: 64,
                        decoration: BoxDecoration(
                          color: gradeColor,
                          borderRadius: BorderRadius.circular(14),
                          boxShadow: [
                            BoxShadow(
                              color: gradeColor.withOpacity(0.3),
                              blurRadius: 8,
                              offset: const Offset(0, 4),
                            ),
                          ],
                        ),
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text(
                              grade.nota.toStringAsFixed(1),
                              style: const TextStyle(
                                color: Colors.white,
                                fontWeight: FontWeight.bold,
                                fontSize: 22,
                              ),
                            ),
                            const Text(
                              'Nota',
                              style: TextStyle(
                                color: Colors.white70,
                                fontSize: 10,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
