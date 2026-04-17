import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import '../services/api_service.dart';
import 'login_screen.dart';
import 'ai_assistant_screen.dart';
import 'predictions_dashboard_screen.dart';
import 'user_management_screen.dart';
import 'news_management_screen.dart';
import 'reports_screen.dart';
import 'chat_list_screen.dart';
import 'user_form_screen.dart';
import 'admin_management_list_screen.dart';
import 'teacher_courses_screen.dart';
import 'teacher_grades_screen.dart';
import 'placeholder_management_screen.dart';

class AdminHomeScreen extends StatefulWidget {
  const AdminHomeScreen({super.key});

  @override
  State<AdminHomeScreen> createState() => _AdminHomeScreenState();
}

class _AdminHomeScreenState extends State<AdminHomeScreen>
    with TickerProviderStateMixin {
  final _authService = AuthService();
  final _apiService = ApiService();

  String _adminName = 'Administrador';
  String _statEstudiantes = '—';
  String _statNoticias = '—';
  String _statDocentes = '—';

  late AnimationController _headerAnim;
  late AnimationController _menuAnim;
  late Animation<double> _headerFade;

  // Paleta de colores coherente con el resto de la app
  static const _primaryDark = Color(0xFF0F2027);
  static const _primaryMid = Color(0xFF203A43);
  static const _primaryLight = Color(0xFF2C5364);
  static const _accentGold = Color(0xFFFFD700);
  static const _accentAmber = Color(0xFFFFC107);

  @override
  void initState() {
    super.initState();
    _headerAnim = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    _headerFade =
        CurvedAnimation(parent: _headerAnim, curve: Curves.easeOutCubic);

    _menuAnim = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1000),
    );

    _headerAnim.forward().then((_) => _menuAnim.forward());
    _loadRealStats();
  }

  Future<void> _loadRealStats() async {
    try {
      final results = await Future.wait([
        _apiService.getUserProfile(),
        _apiService.getAllEstudiantes(),
        _apiService.getNoticias(),
        _apiService.getAllDocentes(),
      ]);
      if (!mounted) return;
      final profile = results[0];
      final estudiantes = results[1] as List;
      final noticias = results[2] as List;
      final docentes = results[3] as List;
      final nombre = profile != null
          ? '${profile['nombres'] ?? ''} ${profile['apellidos'] ?? ''}'.trim()
          : 'Administrador';
      setState(() {
        _adminName = nombre.isNotEmpty ? nombre : 'Administrador';
        _statEstudiantes = estudiantes.length.toString();
        _statNoticias = noticias.length.toString();
        _statDocentes = docentes.length.toString();
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
        content: const Text(
            'Estas seguro que deseas cerrar la sesion de administrador?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child:
                Text('Cancelar', style: TextStyle(color: Colors.grey.shade600)),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
            style: ElevatedButton.styleFrom(
              backgroundColor: Colors.red,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10)),
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
      appBar: AppBar(
        backgroundColor: Colors.transparent,
        elevation: 0,
        leading: Builder(
          builder: (context) => IconButton(
            icon: Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.menu_rounded, color: Colors.white),
            ),
            onPressed: () => Scaffold.of(context).openDrawer(),
          ),
        ),
      ),
      drawer: _buildDrawer(),
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
              // Header Section (Avatar, Saludo, Stats)
              SliverToBoxAdapter(
                child: FadeTransition(
                  opacity: _headerFade,
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(24, 0, 24, 20),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const SizedBox(height: 10),
                        _buildGreetingSection(),
                        const SizedBox(height: 28),
                        _buildStatsRow(),
                      ],
                    ),
                  ),
                ),
              ),

              // Secciones del Menú (Categorizadas)
              SliverPadding(
                padding: const EdgeInsets.symmetric(horizontal: 24),
                sliver: SliverList(
                  delegate: SliverChildListDelegate([
                    _buildCategoryHeader(
                        'CONFIGURACION', Icons.settings_rounded, _accentGold),
                    _buildCategoryGrid([
                      _menuItem(
                          Icons.dashboard_rounded,
                          'Dashboard',
                          'Predicciones IA',
                          const Color(0xFFBA68C8),
                          () => _nav(const PredictionsDashboardScreen())),
                      _menuItem(
                          Icons.calendar_today_rounded,
                          'Periodo',
                          'Gestionar periodos',
                          const Color(0xFF4FC3F7),
                          () => _nav(AdminManagementListScreen(
                                  title: 'Periodos',
                                  fetchData: _apiService.getAllPeriodos,
                                  icon: Icons.calendar_today,
                                  themeColor: const Color(0xFF4FC3F7),
                                  endpoint: '/periodo',
                                  formFields: const [
                                    {
                                      'key': 'descripcion',
                                      'label': 'Descripción',
                                      'type': 'text'
                                    },
                                    {
                                      'key': 'fechaInicio',
                                      'label': 'Fecha Inicio',
                                      'type': 'date'
                                    },
                                    {
                                      'key': 'fechaFin',
                                      'label': 'Fecha Fin',
                                      'type': 'date'
                                    },
                                    {
                                      'key': 'activo',
                                      'label': 'Activo',
                                      'type': 'bool'
                                    }
                                  ]))),
                      _menuItem(
                          Icons.school_rounded,
                          'Niveles',
                          'Grados académicos',
                          const Color(0xFF81C784),
                          () => _nav(AdminManagementListScreen(
                                  title: 'Niveles',
                                  fetchData: _apiService.getAllNiveles,
                                  icon: Icons.school,
                                  themeColor: const Color(0xFF81C784),
                                  endpoint: '/nivel',
                                  formFields: const [
                                    {
                                      'key': 'nombre',
                                      'label': 'Nombre del Nivel',
                                      'type': 'text'
                                    },
                                    {
                                      'key': 'estado',
                                      'label': 'Estado Activo',
                                      'type': 'bool'
                                    }
                                  ]))),
                      _menuItem(
                          Icons.group_rounded,
                          'Secciones',
                          'Cursos y secciones',
                          const Color(0xFFFFB74D),
                          () => _nav(AdminManagementListScreen(
                              title: 'Secciones',
                              fetchData: _apiService.getAllNivelesDetalles,
                              icon: Icons.group,
                              themeColor: const Color(0xFFFFB74D)))),
                      _menuItem(
                          Icons.schedule_rounded,
                          'Horarios',
                          'Gestionar horarios',
                          const Color(0xFFF06292),
                          () => _nav(AdminManagementListScreen(
                              title: 'Horarios',
                              fetchData: _apiService.getAllHorarios,
                              icon: Icons.schedule,
                              themeColor: const Color(0xFFF06292)))),
                      _menuItem(
                          Icons.psychology_rounded,
                          'weka',
                          'Análisis inteligente',
                          const Color(0xFF9575CD),
                          () => _nav(const PredictionsDashboardScreen())),
                    ]),
                    _buildCategoryHeader('USUARIOS Y ALUMNOS',
                        Icons.people_rounded, _accentAmber),
                    _buildCategoryGrid([
                      _menuItem(
                          Icons.person_add_rounded,
                          'Registrar',
                          'Nuevo usuario',
                          const Color(0xFF4DD0E1),
                          () => _nav(const UserFormScreen())),
                      _menuItem(
                          Icons.manage_accounts_rounded,
                          'Usuarios',
                          'Gestionar cuentas',
                          const Color(0xFF64B5F6),
                          () => _nav(const UserManagementScreen())),
                      _menuItem(
                          Icons.face_rounded,
                          'Estudiantes',
                          'Listado general',
                          const Color(0xFF81C784),
                          () => _nav(AdminManagementListScreen(
                              title: 'Estudiantes',
                              fetchData: _apiService.getAllEstudiantes,
                              icon: Icons.face,
                              themeColor: const Color(0xFF81C784)))),
                      _menuItem(
                          Icons.family_restroom_rounded,
                          'Acudientes',
                          'Padres de familia',
                          const Color(0xFFFF8A65),
                          () => _nav(const PlaceholderManagementScreen(
                              title: 'Acudientes',
                              icon: Icons.family_restroom,
                              themeColor: Color(0xFFFF8A65)))),
                    ]),
                    _buildCategoryHeader('DOCENTES Y CURSOS',
                        Icons.book_rounded, Colors.lightBlueAccent),
                    _buildCategoryGrid([
                      _menuItem(
                          Icons.supervisor_account_rounded,
                          'Docentes',
                          'Listado docentes',
                          const Color(0xFF4DB6AC),
                          () => _nav(AdminManagementListScreen(
                              title: 'Docentes',
                              fetchData: _apiService.getAllDocentes,
                              icon: Icons.supervisor_account,
                              themeColor: const Color(0xFF4DB6AC)))),
                      _menuItem(
                          Icons.grade_rounded,
                          'Notas',
                          'Calificaciones globales',
                          const Color(0xFFFFD54F),
                          () => _nav(const TeacherGradesScreen())),
                      _menuItem(
                          Icons.class_rounded,
                          'Cursos',
                          'Asignación académica',
                          const Color(0xFF7986CB),
                          () => _nav(const TeacherCoursesScreen())),
                    ]),
                    _buildCategoryHeader('GESTION INSTITUCIONAL',
                        Icons.business_rounded, Colors.orangeAccent),
                    _buildCategoryGrid([
                      _menuItem(
                          Icons.newspaper_rounded,
                          'Noticias',
                          'Publicar novedades',
                          const Color(0xFFFFB74D),
                          () => _nav(const NewsManagementScreen())),
                      _menuItem(
                          Icons.chat_bubble_rounded,
                          'Chat',
                          'Comunicación real',
                          const Color(0xFFF06292),
                          () => _nav(const ChatListScreen())),
                      _menuItem(
                          Icons.app_registration_rounded,
                          'Matrícula',
                          'Inscripciones',
                          const Color(0xFF4DB6AC),
                          () => _nav(AdminManagementListScreen(
                              title: 'Matrículas',
                              fetchData: _apiService.getAllInscripciones,
                              icon: Icons.app_registration,
                              themeColor: const Color(0xFF4DB6AC)))),
                      _menuItem(
                          Icons.analytics_rounded,
                          'Reportes',
                          'Estadísticas',
                          const Color(0xFF64B5F6),
                          () => _nav(const ReportsScreen())),
                      _menuItem(
                          Icons.attach_money_rounded,
                          'Tarifas',
                          'Costos educativos',
                          const Color(0xFF81C784),
                          () => _nav(const PlaceholderManagementScreen(
                              title: 'Tarifas Educativas',
                              icon: Icons.attach_money,
                              themeColor: Color(0xFF81C784)))),
                    ]),
                    const SizedBox(height: 100),
                  ]),
                ),
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: _buildFAB(),
    );
  }

  void _nav(Widget screen) {
    Navigator.push(context, MaterialPageRoute(builder: (_) => screen));
  }

  Widget _buildGreetingSection() {
    return Row(
      children: [
        Hero(
          tag: 'avatar_admin',
          child: Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              gradient:
                  const LinearGradient(colors: [_accentGold, _accentAmber]),
              boxShadow: [
                BoxShadow(
                    color: _accentGold.withOpacity(0.4),
                    blurRadius: 20,
                    offset: const Offset(0, 8)),
              ],
            ),
            child: const CircleAvatar(
              radius: 36,
              backgroundColor: _primaryMid,
              child: Icon(Icons.admin_panel_settings_rounded,
                  size: 40, color: Colors.white),
            ),
          ),
        ),
        const SizedBox(width: 18),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(_getGreeting(),
                  style: const TextStyle(
                      fontSize: 14,
                      color: _accentGold,
                      fontWeight: FontWeight.w600,
                      letterSpacing: 0.5)),
              const SizedBox(height: 4),
              Text(_adminName,
                  style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                      color: Colors.white,
                      letterSpacing: -0.5),
                  overflow: TextOverflow.ellipsis),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildStatsRow() {
    return Row(
      children: [
        Expanded(
            child: _buildStatCard('Estudiantes', _statEstudiantes,
                Icons.people_rounded, const Color(0xFF4FC3F7))),
        const SizedBox(width: 12),
        Expanded(
            child: _buildStatCard('Noticias', _statNoticias,
                Icons.article_rounded, const Color(0xFFFFB74D))),
        const SizedBox(width: 12),
        Expanded(
            child: _buildStatCard('Docentes', _statDocentes,
                Icons.school_rounded, const Color(0xFF81C784))),
      ],
    );
  }

  Widget _buildStatCard(
      String label, String value, IconData icon, Color color) {
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

  Widget _buildCategoryHeader(String title, IconData icon, Color color) {
    return Padding(
      padding: const EdgeInsets.only(top: 32, bottom: 16),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
                color: color.withOpacity(0.2),
                borderRadius: BorderRadius.circular(10)),
            child: Icon(icon, color: color, size: 18),
          ),
          const SizedBox(width: 12),
          Text(title,
              style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w800,
                  color: Colors.white,
                  letterSpacing: 1.2)),
        ],
      ),
    );
  }

  Widget _buildCategoryGrid(List<Widget> items) {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      childAspectRatio: 1.4,
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      children: items,
    );
  }

  Widget _menuItem(IconData icon, String title, String subtitle, Color color,
      VoidCallback onTap) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(20),
        child: Container(
          padding: const EdgeInsets.all(12),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                Colors.white.withOpacity(0.12),
                Colors.white.withOpacity(0.05)
              ],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(20),
            border: Border.all(color: Colors.white.withOpacity(0.1)),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  gradient:
                      LinearGradient(colors: [color, color.withOpacity(0.7)]),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: Colors.white, size: 20),
              ),
              const SizedBox(height: 10),
              Text(title,
                  style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.bold,
                      color: Colors.white),
                  overflow: TextOverflow.ellipsis),
              Text(subtitle,
                  style: TextStyle(
                      fontSize: 11, color: Colors.white.withOpacity(0.6)),
                  overflow: TextOverflow.ellipsis),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDrawer() {
    return Drawer(
      backgroundColor: _primaryDark,
      child: Column(
        children: [
          _buildDrawerHeader(),
          Expanded(
            child: ListView(
              padding: EdgeInsets.zero,
              children: [
                _drawerSection('CONFIGURACIONES', [
                  _drawerItem(Icons.dashboard, 'Dashboard',
                      () => _nav(const PredictionsDashboardScreen())),
                  _drawerItem(
                      Icons.calendar_today,
                      'Periodo',
                      () => _nav(AdminManagementListScreen(
                          title: 'Periodos',
                          fetchData: _apiService.getAllPeriodos,
                          icon: Icons.calendar_today))),
                  _drawerItem(
                      Icons.school,
                      'Nivel Académico',
                      () => _nav(AdminManagementListScreen(
                          title: 'Niveles',
                          fetchData: _apiService.getAllNiveles,
                          icon: Icons.school))),
                ]),
                _drawerSection('USUARIOS', [
                  _drawerItem(Icons.person_add, 'Registrar',
                      () => _nav(const UserFormScreen())),
                  _drawerItem(Icons.group, 'Usuarios',
                      () => _nav(const UserManagementScreen())),
                ]),
                _drawerSection('GESTION', [
                  _drawerItem(Icons.newspaper, 'Noticias',
                      () => _nav(const NewsManagementScreen())),
                  _drawerItem(Icons.chat_bubble, 'Chat',
                      () => _nav(const ChatListScreen())),
                  _drawerItem(Icons.analytics, 'Reportes',
                      () => _nav(const ReportsScreen())),
                ]),
                const Divider(color: Colors.white10),
                _drawerItem(Icons.logout, 'Cerrar Sesión', _logout,
                    color: Colors.redAccent),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildDrawerHeader() {
    return Container(
      padding: const EdgeInsets.fromLTRB(20, 50, 20, 20),
      decoration: const BoxDecoration(
          gradient: LinearGradient(colors: [_primaryDark, _primaryMid])),
      child: Row(
        children: [
          const CircleAvatar(
              radius: 25,
              backgroundColor: _accentGold,
              child: Icon(Icons.person, color: _primaryDark)),
          const SizedBox(width: 15),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(_adminName,
                    style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 16),
                    overflow: TextOverflow.ellipsis),
                const Text('Administrador',
                    style: TextStyle(color: _accentGold, fontSize: 12)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _drawerSection(String title, List<Widget> children) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.fromLTRB(20, 20, 20, 10),
          child: Text(title,
              style: TextStyle(
                  color: Colors.white.withOpacity(0.4),
                  fontSize: 11,
                  fontWeight: FontWeight.bold,
                  letterSpacing: 1.1)),
        ),
        ...children,
      ],
    );
  }

  Widget _drawerItem(IconData icon, String title, VoidCallback onTap,
      {Color color = Colors.white}) {
    return ListTile(
      leading: Icon(icon, color: color.withOpacity(0.7), size: 22),
      title: Text(title,
          style: TextStyle(color: color.withOpacity(0.9), fontSize: 14)),
      onTap: () {
        Navigator.pop(context);
        onTap();
      },
      dense: true,
      visualDensity: VisualDensity.compact,
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
            color:
                const Color.fromARGB(255, 255, 255, 128), // Reemplazo correcto
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
