import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import '../services/api_service.dart';
import 'login_screen.dart';
import 'news_screen.dart';
import 'teacher_courses_screen.dart';
import 'teacher_grades_screen.dart';
import 'ai_assistant_screen.dart';
import 'teacher_attendance_screen.dart';
import 'predictions_dashboard_screen.dart';
import 'chat_list_screen.dart';

class TeacherHomeScreen extends StatefulWidget {
  const TeacherHomeScreen({super.key});

  @override
  State<TeacherHomeScreen> createState() => _TeacherHomeScreenState();
}

class _TeacherHomeScreenState extends State<TeacherHomeScreen>
    with TickerProviderStateMixin {
  final _authService = AuthService();
  final _apiService = ApiService();

  String _teacherName = 'Docente';
  String _statCursos = '—';
  String _statEstudiantes = '—';
  String _statCalificaciones = '—';

  late AnimationController _headerAnim;
  late AnimationController _menuAnim;
  late Animation<double> _headerFade;

  // Paleta de colores coherente con el resto de la app
  static const _primaryDark = Color(0xFF0F2027);
  static const _primaryMid = Color(0xFF203A43);
  static const _primaryLight = Color(0xFF2C5364);
  static const _accentGold = Color(0xFFFFD700);
  static const _accentTeal = Color(0xFF4ECDC4);

  // Colores para las tarjetas del menu docente
  static const _menuColors = [
    Color(0xFF4ECDC4), // Mis Cursos - Teal
    Color(0xFFFF6B9D), // Gestionar Notas - Pink
    Color(0xFF4ADE80), // Asistencia - Green
    Color(0xFFFF8C42), // Predicciones - Orange
    Color(0xFFFFB74D), // Noticias - Amber
    Color(0xFF5C6BC0), // Chat - Indigo
  ];

  @override
  void initState() {
    super.initState();
    _headerAnim = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    _headerFade = CurvedAnimation(parent: _headerAnim, curve: Curves.easeOutCubic);

    _menuAnim = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    );

    _headerAnim.forward().then((_) => _menuAnim.forward());
    _loadRealStats();
  }

  Future<void> _loadRealStats() async {
    try {
      final profile = await _apiService.getUserProfile();
      if (!mounted) return;

      final isDocente = profile != null && profile['docente'] != null;
      final idDocente = isDocente ? profile['docente']['idDocente'] : null;

      final results = await Future.wait([
        _apiService.getDocenteNivelDetalleCursos(),
      ]);
      if (!mounted) return;

      List cursos = results[0] as List;
      if (idDocente != null) {
        cursos = cursos.where((c) => c['docente'] != null && c['docente']['idDocente'] == idDocente).toList();
      }

      final nombre = profile != null
          ? (isDocente 
              ? '${profile['docente']['nombres'] ?? ''} ${profile['docente']['apellidos'] ?? ''}'.trim() 
              : '${profile['nombres'] ?? ''} ${profile['apellidos'] ?? ''}'.trim())
          : 'Docente';

      setState(() {
        _teacherName = nombre.isNotEmpty ? nombre : 'Docente';
        _statCursos = cursos.length.toString();
        _statEstudiantes = '—'; 
        _statCalificaciones = '—';
      });
    } catch (_) {}
  }

  @override
  void dispose() {
    _headerAnim.dispose();
    _menuAnim.dispose();
    super.dispose();
  }

  void _logout() async {
    final shouldLogout = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.red.withOpacity(0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.logout_rounded, color: Colors.red),
            ),
            const SizedBox(width: 12),
            const Text('Cerrar Sesion'),
          ],
        ),
        content: const Text('Estas seguro que deseas cerrar sesion?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: Text('Cancelar', style: TextStyle(color: Colors.grey.shade600)),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            child: const Text('Cerrar Sesion'),
          ),
        ],
      ),
    );

    if (shouldLogout == true) {
      await _authService.logout();
      if (mounted) {
        Navigator.pushReplacement(
          context,
          PageRouteBuilder(
            pageBuilder: (_, __, ___) => const LoginScreen(),
            transitionsBuilder: (_, anim, __, child) =>
                FadeTransition(opacity: anim, child: child),
          ),
        );
      }
    }
  }

  String _getGreeting() {
    final hour = DateTime.now().hour;
    if (hour < 12) return 'Buenos dias';
    if (hour < 18) return 'Buenas tardes';
    return 'Buenas noches';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            colors: [_primaryDark, _primaryMid, _primaryLight],
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            stops: [0.0, 0.5, 1.0],
          ),
        ),
        child: SafeArea(
          child: CustomScrollView(
            physics: const BouncingScrollPhysics(),
            slivers: [
              // Header Section
              SliverToBoxAdapter(
                child: FadeTransition(
                  opacity: _headerFade,
                  child: SlideTransition(
                    position: Tween<Offset>(
                      begin: const Offset(0, -0.2),
                      end: Offset.zero,
                    ).animate(_headerFade),
                    child: Padding(
                      padding: const EdgeInsets.fromLTRB(24, 16, 24, 0),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          // Top bar
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Container(
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 14, vertical: 8),
                                decoration: BoxDecoration(
                                  gradient: LinearGradient(
                                    colors: [
                                      _accentTeal.withOpacity(0.25),
                                      _accentTeal.withOpacity(0.1),
                                    ],
                                  ),
                                  borderRadius: BorderRadius.circular(20),
                                  border: Border.all(
                                      color: _accentTeal.withOpacity(0.3)),
                                ),
                                child: Row(
                                  mainAxisSize: MainAxisSize.min,
                                  children: [
                                    const Icon(Icons.cast_for_education_rounded,
                                        color: _accentTeal, size: 16),
                                    const SizedBox(width: 8),
                                    Text(
                                      'Docente',
                                      style: TextStyle(
                                        color: _accentTeal,
                                        fontSize: 13,
                                        fontWeight: FontWeight.w600,
                                      ),
                                    ),
                                  ],
                                ),
                              ),
                              Row(
                                children: [
                                  _buildIconButton(
                                    Icons.notifications_rounded,
                                    onTap: () {
                                      ScaffoldMessenger.of(context).showSnackBar(
                                        SnackBar(
                                          content: const Text('Sin notificaciones nuevas'),
                                          behavior: SnackBarBehavior.floating,
                                          shape: RoundedRectangleBorder(
                                              borderRadius: BorderRadius.circular(12)),
                                        ),
                                      );
                                    },
                                    badge: true,
                                  ),
                                  const SizedBox(width: 12),
                                  _buildIconButton(
                                    Icons.logout_rounded,
                                    onTap: _logout,
                                  ),
                                ],
                              ),
                            ],
                          ),
                          const SizedBox(height: 32),
                          // Avatar y saludo
                          Row(
                            children: [
                              Hero(
                                tag: 'avatar_teacher',
                                child: Container(
                                  padding: const EdgeInsets.all(4),
                                  decoration: BoxDecoration(
                                    shape: BoxShape.circle,
                                    gradient: LinearGradient(
                                      colors: [
                                        _accentTeal,
                                        _accentTeal.withOpacity(0.6),
                                      ],
                                      begin: Alignment.topLeft,
                                      end: Alignment.bottomRight,
                                    ),
                                    boxShadow: [
                                      BoxShadow(
                                        color: _accentTeal.withOpacity(0.4),
                                        blurRadius: 20,
                                        offset: const Offset(0, 8),
                                      ),
                                    ],
                                  ),
                                  child: const CircleAvatar(
                                    radius: 36,
                                    backgroundColor: _primaryMid,
                                    child: Icon(
                                      Icons.person_rounded,
                                      size: 40,
                                      color: Colors.white,
                                    ),
                                  ),
                                ),
                              ),
                              const SizedBox(width: 18),
                              Expanded(
                                child: Column(
                                  crossAxisAlignment: CrossAxisAlignment.start,
                                  children: [
                                    Text(
                                      _getGreeting(),
                                      style: TextStyle(
                                        fontSize: 14,
                                        color: _accentTeal,
                                        fontWeight: FontWeight.w600,
                                        letterSpacing: 0.5,
                                      ),
                                    ),
                                    const SizedBox(height: 4),
                                    Text(
                                      _teacherName,
                                      style: const TextStyle(
                                        fontSize: 22,
                                        fontWeight: FontWeight.w800,
                                        color: Colors.white,
                                        letterSpacing: -0.5,
                                      ),
                                      overflow: TextOverflow.ellipsis,
                                    ),
                                  ],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 28),
                          // Stats cards
                          Row(
                            children: [
                              Expanded(
                                child: _buildStatCard(
                                  'Cursos',
                                  _statCursos,
                                  Icons.book_rounded,
                                  _menuColors[0],
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: _buildStatCard(
                                  'Estudiantes',
                                  _statEstudiantes,
                                  Icons.people_rounded,
                                  _menuColors[1],
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: _buildStatCard(
                                  'Notas',
                                  _statCalificaciones,
                                  Icons.assignment_turned_in_rounded,
                                  _menuColors[3],
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 32),
                          // Titulo de menu
                          Row(
                            children: [
                              Container(
                                padding: const EdgeInsets.all(8),
                                decoration: BoxDecoration(
                                  color: _accentGold.withOpacity(0.2),
                                  borderRadius: BorderRadius.circular(10),
                                ),
                                child: const Icon(
                                  Icons.apps_rounded,
                                  color: _accentGold,
                                  size: 18,
                                ),
                              ),
                              const SizedBox(width: 12),
                              const Text(
                                'Menu Principal',
                                style: TextStyle(
                                  fontSize: 18,
                                  fontWeight: FontWeight.w700,
                                  color: Colors.white,
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 20),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
              // Menu items
              SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                sliver: SliverList(
                  delegate: SliverChildListDelegate([
                    _buildMenuCard(
                      icon: Icons.book_rounded,
                      title: 'Mis Cursos',
                      subtitle: 'Ver y administrar tus cursos asignados',
                      color: _menuColors[0],
                      index: 0,
                      onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const TeacherCoursesScreen()),
                      ),
                    ),
                    const SizedBox(height: 14),
                    _buildMenuCard(
                      icon: Icons.grade_rounded,
                      title: 'Gestionar Notas',
                      subtitle: 'Registrar y editar calificaciones',
                      color: _menuColors[1],
                      index: 1,
                      onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const TeacherGradesScreen()),
                      ),
                    ),
                    const SizedBox(height: 14),
                    _buildMenuCard(
                      icon: Icons.how_to_reg_rounded,
                      title: 'Tomar Asistencia',
                      subtitle: 'Registrar asistencia de estudiantes',
                      color: _menuColors[2],
                      index: 2,
                      onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const TeacherAttendanceScreen()),
                      ),
                    ),
                    const SizedBox(height: 14),
                    _buildMenuCard(
                      icon: Icons.analytics_rounded,
                      title: 'Predicciones IA',
                      subtitle: 'Analisis predictivo de rendimiento',
                      color: _menuColors[3],
                      index: 3,
                      onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const PredictionsDashboardScreen()),
                      ),
                    ),
                    const SizedBox(height: 14),
                    _buildMenuCard(
                      icon: Icons.article_rounded,
                      title: 'Noticias',
                      subtitle: 'Noticias institucionales',
                      color: _menuColors[4],
                      index: 4,
                      onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const NewsScreen()),
                      ),
                    ),
                    const SizedBox(height: 14),
                    _buildMenuCard(
                      icon: Icons.chat_rounded,
                      title: 'Chat Institucional',
                      subtitle: 'Comunidad educativa',
                      color: _menuColors[5],
                      index: 5,
                      onTap: () => Navigator.push(
                        context,
                        MaterialPageRoute(builder: (_) => const ChatListScreen()),
                      ),
                    ),
                  ]),
                ),
              ),
              const SliverToBoxAdapter(child: SizedBox(height: 100)),
            ],
          ),
        ),
      ),
      floatingActionButton: _buildFAB(),
    );
  }

  Widget _buildIconButton(IconData icon,
      {required VoidCallback onTap, bool badge = false}) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(14),
        child: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.1),
            borderRadius: BorderRadius.circular(14),
            border: Border.all(color: Colors.white.withOpacity(0.15)),
          ),
          child: Stack(
            children: [
              Icon(icon, color: Colors.white, size: 22),
              if (badge)
                Positioned(
                  right: 0,
                  top: 0,
                  child: Container(
                    width: 8,
                    height: 8,
                    decoration: const BoxDecoration(
                      color: Color(0xFFFF6B6B),
                      shape: BoxShape.circle,
                    ),
                  ),
                ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildStatCard(String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Colors.white.withOpacity(0.15),
            Colors.white.withOpacity(0.05),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: Colors.white.withOpacity(0.1)),
      ),
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withOpacity(0.2),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(height: 10),
          Text(
            value,
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w800,
              color: Colors.white,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 11,
              color: Colors.white.withOpacity(0.7),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMenuCard({
    required IconData icon,
    required String title,
    required String subtitle,
    required Color color,
    required int index,
    required VoidCallback onTap,
  }) {
    return AnimatedBuilder(
      animation: _menuAnim,
      builder: (context, child) {
        final delay = index * 0.1;
        final start = delay;
        final end = (delay + 0.5).clamp(0.0, 1.0);
        final curvedValue = Curves.easeOutCubic.transform(
          (((_menuAnim.value - start) / (end - start)).clamp(0.0, 1.0)),
        );

        return Transform.translate(
          offset: Offset(0, 30 * (1 - curvedValue)),
          child: Opacity(
            opacity: curvedValue,
            child: child,
          ),
        );
      },
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: onTap,
          borderRadius: BorderRadius.circular(20),
          splashColor: color.withOpacity(0.2),
          child: Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Colors.white.withOpacity(0.12),
                  Colors.white.withOpacity(0.05),
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.white.withOpacity(0.1)),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        color,
                        color.withOpacity(0.7),
                      ],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    borderRadius: BorderRadius.circular(16),
                    boxShadow: [
                      BoxShadow(
                        color: color.withOpacity(0.4),
                        blurRadius: 12,
                        offset: const Offset(0, 4),
                      ),
                    ],
                  ),
                  child: Icon(icon, color: Colors.white, size: 26),
                ),
                const SizedBox(width: 18),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: const TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w700,
                          color: Colors.white,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        subtitle,
                        style: TextStyle(
                          fontSize: 13,
                          color: Colors.white.withOpacity(0.6),
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.all(8),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(
                    Icons.arrow_forward_ios_rounded,
                    size: 16,
                    color: Colors.white.withOpacity(0.6),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildFAB() {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(20),
        gradient: const LinearGradient(
          colors: [Color(0xFF8B5CF6), Color(0xFF6366F1)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF8B5CF6).withOpacity(0.4),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: FloatingActionButton.extended(
        onPressed: () => Navigator.push(
          context,
          MaterialPageRoute(builder: (_) => const AiAssistantScreen()),
        ),
        backgroundColor: Colors.transparent,
        elevation: 0,
        highlightElevation: 0,
        icon: const Icon(Icons.auto_awesome_rounded, color: Colors.white),
        label: const Text(
          'Asistente IA',
          style: TextStyle(
            color: Colors.white,
            fontWeight: FontWeight.w600,
          ),
        ),
      ),
    );
  }
}