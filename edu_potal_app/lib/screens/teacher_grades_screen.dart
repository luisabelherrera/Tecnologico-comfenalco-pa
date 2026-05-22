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
  String _searchQuery = '';

  // Map de controllers. Key = idEstudiante
  final Map<int, TextEditingController> _gradeControllers = {};
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
  static const Color _warningColor = Color(0xFFF59E0B);

  @override
  void initState() {
    super.initState();
    _studentsFuture = _getFilteredStudents();
  }

  Future<List<dynamic>> _getFilteredStudents() async {
    final profile = await _apiService.getUserProfile();
    final idDocente = (profile != null && profile['docente'] != null)
        ? profile['docente']['idDocente'] as int?
        : null;

    if (idDocente == null) {
      return [];
    }

    // Usar método filtrado por seguridad
    return _apiService.getEstudiantesByDocente(idDocente);
  }

  @override
  void dispose() {
    for (var controller in _gradeControllers.values) {
      controller.dispose();
    }
    super.dispose();
  }

  void _refreshStudents() {
    setState(() {
      _studentsFuture = _apiService.getAllEstudiantes();
    });
  }

  List<dynamic> _filterStudents(List<dynamic> students) {
    if (_searchQuery.isEmpty) return students;
    return students.where((student) {
      final nombres = (student['nombres'] ?? '').toString().toLowerCase();
      final apellidos = (student['apellidos'] ?? '').toString().toLowerCase();
      final codigo = (student['codigo'] ?? '').toString().toLowerCase();
      final query = _searchQuery.toLowerCase();
      return nombres.contains(query) ||
          apellidos.contains(query) ||
          codigo.contains(query);
    }).toList();
  }

  int _getGradesCount() {
    int count = 0;
    for (var controller in _gradeControllers.values) {
      if (controller.text.isNotEmpty) count++;
    }
    return count;
  }

  void _showSnackBar(String message, {bool isError = false, bool isWarning = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(
              isError
                  ? Icons.error_outline
                  : isWarning
                  ? Icons.warning_amber_rounded
                  : Icons.check_circle_outline,
              color: Colors.white,
              size: 20,
            ),
            const SizedBox(width: 12),
            Expanded(child: Text(message)),
          ],
        ),
        backgroundColor: isError
            ? _dangerColor
            : isWarning
            ? _warningColor
            : _successColor,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        margin: const EdgeInsets.all(16),
      ),
    );
  }

  Future<void> _saveGrades() async {
    final gradesCount = _getGradesCount();
    if (gradesCount == 0) {
      _showSnackBar('No hay notas para guardar', isWarning: true);
      return;
    }

    setState(() => _isSaving = true);
    int savedCount = 0;
    int errorCount = 0;

    try {
      for (var entry in _gradeControllers.entries) {
        final text = entry.value.text;
        if (text.isNotEmpty) {
          final nota = double.tryParse(text);
          if (nota != null) {
            if (nota < 0 || nota > 10) {
              errorCount++;
              continue;
            }
            final data = {
              "curricular": {"idCurricular": 1},
              "estudiante": {"idEstudiante": entry.key},
              "nota": nota,
              "activo": true
            };
            await _apiService.createEntity('/calificaciones', data);
            savedCount++;
          } else {
            errorCount++;
          }
        }
      }

      if (mounted) {
        if (errorCount > 0) {
          _showSnackBar(
            'Guardadas: $savedCount | Errores: $errorCount',
            isWarning: true,
          );
        } else {
          _showSnackBar('Se guardaron $savedCount calificaciones correctamente');
        }
      }
    } catch (e) {
      if (mounted) {
        _showSnackBar('Error al guardar las calificaciones', isError: true);
      }
    } finally {
      if (mounted) setState(() => _isSaving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: _surfaceColor,
      body: SafeArea(
        child: Column(
          children: [
            // Header
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
                            onPressed: _refreshStudents,
                            icon: const Icon(Icons.refresh_rounded, size: 20),
                            color: Colors.white,
                            tooltip: 'Actualizar lista',
                          ),
                        ),
                      ],
                    ),
                  ),

                  // Title section
                  Padding(
                    padding: const EdgeInsets.fromLTRB(20, 8, 20, 20),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(14),
                          decoration: BoxDecoration(
                            color: Colors.white.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: const Icon(
                            Icons.grading_rounded,
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
                                'Gestion de Notas',
                                style: TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                              ),
                              const SizedBox(height: 4),
                              FutureBuilder<List<dynamic>>(
                                future: _studentsFuture,
                                builder: (context, snapshot) {
                                  final count = snapshot.data?.length ?? 0;
                                  return Text(
                                    '$count estudiantes disponibles',
                                    style: TextStyle(
                                      fontSize: 14,
                                      color: Colors.white.withOpacity(0.8),
                                    ),
                                  );
                                },
                              ),
                            ],
                          ),
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

            // Stats bar
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
              color: _cardColor,
              child: Row(
                children: [
                  _buildStatChip(
                    icon: Icons.edit_note_rounded,
                    label: 'Notas ingresadas',
                    value: '${_getGradesCount()}',
                    color: _primaryColor,
                  ),
                  const SizedBox(width: 12),
                  _buildStatChip(
                    icon: Icons.pending_outlined,
                    label: 'Pendientes',
                    value: '${(_gradeControllers.length - _getGradesCount()).clamp(0, 999)}',
                    color: _warningColor,
                  ),
                ],
              ),
            ),

            Container(height: 1, color: _borderColor),

            // Students List
            Expanded(
              child: FutureBuilder<List<dynamic>>(
                future: _studentsFuture,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return Center(
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
                    );
                  }

                  if (snapshot.hasError) {
                    return Center(
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
                            onPressed: _refreshStudents,
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
                    );
                  }

                  final students = _filterStudents(snapshot.data ?? []);

                  if (students.isEmpty) {
                    return Center(
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
                              Icons.school_outlined,
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
                                : 'Intenta con otro termino de busqueda',
                            style: const TextStyle(color: _textSecondary, fontSize: 13),
                          ),
                        ],
                      ),
                    );
                  }

                  return ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: students.length,
                    itemBuilder: (context, index) {
                      final student = students[index];
                      final nombres = student['nombres'] ?? '';
                      final apellidos = student['apellidos'] ?? '';
                      final codigo = student['codigo'] ?? 'Sin codigo';
                      final initials = (nombres.isNotEmpty && apellidos.isNotEmpty)
                          ? '${nombres[0]}${apellidos[0]}'.toUpperCase()
                          : 'ST';
                      final idEstudiante = student['idEstudiante'] ?? student['id'] ?? 0;

                      if (!_gradeControllers.containsKey(idEstudiante)) {
                        _gradeControllers[idEstudiante] = TextEditingController();
                      }

                      return _buildStudentCard(
                        studentName: '$nombres $apellidos'.trim(),
                        studentCode: codigo,
                        initials: initials,
                        controller: _gradeControllers[idEstudiante]!,
                        index: index,
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
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _isSaving ? null : _saveGrades,
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
          _isSaving ? 'Guardando...' : 'Guardar Notas',
          style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w600),
        ),
      ),
    );
  }

  Widget _buildStatChip({
    required IconData icon,
    required String label,
    required String value,
    required Color color,
  }) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
        decoration: BoxDecoration(
          color: color.withOpacity(0.08),
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: color.withOpacity(0.2)),
        ),
        child: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: color.withOpacity(0.15),
                borderRadius: BorderRadius.circular(8),
              ),
              child: Icon(icon, color: color, size: 16),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    value,
                    style: TextStyle(
                      color: color,
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Text(
                    label,
                    style: const TextStyle(
                      color: _textSecondary,
                      fontSize: 10,
                    ),
                    overflow: TextOverflow.ellipsis,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildStudentCard({
    required String studentName,
    required String studentCode,
    required String initials,
    required TextEditingController controller,
    required int index,
  }) {
    final hasGrade = controller.text.isNotEmpty;
    final gradeValue = double.tryParse(controller.text);
    final isValidGrade = gradeValue != null && gradeValue >= 0 && gradeValue <= 10;

    // Colores alternados para avatares
    final avatarColors = [
      const Color(0xFF6366F1), // Indigo
      const Color(0xFF10B981), // Emerald
      const Color(0xFFF59E0B), // Amber
      const Color(0xFFEC4899), // Pink
      const Color(0xFF8B5CF6), // Violet
    ];
    final avatarColor = avatarColors[index % avatarColors.length];

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: _cardColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(
          color: hasGrade
              ? (isValidGrade ? _successColor.withOpacity(0.3) : _dangerColor.withOpacity(0.3))
              : _borderColor,
          width: hasGrade ? 2 : 1,
        ),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Row(
          children: [
            // Avatar
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

            // Info
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
                  const SizedBox(height: 4),
                  Row(
                    children: [
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
                            const Icon(
                              Icons.badge_outlined,
                              size: 12,
                              color: _textSecondary,
                            ),
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
                      if (hasGrade) ...[
                        const SizedBox(width: 8),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: isValidGrade
                                ? _successColor.withOpacity(0.1)
                                : _dangerColor.withOpacity(0.1),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(
                                isValidGrade ? Icons.check_circle : Icons.error,
                                size: 12,
                                color: isValidGrade ? _successColor : _dangerColor,
                              ),
                              const SizedBox(width: 4),
                              Text(
                                isValidGrade ? 'Nota valida' : 'Nota invalida',
                                style: TextStyle(
                                  fontSize: 10,
                                  color: isValidGrade ? _successColor : _dangerColor,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(width: 12),

            // Grade Input
            SizedBox(
              width: 80,
              child: TextField(
                controller: controller,
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                textAlign: TextAlign.center,
                onChanged: (_) => setState(() {}),
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                  color: hasGrade
                      ? (isValidGrade ? _successColor : _dangerColor)
                      : _textPrimary,
                ),
                decoration: InputDecoration(
                  hintText: '0.0',
                  hintStyle: TextStyle(
                    color: _textSecondary.withOpacity(0.5),
                    fontWeight: FontWeight.normal,
                    fontSize: 16,
                  ),
                  filled: true,
                  fillColor: hasGrade
                      ? (isValidGrade
                      ? _successColor.withOpacity(0.05)
                      : _dangerColor.withOpacity(0.05))
                      : _surfaceColor,
                  contentPadding: const EdgeInsets.symmetric(vertical: 14, horizontal: 8),
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(
                      color: hasGrade
                          ? (isValidGrade ? _successColor : _dangerColor)
                          : _borderColor,
                    ),
                  ),
                  enabledBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: BorderSide(
                      color: hasGrade
                          ? (isValidGrade
                          ? _successColor.withOpacity(0.5)
                          : _dangerColor.withOpacity(0.5))
                          : _borderColor,
                      width: hasGrade ? 2 : 1,
                    ),
                  ),
                  focusedBorder: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(12),
                    borderSide: const BorderSide(color: _primaryColor, width: 2),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}