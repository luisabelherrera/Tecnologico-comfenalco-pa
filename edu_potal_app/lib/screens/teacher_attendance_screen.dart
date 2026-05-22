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
  String _searchQuery = '';
  bool _isSaving = false;

  // Colores del tema
  static const Color _primaryColor = Color(0xFF6366F1);
  static const Color _primaryDark = Color(0xFF4F46E5);
  static const Color _surfaceColor = Color(0xFFF8FAFC);
  static const Color _cardColor = Colors.white;
  static const Color _textPrimary = Color(0xFF1E293B);
  static const Color _textSecondary = Color(0xFF64748B);
  static const Color _borderColor = Color(0xFFE2E8F0);
  static const Color _successColor = Color(0xFF10B981);
  static const Color _dangerColor = Color(0xFFEF4444);

  // Colores para avatares
  static const List<Color> _avatarColors = [
    Color(0xFF6366F1),
    Color(0xFF10B981),
    Color(0xFFF59E0B),
    Color(0xFFEC4899),
    Color(0xFF8B5CF6),
    Color(0xFF06B6D4),
    Color(0xFF14B8A6),
    Color(0xFFEF4444),
  ];

  @override
  void initState() {
    super.initState();
    _studentsFuture = _loadStudents();
  }

  Future<List<Map<String, dynamic>>> _loadStudents() async {
    final profile = await _apiService.getUserProfile();
    final idDocente = (profile != null && profile['docente'] != null)
        ? profile['docente']['idDocente'] as int?
        : null;

    if (idDocente == null) {
      return [];
    }

    // Obtener solo estudiantes del docente autenticado
    final data = await _apiService.getEstudiantesByDocente(idDocente);
    return data.map<Map<String, dynamic>>((e) {
      final nombres = e['nombres'] ?? '';
      final apellidos = e['apellidos'] ?? '';
      return {
        'id': e['idEstudiante'] ?? e['id'],
        'name': '$nombres $apellidos'.trim(),
        'nombres': nombres,
        'apellidos': apellidos,
        'codigo': e['codigo'] ?? '',
        'present': true,
      };
    }).toList();
  }

  List<Map<String, dynamic>> _filterStudents(List<Map<String, dynamic>> students) {
    if (_searchQuery.isEmpty) return students;
    return students.where((student) {
      final name = (student['name'] ?? '').toString().toLowerCase();
      final codigo = (student['codigo'] ?? '').toString().toLowerCase();
      final query = _searchQuery.toLowerCase();
      return name.contains(query) || codigo.contains(query);
    }).toList();
  }

  int _presentCount(List<Map<String, dynamic>> students) =>
      students.where((s) => s['present'] == true).length;

  int _absentCount(List<Map<String, dynamic>> students) =>
      students.where((s) => s['present'] == false).length;

  String _getInitials(Map<String, dynamic> student) {
    final nombres = student['nombres'] ?? '';
    final apellidos = student['apellidos'] ?? '';
    if (nombres.isNotEmpty && apellidos.isNotEmpty) {
      return '${nombres[0]}${apellidos[0]}'.toUpperCase();
    }
    return 'ST';
  }

  void _showSnackBar(String message, {bool isError = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(
              isError ? Icons.error_outline : Icons.check_circle_outline,
              color: Colors.white,
              size: 20,
            ),
            const SizedBox(width: 12),
            Expanded(child: Text(message)),
          ],
        ),
        backgroundColor: isError ? _dangerColor : _successColor,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        margin: const EdgeInsets.all(16),
      ),
    );
  }

  Future<void> _guardarAsistencia(List<Map<String, dynamic>> students) async {
    setState(() => _isSaving = true);

    final today = DateTime.now().toIso8601String().split('T').first;
    int saved = 0;
    int errors = 0;

    for (final s in students) {
      final payload = {
        'estudiante': {'idEstudiante': s['id']},
        'nivelDetalleCurso': {'idNivelDetalleCurso': 1},
        'asistio': s['present'],
        'fecha': today,
      };
      final ok = await _apiService.registrarAsistencia(payload);
      if (ok) {
        saved++;
      } else {
        errors++;
      }
    }

    setState(() => _isSaving = false);

    if (mounted) {
      if (errors > 0) {
        _showSnackBar('Guardados: $saved | Errores: $errors', isError: true);
      } else {
        _showSnackBar('Asistencia guardada correctamente ($saved registros)');
        Future.delayed(const Duration(milliseconds: 800), () {
          if (mounted) Navigator.pop(context);
        });
      }
    }
  }

  void _markAllPresent(List<Map<String, dynamic>> students, StateSetter setInnerState) {
    setInnerState(() {
      for (var s in students) {
        s['present'] = true;
      }
    });
    setState(() {});
  }

  void _markAllAbsent(List<Map<String, dynamic>> students, StateSetter setInnerState) {
    setInnerState(() {
      for (var s in students) {
        s['present'] = false;
      }
    });
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return FutureBuilder<List<Map<String, dynamic>>>(
      future: _studentsFuture,
      builder: (context, snapshot) {
        final allStudents = snapshot.data ?? [];
        final students = _filterStudents(allStudents);

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
                            // Fecha actual
                            Container(
                              padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                              decoration: BoxDecoration(
                                color: Colors.white.withOpacity(0.15),
                                borderRadius: BorderRadius.circular(20),
                              ),
                              child: Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  const Icon(Icons.calendar_today_rounded, size: 14, color: Colors.white),
                                  const SizedBox(width: 6),
                                  Text(
                                    _formatDate(DateTime.now()),
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 12,
                                      fontWeight: FontWeight.w500,
                                    ),
                                  ),
                                ],
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
                                Icons.fact_check_rounded,
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
                                    'Tomar Asistencia',
                                    style: TextStyle(
                                      fontSize: 24,
                                      fontWeight: FontWeight.bold,
                                      color: Colors.white,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    '${allStudents.length} estudiantes registrados',
                                    style: TextStyle(
                                      fontSize: 14,
                                      color: Colors.white.withOpacity(0.8),
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Stats cards
                      if (snapshot.connectionState != ConnectionState.waiting)
                        Padding(
                          padding: const EdgeInsets.fromLTRB(20, 0, 20, 16),
                          child: Row(
                            children: [
                              _buildStatCard(
                                icon: Icons.check_circle_rounded,
                                label: 'Presentes',
                                count: _presentCount(allStudents),
                                color: _successColor,
                              ),
                              const SizedBox(width: 12),
                              _buildStatCard(
                                icon: Icons.cancel_rounded,
                                label: 'Ausentes',
                                count: _absentCount(allStudents),
                                color: _dangerColor,
                              ),
                              const SizedBox(width: 12),
                              _buildStatCard(
                                icon: Icons.people_rounded,
                                label: 'Total',
                                count: allStudents.length,
                                color: Colors.white,
                              ),
                            ],
                          ),
                        ),

                      // Search bar
                      Padding(
                        padding: const EdgeInsets.fromLTRB(20, 0, 20, 20),
                        child: Container(
                          decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(14),
                            boxShadow: [
                              BoxShadow(
                                color: Colors.black.withOpacity(0.1),
                                blurRadius: 10,
                                offset: const Offset(0, 4),
                              ),
                            ],
                          ),
                          child: TextField(
                            onChanged: (value) => setState(() => _searchQuery = value),
                            style: const TextStyle(color: _textPrimary, fontSize: 14),
                            decoration: InputDecoration(
                              hintText: 'Buscar estudiante...',
                              hintStyle: const TextStyle(color: _textSecondary, fontSize: 14),
                              prefixIcon: const Icon(Icons.search, color: _textSecondary, size: 20),
                              suffixIcon: _searchQuery.isNotEmpty
                                  ? IconButton(
                                onPressed: () => setState(() => _searchQuery = ''),
                                icon: const Icon(Icons.close, color: _textSecondary, size: 18),
                              )
                                  : null,
                              border: InputBorder.none,
                              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),

                // Quick actions bar
                if (snapshot.data != null && snapshot.data!.isNotEmpty)
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
                    color: _cardColor,
                    child: StatefulBuilder(
                      builder: (context, setInnerState) {
                        return Row(
                          children: [
                            const Text(
                              'Acciones rapidas:',
                              style: TextStyle(
                                color: _textSecondary,
                                fontSize: 12,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                            const SizedBox(width: 12),
                            _buildQuickActionChip(
                              label: 'Todos presentes',
                              icon: Icons.check_circle_outline,
                              color: _successColor,
                              onTap: () => _markAllPresent(allStudents, setInnerState),
                            ),
                            const SizedBox(width: 8),
                            _buildQuickActionChip(
                              label: 'Todos ausentes',
                              icon: Icons.cancel_outlined,
                              color: _dangerColor,
                              onTap: () => _markAllAbsent(allStudents, setInnerState),
                            ),
                          ],
                        );
                      },
                    ),
                  ),

                Container(height: 1, color: _borderColor),

                // Students List
                Expanded(
                  child: snapshot.connectionState == ConnectionState.waiting
                      ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const CircularProgressIndicator(color: _primaryColor),
                        const SizedBox(height: 16),
                        Text(
                          'Cargando estudiantes...',
                          style: TextStyle(color: _textSecondary, fontSize: 14),
                        ),
                      ],
                    ),
                  )
                      : snapshot.hasError
                      ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(16),
                          decoration: BoxDecoration(
                            color: _dangerColor.withOpacity(0.1),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(Icons.error_outline, color: _dangerColor, size: 32),
                        ),
                        const SizedBox(height: 16),
                        const Text(
                          'Error al cargar estudiantes',
                          style: TextStyle(
                            color: _textPrimary,
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 20),
                        ElevatedButton.icon(
                          onPressed: () {
                            setState(() {
                              _studentsFuture = _loadStudents();
                            });
                          },
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
                    ),
                  )
                      : students.isEmpty
                      ? Center(
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Container(
                          padding: const EdgeInsets.all(20),
                          decoration: BoxDecoration(
                            color: _primaryColor.withOpacity(0.1),
                            shape: BoxShape.circle,
                          ),
                          child: const Icon(
                            Icons.person_search_outlined,
                            color: _primaryColor,
                            size: 40,
                          ),
                        ),
                        const SizedBox(height: 20),
                        Text(
                          _searchQuery.isEmpty
                              ? 'No hay estudiantes registrados'
                              : 'No se encontraron resultados',
                          style: const TextStyle(
                            color: _textPrimary,
                            fontSize: 16,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 8),
                        Text(
                          _searchQuery.isEmpty
                              ? 'Los estudiantes apareceran aqui'
                              : 'Intenta con otro termino',
                          style: const TextStyle(color: _textSecondary, fontSize: 13),
                        ),
                      ],
                    ),
                  )
                      : StatefulBuilder(
                    builder: (context, setInnerState) {
                      return ListView.builder(
                        padding: const EdgeInsets.all(16),
                        itemCount: students.length,
                        itemBuilder: (context, index) {
                          final student = students[index];
                          final originalIndex = allStudents.indexOf(student);
                          return _buildStudentCard(
                            student: student,
                            index: originalIndex,
                            students: allStudents,
                            setInnerState: setInnerState,
                            avatarColor: _avatarColors[originalIndex % _avatarColors.length],
                          );
                        },
                      );
                    },
                  ),
                ),
              ],
            ),
          ),

          // FAB
          floatingActionButton: snapshot.data != null && snapshot.data!.isNotEmpty
              ? FloatingActionButton.extended(
            onPressed: _isSaving ? null : () => _guardarAsistencia(snapshot.data!),
            backgroundColor: _isSaving ? _textSecondary : _primaryColor,
            elevation: 4,
            icon: _isSaving
                ? const SizedBox(
              width: 20,
              height: 20,
              child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2),
            )
                : const Icon(Icons.save_rounded, color: Colors.white),
            label: Text(
              _isSaving ? 'Guardando...' : 'Guardar Asistencia',
              style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
            ),
          )
              : null,
        );
      },
    );
  }

  String _formatDate(DateTime date) {
    const months = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun',
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];
    return '${date.day} ${months[date.month - 1]} ${date.year}';
  }

  Widget _buildStatCard({
    required IconData icon,
    required String label,
    required int count,
    required Color color,
  }) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 10),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.15),
          borderRadius: BorderRadius.circular(14),
          border: Border.all(color: Colors.white.withOpacity(0.1)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color, size: 24),
            const SizedBox(height: 8),
            Text(
              count.toString(),
              style: const TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.bold,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: TextStyle(
                fontSize: 11,
                color: Colors.white.withOpacity(0.8),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickActionChip({
    required String label,
    required IconData icon,
    required Color color,
    required VoidCallback onTap,
  }) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(20),
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        decoration: BoxDecoration(
          color: color.withOpacity(0.1),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: color.withOpacity(0.3)),
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(icon, size: 14, color: color),
            const SizedBox(width: 6),
            Text(
              label,
              style: TextStyle(
                fontSize: 11,
                fontWeight: FontWeight.w600,
                color: color,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStudentCard({
    required Map<String, dynamic> student,
    required int index,
    required List<Map<String, dynamic>> students,
    required StateSetter setInnerState,
    required Color avatarColor,
  }) {
    final isPresent = student['present'] as bool;
    final initials = _getInitials(student);
    final studentName = student['name'] as String;
    final studentCode = student['codigo'] as String;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: _cardColor,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: isPresent
              ? _successColor.withOpacity(0.3)
              : _dangerColor.withOpacity(0.3),
          width: 2,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            // Avatar con iniciales
            Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [
                    avatarColor.withOpacity(0.8),
                    avatarColor,
                  ],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(14),
                boxShadow: [
                  BoxShadow(
                    color: avatarColor.withOpacity(0.3),
                    blurRadius: 8,
                    offset: const Offset(0, 4),
                  ),
                ],
              ),
              child: Center(
                child: Text(
                  initials,
                  style: const TextStyle(
                    color: Colors.white,
                    fontSize: 18,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ),

            const SizedBox(width: 14),

            // Info del estudiante
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    studentName,
                    style: const TextStyle(
                      fontWeight: FontWeight.w600,
                      fontSize: 15,
                      color: _textPrimary,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Row(
                    children: [
                      // Codigo
                      if (studentCode.isNotEmpty)
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: _surfaceColor,
                            borderRadius: BorderRadius.circular(6),
                            border: Border.all(color: _borderColor),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(Icons.badge_outlined, size: 12, color: _textSecondary),
                              const SizedBox(width: 4),
                              Text(
                                studentCode,
                                style: const TextStyle(
                                  fontSize: 11,
                                  color: _textSecondary,
                                  fontWeight: FontWeight.w500,
                                ),
                              ),
                            ],
                          ),
                        ),
                      const SizedBox(width: 8),
                      // Estado
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                        decoration: BoxDecoration(
                          color: isPresent
                              ? _successColor.withOpacity(0.1)
                              : _dangerColor.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              isPresent ? Icons.check_circle : Icons.cancel,
                              size: 12,
                              color: isPresent ? _successColor : _dangerColor,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              isPresent ? 'Presente' : 'Ausente',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w600,
                                color: isPresent ? _successColor : _dangerColor,
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

            const SizedBox(width: 12),

            // Toggle de asistencia
            GestureDetector(
              onTap: () {
                setInnerState(() => students[index]['present'] = !isPresent);
                setState(() {});
              },
              child: Container(
                width: 60,
                height: 34,
                decoration: BoxDecoration(
                  color: isPresent
                      ? _successColor.withOpacity(0.15)
                      : _dangerColor.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(17),
                  border: Border.all(
                    color: isPresent
                        ? _successColor.withOpacity(0.3)
                        : _dangerColor.withOpacity(0.3),
                    width: 2,
                  ),
                ),
                child: Stack(
                  children: [
                    AnimatedPositioned(
                      duration: const Duration(milliseconds: 200),
                      curve: Curves.easeInOut,
                      left: isPresent ? 30 : 4,
                      top: 4,
                      child: Container(
                        width: 26,
                        height: 26,
                        decoration: BoxDecoration(
                          color: isPresent ? _successColor : _dangerColor,
                          borderRadius: BorderRadius.circular(13),
                          boxShadow: [
                            BoxShadow(
                              color: (isPresent ? _successColor : _dangerColor).withOpacity(0.4),
                              blurRadius: 6,
                              offset: const Offset(0, 2),
                            ),
                          ],
                        ),
                        child: Icon(
                          isPresent ? Icons.check_rounded : Icons.close_rounded,
                          color: Colors.white,
                          size: 16,
                        ),
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