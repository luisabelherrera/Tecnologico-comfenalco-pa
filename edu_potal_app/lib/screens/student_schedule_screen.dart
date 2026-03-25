import 'package:flutter/material.dart';
import '../models/horario_model.dart';
import '../services/api_service.dart';

class StudentScheduleScreen extends StatefulWidget {
  const StudentScheduleScreen({super.key});

  @override
  State<StudentScheduleScreen> createState() => _StudentScheduleScreenState();
}

class _StudentScheduleScreenState extends State<StudentScheduleScreen> {
  final ApiService _apiService = ApiService();
  late Future<List<HorarioModel>> _horariosFuture;

  @override
  void initState() {
    super.initState();
    _horariosFuture = _fetchHorarios();
  }

  Future<List<HorarioModel>> _fetchHorarios() async {
    final data = await _apiService.getAllHorarios();
    return data.map((json) => HorarioModel.fromJson(json)).toList();
  }

  // Colores por día de la semana
  Color _getDayColor(String day) {
    switch (day.toLowerCase()) {
      case 'lunes':
        return const Color(0xFF4F46E5);
      case 'martes':
        return const Color(0xFF0EA5E9);
      case 'miércoles':
      case 'miercoles':
        return const Color(0xFF10B981);
      case 'jueves':
        return const Color(0xFFF59E0B);
      case 'viernes':
        return const Color(0xFFEC4899);
      default:
        return const Color(0xFF6B7280);
    }
  }

  IconData _getSubjectIcon(String subject) {
    final lowerSubject = subject.toLowerCase();
    if (lowerSubject.contains('matemáticas') || lowerSubject.contains('matematicas')) {
      return Icons.calculate_rounded;
    } else if (lowerSubject.contains('ciencias') || lowerSubject.contains('física') || lowerSubject.contains('química')) {
      return Icons.science_rounded;
    } else if (lowerSubject.contains('lengua') || lowerSubject.contains('español') || lowerSubject.contains('literatura')) {
      return Icons.menu_book_rounded;
    } else if (lowerSubject.contains('inglés') || lowerSubject.contains('ingles')) {
      return Icons.language_rounded;
    } else if (lowerSubject.contains('historia') || lowerSubject.contains('geografía')) {
      return Icons.public_rounded;
    } else if (lowerSubject.contains('arte') || lowerSubject.contains('música') || lowerSubject.contains('danza')) {
      return Icons.palette_rounded;
    } else if (lowerSubject.contains('educación física') || lowerSubject.contains('deportes')) {
      return Icons.sports_soccer_rounded;
    }
    return Icons.school_rounded;
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        elevation: 0,
        title: const Text(
          'Mi Horario',
          style: TextStyle(fontWeight: FontWeight.w600),
        ),
        backgroundColor: const Color(0xFF4F46E5),
        foregroundColor: Colors.white,
        centerTitle: true,
      ),
      body: Column(
        children: [
          // Header con información
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
                        'Semana Actual',
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),
                      SizedBox(height: 4),
                      Text(
                        'Revisa tus clases programadas',
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
                    Icons.calendar_month_rounded,
                    color: Colors.white,
                    size: 32,
                  ),
                ),
              ],
            ),
          ),
          // Lista de horarios
          Expanded(
            child: FutureBuilder<List<HorarioModel>>(
              future: _horariosFuture,
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: const [
                        CircularProgressIndicator(
                          valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF4F46E5)),
                        ),
                        SizedBox(height: 16),
                        Text(
                          'Cargando horarios...',
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
                    subtitle: 'No se pudieron cargar los horarios.',
                    color: const Color(0xFFEF4444),
                  );
                } else if (!snapshot.hasData || snapshot.data!.isEmpty) {
                  return _buildEmptyState(
                    icon: Icons.calendar_today_rounded,
                    title: 'Sin horarios',
                    subtitle: 'No hay horarios registrados aún.',
                    color: const Color(0xFF6B7280),
                  );
                }

                final schedules = snapshot.data!;
                return ListView.builder(
                  padding: const EdgeInsets.all(16.0),
                  itemCount: schedules.length,
                  itemBuilder: (context, index) {
                    final schedule = schedules[index];
                    return _buildScheduleCard(schedule);
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

  Widget _buildScheduleCard(HorarioModel schedule) {
    final dayColor = _getDayColor(schedule.diaSemana);
    final subjectIcon = _getSubjectIcon(schedule.cursoDescripcion);
    final horaInicio = schedule.horaInicio.substring(0, 5);
    final horaFin = schedule.horaFin.substring(0, 5);

    return Container(
      margin: const EdgeInsets.only(bottom: 12.0),
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
      child: Row(
        children: [
          // Barra lateral de color
          Container(
            width: 4,
            height: 90,
            decoration: BoxDecoration(
              color: dayColor,
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
              child: Row(
                children: [
                  // Icono de la materia
                  Container(
                    width: 50,
                    height: 50,
                    decoration: BoxDecoration(
                      color: dayColor.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: Icon(
                      subjectIcon,
                      color: dayColor,
                      size: 26,
                    ),
                  ),
                  const SizedBox(width: 14),
                  // Información del horario
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          schedule.cursoDescripcion,
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.bold,
                            color: Color(0xFF1F2937),
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 6),
                        Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 4,
                              ),
                              decoration: BoxDecoration(
                                color: dayColor.withOpacity(0.1),
                                borderRadius: BorderRadius.circular(6),
                              ),
                              child: Text(
                                schedule.diaSemana,
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w600,
                                  color: dayColor,
                                ),
                              ),
                            ),
                            const SizedBox(width: 8),
                            Icon(
                              Icons.access_time_rounded,
                              size: 14,
                              color: const Color(0xFF6B7280),
                            ),
                            const SizedBox(width: 4),
                            Text(
                              '$horaInicio - $horaFin',
                              style: const TextStyle(
                                fontSize: 13,
                                color: Color(0xFF6B7280),
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
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