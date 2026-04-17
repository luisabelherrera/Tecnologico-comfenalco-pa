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
  String _selectedDay = 'Todos';

  // Colores del tema
  static const Color _primaryColor = Color(0xFF6366F1);
  static const Color _primaryDark = Color(0xFF4F46E5);
  static const Color _surfaceColor = Color(0xFFF8FAFC);
  static const Color _cardColor = Colors.white;
  static const Color _textPrimary = Color(0xFF1E293B);
  static const Color _textSecondary = Color(0xFF64748B);
  static const Color _borderColor = Color(0xFFE2E8F0);
  static const Color _dangerColor = Color(0xFFEF4444);

  // Dias de la semana
  static const List<String> _daysOfWeek = [
    'Todos',
    'Lunes',
    'Martes',
    'Miercoles',
    'Jueves',
    'Viernes',
  ];

  // Colores por dia
  static const Map<String, Color> _dayColors = {
    'lunes': Color(0xFF6366F1),
    'martes': Color(0xFF0EA5E9),
    'miercoles': Color(0xFF10B981),
    'miércoles': Color(0xFF10B981),
    'jueves': Color(0xFFF59E0B),
    'viernes': Color(0xFFEC4899),
    'sabado': Color(0xFF8B5CF6),
    'sábado': Color(0xFF8B5CF6),
    'domingo': Color(0xFF64748B),
  };

  @override
  void initState() {
    super.initState();
    _horariosFuture = _fetchHorarios();
  }

  Future<List<HorarioModel>> _fetchHorarios() async {
    final data = await _apiService.getAllHorarios();
    return data.map((json) => HorarioModel.fromJson(json)).toList();
  }

  void _refreshHorarios() {
    setState(() {
      _horariosFuture = _fetchHorarios();
    });
  }

  List<HorarioModel> _filterByDay(List<HorarioModel> horarios) {
    if (_selectedDay == 'Todos') return horarios;
    return horarios.where((h) {
      final day = h.diaSemana.toLowerCase().replaceAll('é', 'e');
      final selected = _selectedDay.toLowerCase().replaceAll('é', 'e');
      return day == selected;
    }).toList();
  }

  Color _getDayColor(String day) {
    return _dayColors[day.toLowerCase()] ?? _textSecondary;
  }

  IconData _getSubjectIcon(String subject) {
    final lowerSubject = subject.toLowerCase();
    if (lowerSubject.contains('matematica') || lowerSubject.contains('matemática')) {
      return Icons.calculate_rounded;
    } else if (lowerSubject.contains('ciencia') || lowerSubject.contains('fisica') || lowerSubject.contains('quimica')) {
      return Icons.science_rounded;
    } else if (lowerSubject.contains('lengua') || lowerSubject.contains('español') || lowerSubject.contains('literatura')) {
      return Icons.menu_book_rounded;
    } else if (lowerSubject.contains('ingles') || lowerSubject.contains('inglés')) {
      return Icons.language_rounded;
    } else if (lowerSubject.contains('historia') || lowerSubject.contains('geografia')) {
      return Icons.public_rounded;
    } else if (lowerSubject.contains('arte') || lowerSubject.contains('musica') || lowerSubject.contains('danza')) {
      return Icons.palette_rounded;
    } else if (lowerSubject.contains('educacion fisica') || lowerSubject.contains('deporte')) {
      return Icons.sports_soccer_rounded;
    } else if (lowerSubject.contains('computacion') || lowerSubject.contains('informatica')) {
      return Icons.computer_rounded;
    }
    return Icons.school_rounded;
  }

  String _formatTime(String time) {
    if (time.length >= 5) return time.substring(0, 5);
    return time;
  }

  String _getCurrentDayName() {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miercoles', 'Jueves', 'Viernes', 'Sabado'];
    return days[DateTime.now().weekday % 7];
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _surfaceColor,
      body: SafeArea(
        child: Column(
          children: [
            // Header con gradiente
            Container(
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [_primaryDark, _primaryColor],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
              child: Column(
                children: [
                  // Top bar
                  Padding(
                    padding: const EdgeInsets.fromLTRB(8, 8, 16, 0),
                    child: Row(
                      children: [
                        IconButton(
                          onPressed: () => Navigator.pop(context),
                          icon: const Icon(Icons.arrow_back_ios_new, size: 20),
                          color: Colors.white,
                        ),
                        const Spacer(),
                        Container(
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.15),
                            borderRadius: BorderRadius.circular(10),
                          ),
                          child: IconButton(
                            onPressed: _refreshHorarios,
                            icon: const Icon(Icons.refresh_rounded, size: 20),
                            color: Colors.white,
                            tooltip: 'Actualizar horarios',
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Title section
                  Padding(
                    padding: const EdgeInsets.fromLTRB(20, 12, 20, 20),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: const Icon(
                            Icons.calendar_month_rounded,
                            color: Colors.white,
                            size: 28,
                          ),
                        ),
                        const SizedBox(width: 16),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              const Text(
                                'Mi Horario',
                                style: TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Row(
                                children: [
                                  Container(
                                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                    decoration: BoxDecoration(
                                      color: Colors.white.withOpacity(0.2),
                                      borderRadius: BorderRadius.circular(6),
                                    ),
                                    child: Text(
                                      'Hoy: ${_getCurrentDayName()}',
                                      style: const TextStyle(
                                        fontSize: 12,
                                        fontWeight: FontWeight.w500,
                                        color: Colors.white,
                                      ),
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

                  // Day filter chips
                  SizedBox(
                    height: 44,
                    child: ListView.builder(
                      scrollDirection: Axis.horizontal,
                      padding: const EdgeInsets.symmetric(horizontal: 16),
                      itemCount: _daysOfWeek.length,
                      itemBuilder: (context, index) {
                        final day = _daysOfWeek[index];
                        final isSelected = _selectedDay == day;
                        return Padding(
                          padding: const EdgeInsets.only(right: 8),
                          child: InkWell(
                            onTap: () => setState(() => _selectedDay = day),
                            borderRadius: BorderRadius.circular(20),
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                              decoration: BoxDecoration(
                                color: isSelected ? Colors.white : Colors.white.withOpacity(0.15),
                                borderRadius: BorderRadius.circular(20),
                                border: Border.all(
                                  color: isSelected ? Colors.white : Colors.transparent,
                                  width: 2,
                                ),
                              ),
                              child: Text(
                                day,
                                style: TextStyle(
                                  fontSize: 13,
                                  fontWeight: FontWeight.w600,
                                  color: isSelected ? _primaryColor : Colors.white,
                                ),
                              ),
                            ),
                          ),
                        );
                      },
                    ),
                  ),

                  const SizedBox(height: 20),
                ],
              ),
            ),

            // Schedule List
            Expanded(
              child: FutureBuilder<List<HorarioModel>>(
                future: _horariosFuture,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const CircularProgressIndicator(color: _primaryColor),
                          const SizedBox(height: 16),
                          Text(
                            'Cargando horarios...',
                            style: TextStyle(color: _textSecondary, fontSize: 14),
                          ),
                        ],
                      ),
                    );
                  }

                  if (snapshot.hasError) {
                    return _buildEmptyState(
                      icon: Icons.error_outline_rounded,
                      title: 'Error al cargar',
                      subtitle: 'No se pudieron cargar los horarios',
                      color: _dangerColor,
                      showRetry: true,
                    );
                  }

                  if (!snapshot.hasData || snapshot.data!.isEmpty) {
                    return _buildEmptyState(
                      icon: Icons.calendar_today_rounded,
                      title: 'Sin horarios',
                      subtitle: 'No hay horarios registrados aun',
                      color: _textSecondary,
                    );
                  }

                  final schedules = _filterByDay(snapshot.data!);

                  if (schedules.isEmpty) {
                    return _buildEmptyState(
                      icon: Icons.event_busy_rounded,
                      title: 'Sin clases',
                      subtitle: 'No hay clases programadas para $_selectedDay',
                      color: _textSecondary,
                    );
                  }

                  // Agrupar por dia
                  final groupedSchedules = <String, List<HorarioModel>>{};
                  for (var schedule in schedules) {
                    final day = schedule.diaSemana;
                    groupedSchedules.putIfAbsent(day, () => []);
                    groupedSchedules[day]!.add(schedule);
                  }

                  // Ordenar por hora dentro de cada dia
                  for (var daySchedules in groupedSchedules.values) {
                    daySchedules.sort((a, b) => a.horaInicio.compareTo(b.horaInicio));
                  }

                  return ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: groupedSchedules.length,
                    itemBuilder: (context, index) {
                      final day = groupedSchedules.keys.elementAt(index);
                      final daySchedules = groupedSchedules[day]!;
                      return _buildDaySection(day, daySchedules);
                    },
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState({
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
    bool showRetry = false,
  }) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: color.withOpacity(0.1),
              shape: BoxShape.circle,
            ),
            child: Icon(icon, size: 40, color: color),
          ),
          const SizedBox(height: 20),
          Text(
            title,
            style: const TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w600,
              color: _textPrimary,
            ),
          ),
          const SizedBox(height: 8),
          Text(
            subtitle,
            style: const TextStyle(
              fontSize: 13,
              color: _textSecondary,
            ),
          ),
          if (showRetry) ...[
            const SizedBox(height: 20),
            ElevatedButton.icon(
              onPressed: _refreshHorarios,
              icon: const Icon(Icons.refresh, size: 18),
              label: const Text('Reintentar'),
              style: ElevatedButton.styleFrom(
                backgroundColor: _primaryColor,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildDaySection(String day, List<HorarioModel> schedules) {
    final dayColor = _getDayColor(day);
    final isToday = day.toLowerCase().replaceAll('é', 'e') ==
        _getCurrentDayName().toLowerCase().replaceAll('é', 'e');

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Day header
        Padding(
          padding: const EdgeInsets.only(bottom: 12, top: 8),
          child: Row(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [dayColor.withOpacity(0.8), dayColor],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(10),
                  boxShadow: [
                    BoxShadow(
                      color: dayColor.withOpacity(0.3),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Row(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Icon(Icons.calendar_today_rounded, size: 14, color: Colors.white),
                    const SizedBox(width: 8),
                    Text(
                      day,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.bold,
                        color: Colors.white,
                      ),
                    ),
                  ],
                ),
              ),
              if (isToday) ...[
                const SizedBox(width: 10),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                  decoration: BoxDecoration(
                    color: _primaryColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: _primaryColor.withOpacity(0.3)),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.today_rounded, size: 12, color: _primaryColor),
                      SizedBox(width: 4),
                      Text(
                        'HOY',
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                          color: _primaryColor,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
              const Spacer(),
              Text(
                '${schedules.length} ${schedules.length == 1 ? 'clase' : 'clases'}',
                style: const TextStyle(
                  fontSize: 12,
                  color: _textSecondary,
                ),
              ),
            ],
          ),
        ),

        // Schedule cards
        ...schedules.map((schedule) => _buildScheduleCard(schedule, dayColor)),

        const SizedBox(height: 8),
      ],
    );
  }

  Widget _buildScheduleCard(HorarioModel schedule, Color dayColor) {
    final subjectIcon = _getSubjectIcon(schedule.cursoDescripcion);
    final horaInicio = _formatTime(schedule.horaInicio);
    final horaFin = _formatTime(schedule.horaFin);

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: _cardColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: _borderColor),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Row(
        children: [
          // Barra lateral de color
          Container(
            width: 5,
            height: 90,
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [dayColor.withOpacity(0.8), dayColor],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
              borderRadius: const BorderRadius.only(
                topLeft: Radius.circular(16),
                bottomLeft: Radius.circular(16),
              ),
            ),
          ),

          // Contenido principal
          Expanded(
            child: Padding(
              padding: const EdgeInsets.all(14),
              child: Row(
                children: [
                  // Icono de la materia
                  Container(
                    width: 52,
                    height: 52,
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [dayColor.withOpacity(0.15), dayColor.withOpacity(0.08)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(14),
                    ),
                    child: Icon(
                      subjectIcon,
                      color: dayColor,
                      size: 26,
                    ),
                  ),

                  const SizedBox(width: 14),

                  // Informacion del horario
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          schedule.cursoDescripcion,
                          style: const TextStyle(
                            fontSize: 15,
                            fontWeight: FontWeight.bold,
                            color: _textPrimary,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 8),
                        Row(
                          children: [
                            // Hora
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                              decoration: BoxDecoration(
                                color: _surfaceColor,
                                borderRadius: BorderRadius.circular(8),
                                border: Border.all(color: _borderColor),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  Icon(
                                    Icons.access_time_rounded,
                                    size: 14,
                                    color: dayColor,
                                  ),
                                  const SizedBox(width: 6),
                                  Text(
                                    '$horaInicio - $horaFin',
                                    style: const TextStyle(
                                      fontSize: 12,
                                      fontWeight: FontWeight.w600,
                                      color: _textPrimary,
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

                  // Indicador de duracion
                  Container(
                    padding: const EdgeInsets.all(10),
                    decoration: BoxDecoration(
                      color: dayColor.withOpacity(0.08),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Icon(
                      Icons.arrow_forward_ios_rounded,
                      size: 14,
                      color: dayColor,
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