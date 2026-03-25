import 'package:flutter/material.dart';
import '../models/user_profile_model.dart';
import '../services/api_service.dart';

class StudentProfileScreen extends StatefulWidget {
  const StudentProfileScreen({super.key});

  @override
  State<StudentProfileScreen> createState() => _StudentProfileScreenState();
}

class _StudentProfileScreenState extends State<StudentProfileScreen>
    with TickerProviderStateMixin {
  final ApiService _apiService = ApiService();
  late Future<UserProfile?> _profileFuture;

  late AnimationController _headerAnim;
  late AnimationController _contentAnim;
  late Animation<double> _headerFade;

  // Paleta de colores coherente
  static const _primaryDark = Color(0xFF0F2027);
  static const _primaryMid = Color(0xFF203A43);
  static const _primaryLight = Color(0xFF2C5364);
  static const _accentGold = Color(0xFFFFD700);
  static const _accentCoral = Color(0xFFFF6B6B);

  @override
  void initState() {
    super.initState();
    _profileFuture = _fetchProfile();

    _headerAnim = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    _headerFade = CurvedAnimation(parent: _headerAnim, curve: Curves.easeOutCubic);

    _contentAnim = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );

    _headerAnim.forward().then((_) => _contentAnim.forward());
  }

  @override
  void dispose() {
    _headerAnim.dispose();
    _contentAnim.dispose();
    super.dispose();
  }

  Future<UserProfile?> _fetchProfile() async {
    final data = await _apiService.getUserProfile();
    if (data != null) {
      return UserProfile.fromJson(data);
    }
    return null;
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
          child: FutureBuilder<UserProfile?>(
            future: _profileFuture,
            builder: (context, snapshot) {
              return CustomScrollView(
                physics: const BouncingScrollPhysics(),
                slivers: [
                  // Header con boton de volver
                  SliverToBoxAdapter(
                    child: _buildHeader(),
                  ),
                  // Contenido
                  SliverToBoxAdapter(
                    child: _buildContent(snapshot),
                  ),
                ],
              );
            },
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return FadeTransition(
      opacity: _headerFade,
      child: Padding(
        padding: const EdgeInsets.fromLTRB(16, 12, 16, 0),
        child: Row(
          children: [
            Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: () => Navigator.pop(context),
                borderRadius: BorderRadius.circular(14),
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: Colors.white.withOpacity(0.15)),
                  ),
                  child: const Icon(
                    Icons.arrow_back_rounded,
                    color: Colors.white,
                    size: 22,
                  ),
                ),
              ),
            ),
            const SizedBox(width: 16),
            const Text(
              'Mi Perfil',
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w700,
                color: Colors.white,
              ),
            ),
            const Spacer(),
            Material(
              color: Colors.transparent,
              child: InkWell(
                onTap: () {
                  ScaffoldMessenger.of(context).showSnackBar(
                    SnackBar(
                      content: const Row(
                        children: [
                          Icon(Icons.edit_rounded, color: Colors.white),
                          SizedBox(width: 12),
                          Text('Edicion de perfil proximamente'),
                        ],
                      ),
                      behavior: SnackBarBehavior.floating,
                      shape: RoundedRectangleBorder(
                        borderRadius: BorderRadius.circular(12),
                      ),
                      backgroundColor: _primaryMid,
                    ),
                  );
                },
                borderRadius: BorderRadius.circular(14),
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: Colors.white.withOpacity(0.15)),
                  ),
                  child: const Icon(
                    Icons.edit_rounded,
                    color: Colors.white,
                    size: 22,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildContent(AsyncSnapshot<UserProfile?> snapshot) {
    if (snapshot.connectionState == ConnectionState.waiting) {
      return _buildLoadingState();
    } else if (snapshot.hasError) {
      return _buildErrorState('Error al cargar el perfil');
    } else if (!snapshot.hasData || snapshot.data == null) {
      return _buildErrorState('No se encontro informacion del perfil');
    }

    final profile = snapshot.data!;
    return _buildProfileContent(profile);
  }

  Widget _buildLoadingState() {
    return SizedBox(
      height: MediaQuery.of(context).size.height * 0.7,
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white.withOpacity(0.1),
                shape: BoxShape.circle,
              ),
              child: const CircularProgressIndicator(
                color: _accentGold,
                strokeWidth: 3,
              ),
            ),
            const SizedBox(height: 20),
            Text(
              'Cargando perfil...',
              style: TextStyle(
                color: Colors.white.withOpacity(0.7),
                fontSize: 16,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildErrorState(String message) {
    return SizedBox(
      height: MediaQuery.of(context).size.height * 0.7,
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: _accentCoral.withOpacity(0.2),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.error_outline_rounded,
                color: _accentCoral,
                size: 48,
              ),
            ),
            const SizedBox(height: 20),
            Text(
              message,
              style: TextStyle(
                color: Colors.white.withOpacity(0.8),
                fontSize: 16,
              ),
            ),
            const SizedBox(height: 20),
            ElevatedButton.icon(
              onPressed: () {
                setState(() {
                  _profileFuture = _fetchProfile();
                });
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.white.withOpacity(0.15),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              icon: const Icon(Icons.refresh_rounded),
              label: const Text('Reintentar'),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileContent(UserProfile profile) {
    final isEstudiante = profile.estudiante != null;
    final isDocente = profile.docente != null;

    final nombreCompleto = isEstudiante
        ? '${profile.estudiante['nombres'] ?? ''} ${profile.estudiante['apellidos'] ?? ''}'
        : isDocente
        ? '${profile.docente['nombres'] ?? ''} ${profile.docente['apellidos'] ?? ''}'
        : profile.username;

    final codigo = isEstudiante
        ? profile.estudiante['codigo'] ?? 'N/A'
        : (isDocente ? profile.docente['codigo'] ?? 'N/A' : 'Admin');

    final documento = isEstudiante
        ? profile.estudiante['documentoIdentidad'] ?? 'No registrado'
        : isDocente
        ? profile.docente['documentoIdentidad'] ?? 'No registrado'
        : 'N/A';

    final ciudad = isEstudiante
        ? profile.estudiante['ciudad'] ?? 'No registrada'
        : (isDocente ? profile.docente['ciudad'] ?? 'No registrada' : 'N/A');

    final direccion = isEstudiante
        ? profile.estudiante['direccion'] ?? 'No registrada'
        : (isDocente ? profile.docente['direccion'] ?? 'No registrada' : 'N/A');

    final fechaNac = isEstudiante
        ? profile.estudiante['fechaNacimiento'] ?? 'No registrada'
        : (isDocente ? profile.docente['fechaNacimiento'] ?? 'No registrada' : 'N/A');

    final sexo = isEstudiante
        ? profile.estudiante['sexo'] ?? 'No registrado'
        : (isDocente ? profile.docente['sexo'] ?? 'No registrado' : 'N/A');

    final rol = profile.roles.isNotEmpty ? profile.roles.first : 'Sin Rol';

    return FadeTransition(
      opacity: _contentAnim,
      child: Column(
        children: [
          const SizedBox(height: 24),
          // Avatar y nombre
          _buildProfileHeader(nombreCompleto, rol, profile.email),
          const SizedBox(height: 28),
          // Stats rapidas
          _buildQuickStats(codigo),
          const SizedBox(height: 28),
          // Informacion personal
          _buildInfoSection(
            'Informacion Personal',
            Icons.person_rounded,
            [
              _InfoItem(Icons.badge_rounded, 'Codigo', codigo),
              _InfoItem(Icons.fingerprint_rounded, 'Documento', documento),
              _InfoItem(Icons.wc_rounded, 'Sexo', sexo),
              _InfoItem(Icons.cake_rounded, 'Fecha de Nacimiento', fechaNac),
            ],
          ),
          const SizedBox(height: 16),
          // Contacto
          _buildInfoSection(
            'Contacto',
            Icons.contact_mail_rounded,
            [
              _InfoItem(Icons.email_rounded, 'Correo', profile.email),
              _InfoItem(Icons.location_city_rounded, 'Ciudad', ciudad),
              _InfoItem(Icons.home_rounded, 'Direccion', direccion),
            ],
          ),
          const SizedBox(height: 32),
        ],
      ),
    );
  }

  Widget _buildProfileHeader(String nombre, String rol, String email) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        children: [
          Hero(
            tag: 'avatar_student',
            child: Container(
              padding: const EdgeInsets.all(5),
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                gradient: LinearGradient(
                  colors: [_accentGold, _accentGold.withOpacity(0.6)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                boxShadow: [
                  BoxShadow(
                    color: _accentGold.withOpacity(0.4),
                    blurRadius: 24,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              child: CircleAvatar(
                radius: 52,
                backgroundColor: _primaryMid,
                child: Text(
                  _getInitials(nombre),
                  style: const TextStyle(
                    fontSize: 36,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                  ),
                ),
              ),
            ),
          ),
          const SizedBox(height: 20),
          Text(
            nombre.trim(),
            style: const TextStyle(
              fontSize: 26,
              fontWeight: FontWeight.w800,
              color: Colors.white,
              letterSpacing: -0.5,
            ),
            textAlign: TextAlign.center,
          ),
          const SizedBox(height: 8),
          Text(
            email,
            style: TextStyle(
              fontSize: 14,
              color: Colors.white.withOpacity(0.7),
            ),
          ),
          const SizedBox(height: 14),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 8),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  _accentGold.withOpacity(0.25),
                  _accentGold.withOpacity(0.1),
                ],
              ),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: _accentGold.withOpacity(0.3)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(
                  _getRolIcon(rol),
                  color: _accentGold,
                  size: 16,
                ),
                const SizedBox(width: 8),
                Text(
                  rol,
                  style: const TextStyle(
                    fontSize: 14,
                    color: _accentGold,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  String _getInitials(String name) {
    final parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return '${parts[0][0]}${parts[1][0]}'.toUpperCase();
    } else if (parts.isNotEmpty && parts[0].isNotEmpty) {
      return parts[0][0].toUpperCase();
    }
    return '?';
  }

  IconData _getRolIcon(String rol) {
    final rolLower = rol.toLowerCase();
    if (rolLower.contains('estudiante')) return Icons.school_rounded;
    if (rolLower.contains('docente')) return Icons.cast_for_education_rounded;
    if (rolLower.contains('admin')) return Icons.admin_panel_settings_rounded;
    return Icons.person_rounded;
  }

  Widget _buildQuickStats(String codigo) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
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
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            _buildStatItem('Codigo', codigo, Icons.qr_code_rounded),
            _buildStatDivider(),
            _buildStatItem('Estado', 'Activo', Icons.check_circle_rounded),
            _buildStatDivider(),
            _buildStatItem('Semestre', '2025-I', Icons.calendar_today_rounded),
          ],
        ),
      ),
    );
  }

  Widget _buildStatItem(String label, String value, IconData icon) {
    return Column(
      children: [
        Icon(icon, color: _accentGold, size: 22),
        const SizedBox(height: 10),
        Text(
          value,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w700,
            color: Colors.white,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: TextStyle(
            fontSize: 11,
            color: Colors.white.withOpacity(0.6),
          ),
        ),
      ],
    );
  }

  Widget _buildStatDivider() {
    return Container(
      width: 1,
      height: 50,
      color: Colors.white.withOpacity(0.15),
    );
  }

  Widget _buildInfoSection(String title, IconData titleIcon, List<_InfoItem> items) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: _accentGold.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Icon(titleIcon, color: _accentGold, size: 18),
              ),
              const SizedBox(width: 12),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),
          Container(
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [
                  Colors.white.withOpacity(0.1),
                  Colors.white.withOpacity(0.05),
                ],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: Colors.white.withOpacity(0.1)),
            ),
            child: Column(
              children: items.asMap().entries.map((entry) {
                final index = entry.key;
                final item = entry.value;
                final isLast = index == items.length - 1;

                return Column(
                  children: [
                    _buildInfoRow(item.icon, item.label, item.value),
                    if (!isLast)
                      Divider(
                        height: 1,
                        color: Colors.white.withOpacity(0.08),
                        indent: 56,
                        endIndent: 20,
                      ),
                  ],
                );
              }).toList(),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildInfoRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.1),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(icon, color: Colors.white.withOpacity(0.8), size: 20),
          ),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(
                    fontSize: 12,
                    color: Colors.white.withOpacity(0.5),
                    fontWeight: FontWeight.w500,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  value,
                  style: const TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.w600,
                    color: Colors.white,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

class _InfoItem {
  final IconData icon;
  final String label;
  final String value;

  _InfoItem(this.icon, this.label, this.value);
}