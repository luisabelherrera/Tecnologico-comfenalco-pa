import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'teacher_grades_screen.dart';

class TeacherCoursesScreen extends StatefulWidget {
  const TeacherCoursesScreen({super.key});

  @override
  State<TeacherCoursesScreen> createState() => _TeacherCoursesScreenState();
}

class _TeacherCoursesScreenState extends State<TeacherCoursesScreen> {
  final ApiService _apiService = ApiService();
  late Future<List<dynamic>> _coursesFuture;
  String _searchQuery = '';

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

  // Colores para las cards de cursos
  static const List<Color> _courseColors = [
    Color(0xFF6366F1), // Indigo
    Color(0xFF10B981), // Emerald
    Color(0xFFF59E0B), // Amber
    Color(0xFFEC4899), // Pink
    Color(0xFF8B5CF6), // Violet
    Color(0xFF06B6D4), // Cyan
    Color(0xFFEF4444), // Red
    Color(0xFF14B8A6), // Teal
  ];

  // Iconos para las materias
  static const List<IconData> _courseIcons = [
    Icons.calculate_rounded,
    Icons.science_rounded,
    Icons.history_edu_rounded,
    Icons.language_rounded,
    Icons.palette_rounded,
    Icons.sports_soccer_rounded,
    Icons.computer_rounded,
    Icons.music_note_rounded,
  ];

  @override
  void initState() {
    super.initState();
    _coursesFuture = _fetchAndFilterCourses();
  }

  Future<List<dynamic>> _fetchAndFilterCourses() async {
    final profile = await _apiService.getUserProfile();
    final idDocente = (profile != null && profile['docente'] != null)
        ? profile['docente']['idDocente'] as int?
        : null;

    if (idDocente == null) {
      return [];
    }

    // Usar el nuevo método filtrado (seguro y eficiente)
    return _apiService.getDocenteCursos(idDocente);
  }

  void _refreshCourses() {
    setState(() {
      _coursesFuture = _fetchAndFilterCourses();
    });
  }

  List<dynamic> _filterCourses(List<dynamic> courses) {
    if (_searchQuery.isEmpty) return courses;
    return courses.where((course) {
      final nivelDetalle = course['nivelDetalle'] ?? {};
      final nivel = nivelDetalle['nivel'] ?? {};
      final nombre = (nivel['nombre'] ?? '').toString().toLowerCase();
      final descripcion = (nivelDetalle['descripcion'] ?? '').toString().toLowerCase();
      final query = _searchQuery.toLowerCase();
      return nombre.contains(query) || descripcion.contains(query);
    }).toList();
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
                            onPressed: _refreshCourses,
                            icon: const Icon(Icons.refresh_rounded, size: 20),
                            color: Colors.white,
                            tooltip: 'Actualizar cursos',
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
                            Icons.school_rounded,
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
                                'Cursos Asignados',
                                style: TextStyle(
                                  fontSize: 24,
                                  fontWeight: FontWeight.bold,
                                  color: Colors.white,
                                ),
                              ),
                              const SizedBox(height: 4),
                              FutureBuilder<List<dynamic>>(
                                future: _coursesFuture,
                                builder: (context, snapshot) {
                                  final count = snapshot.data?.length ?? 0;
                                  return Text(
                                    '$count cursos activos',
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
                          hintText: 'Buscar curso...',
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

            // Courses List
            Expanded(
              child: FutureBuilder<List<dynamic>>(
                future: _coursesFuture,
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return Center(
                      child: Column(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          const CircularProgressIndicator(color: _primaryColor),
                          const SizedBox(height: 16),
                          Text(
                            'Cargando cursos...',
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
                            'Error al cargar cursos',
                            style: TextStyle(
                              color: _textPrimary,
                              fontSize: 16,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                          const SizedBox(height: 20),
                          ElevatedButton.icon(
                            onPressed: _refreshCourses,
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

                  final courses = _filterCourses(snapshot.data ?? []);

                  if (courses.isEmpty) {
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
                              Icons.menu_book_outlined,
                              color: _primaryColor,
                              size: 40,
                            ),
                          ),
                          const SizedBox(height: 20),
                          Text(
                            _searchQuery.isEmpty
                                ? 'No hay cursos asignados'
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
                                ? 'Los cursos apareceran aqui cuando sean asignados'
                                : 'Intenta con otro termino de busqueda',
                            style: const TextStyle(color: _textSecondary, fontSize: 13),
                            textAlign: TextAlign.center,
                          ),
                        ],
                      ),
                    );
                  }

                  return ListView.builder(
                    padding: const EdgeInsets.all(16),
                    itemCount: courses.length,
                    itemBuilder: (context, index) {
                      final course = courses[index];
                      final nivelDetalle = course['nivelDetalle'] ?? {};
                      final nivel = nivelDetalle['nivel'] ?? {};
                      final nombre = nivel['nombre'] ?? 'Curso';
                      final grado = nivelDetalle['descripcion'] ?? '';
                      final docente = course['docente'] ?? {};
                      final docenteNombre =
                      '${docente['nombres'] ?? ''} ${docente['apellidos'] ?? ''}'.trim();
                      final courseId = course['idDocenteNivelDetalleCurso'] ?? index;

                      final color = _courseColors[index % _courseColors.length];
                      final icon = _courseIcons[index % _courseIcons.length];

                      return _buildCourseCard(
                        courseName: nombre,
                        courseGrade: grado,
                        teacherName: docenteNombre.isNotEmpty ? docenteNombre : 'Sin asignar',
                        courseId: courseId.toString(),
                        icon: icon,
                        color: color,
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
    );
  }

  Widget _buildCourseCard({
    required String courseName,
    required String courseGrade,
    required String teacherName,
    required String courseId,
    required IconData icon,
    required Color color,
    required int index,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      decoration: BoxDecoration(
        color: _cardColor,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: _borderColor),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.04),
            blurRadius: 12,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(builder: (_) => const TeacherGradesScreen()),
            );
          },
          borderRadius: BorderRadius.circular(18),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                // Icon avatar con gradiente
                Container(
                  width: 60,
                  height: 60,
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        color.withOpacity(0.8),
                        color,
                      ],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: color.withOpacity(0.3),
                        blurRadius: 8,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Icon(
                    icon,
                    color: Colors.white,
                    size: 28,
                  ),
                ),

                const SizedBox(width: 16),

                // Course info
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Course name
                      Text(
                        courseName,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: _textPrimary,
                        ),
                      ),
                      const SizedBox(height: 6),

                      // Grade badge
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        decoration: BoxDecoration(
                          color: color.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          courseGrade,
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w600,
                            color: color,
                          ),
                        ),
                      ),
                      const SizedBox(height: 10),

                      // Details row
                      Row(
                        children: [
                          // Teacher
                          Expanded(
                            child: Row(
                              children: [
                                Container(
                                  padding: const EdgeInsets.all(4),
                                  decoration: BoxDecoration(
                                    color: _surfaceColor,
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: const Icon(
                                    Icons.person_outline_rounded,
                                    size: 14,
                                    color: _textSecondary,
                                  ),
                                ),
                                const SizedBox(width: 6),
                                Expanded(
                                  child: Text(
                                    teacherName,
                                    style: const TextStyle(
                                      fontSize: 12,
                                      color: _textSecondary,
                                    ),
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                              ],
                            ),
                          ),

                          const SizedBox(width: 12),

                          // Course ID
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                            decoration: BoxDecoration(
                              color: _surfaceColor,
                              borderRadius: BorderRadius.circular(6),
                              border: Border.all(color: _borderColor),
                            ),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                const Icon(
                                  Icons.tag_rounded,
                                  size: 12,
                                  color: _textSecondary,
                                ),
                                const SizedBox(width: 4),
                                Text(
                                  courseId,
                                  style: const TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w500,
                                    color: _textSecondary,
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

                const SizedBox(width: 8),

                // Arrow indicator
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: _surfaceColor,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Icon(
                    Icons.arrow_forward_ios_rounded,
                    size: 16,
                    color: _textSecondary,
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }
}