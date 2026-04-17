import 'package:flutter/material.dart';
import '../services/api_service.dart';

class UserFormScreen extends StatefulWidget {
  final dynamic user;
  const UserFormScreen({super.key, this.user});

  @override
  State<UserFormScreen> createState() => _UserFormScreenState();
}

class _UserFormScreenState extends State<UserFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _apiService = ApiService();

  late TextEditingController _usernameController;
  late TextEditingController _emailController;
  late TextEditingController _passwordController;

  List<dynamic> _availableRoles = [];
  List<int> _selectedRoleIds = [];
  bool _isLoading = false;
  bool _obscurePassword = true;

  // Colores del tema
  static const Color _primaryColor = Color(0xFF6366F1);
  static const Color _primaryDark = Color(0xFF4F46E5);
  static const Color _surfaceColor = Color(0xFFF8FAFC);
  static const Color _cardColor = Colors.white;
  static const Color _textPrimary = Color(0xFF1E293B);
  static const Color _textSecondary = Color(0xFF64748B);
  static const Color _borderColor = Color(0xFFE2E8F0);

  @override
  void initState() {
    super.initState();
    _usernameController =
        TextEditingController(text: widget.user?['username'] ?? '');
    _emailController = TextEditingController(text: widget.user?['email'] ?? '');
    _passwordController = TextEditingController();

    if (widget.user != null && widget.user['roles'] != null) {
      _selectedRoleIds =
          (widget.user['roles'] as List).map((r) => r['id'] as int).toList();
    }

    _loadRoles();
  }

  @override
  void dispose() {
    _usernameController.dispose();
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _loadRoles() async {
    final roles = await _apiService.getRoles();
    setState(() {
      _availableRoles = roles;
    });
  }

  void _save() async {
    if (!_formKey.currentState!.validate()) return;
    if (_selectedRoleIds.isEmpty) {
      _showSnackBar('Debe seleccionar al menos un rol', isError: true);
      return;
    }

    final validRoleIds = _availableRoles.map((role) => role['id']).toSet();
    final invalidRoles =
    _selectedRoleIds.where((id) => !validRoleIds.contains(id)).toList();

    if (invalidRoles.isNotEmpty) {
      _showSnackBar('Rol no valido: ${invalidRoles.join(', ')}', isError: true);
      return;
    }

    setState(() => _isLoading = true);

    final userData = {
      'username': _usernameController.text,
      'email': _emailController.text,
      'password':
      _passwordController.text.isNotEmpty ? _passwordController.text : null,
      'roles': _selectedRoleIds.map((id) => {'id': id}).toList(),
    };

    bool success;
    if (widget.user == null) {
      success = await _apiService.createUser(userData);
    } else {
      success = await _apiService.updateUser(widget.user['id'], userData);
    }

    setState(() => _isLoading = false);

    if (success) {
      if (mounted) Navigator.pop(context, true);
    } else {
      if (mounted) {
        _showSnackBar('Error al guardar el usuario', isError: true);
      }
    }
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
        backgroundColor: isError ? const Color(0xFFEF4444) : const Color(0xFF10B981),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
        margin: const EdgeInsets.all(16),
      ),
    );
  }

  InputDecoration _buildInputDecoration({
    required String label,
    required IconData icon,
    Widget? suffixIcon,
    String? hint,
  }) {
    return InputDecoration(
      labelText: label,
      hintText: hint,
      prefixIcon: Icon(icon, color: _textSecondary, size: 20),
      suffixIcon: suffixIcon,
      labelStyle: const TextStyle(color: _textSecondary, fontSize: 14),
      hintStyle: TextStyle(color: _textSecondary.withOpacity(0.5), fontSize: 14),
      filled: true,
      fillColor: _surfaceColor,
      contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 16),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: _borderColor),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: _borderColor),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: _primaryColor, width: 2),
      ),
      errorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0xFFEF4444)),
      ),
      focusedErrorBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0xFFEF4444), width: 2),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isEditing = widget.user != null;

    return Scaffold(
      backgroundColor: _surfaceColor,
      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white,
        surfaceTintColor: Colors.transparent,
        leading: IconButton(
          icon: const Icon(Icons.arrow_back_ios_new, size: 20),
          onPressed: () => Navigator.pop(context),
          color: _textPrimary,
        ),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: _primaryColor.withOpacity(0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: Icon(
                isEditing ? Icons.edit_outlined : Icons.person_add_outlined,
                color: _primaryColor,
                size: 20,
              ),
            ),
            const SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  isEditing ? 'Editar Usuario' : 'Nuevo Usuario',
                  style: const TextStyle(
                    color: _textPrimary,
                    fontSize: 18,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                Text(
                  isEditing ? 'Actualiza la informacion' : 'Completa los datos',
                  style: const TextStyle(
                    color: _textSecondary,
                    fontSize: 12,
                    fontWeight: FontWeight.normal,
                  ),
                ),
              ],
            ),
          ],
        ),
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(1),
          child: Container(
            color: _borderColor,
            height: 1,
          ),
        ),
      ),
      body: _isLoading
          ? Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const CircularProgressIndicator(color: _primaryColor),
            const SizedBox(height: 16),
            Text(
              'Guardando...',
              style: TextStyle(color: _textSecondary, fontSize: 14),
            ),
          ],
        ),
      )
          : SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Form(
          key: _formKey,
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Seccion: Informacion Personal
              _buildSectionCard(
                title: 'Informacion Personal',
                subtitle: 'Datos basicos del usuario',
                icon: Icons.person_outline,
                iconColor: const Color(0xFF3B82F6),
                iconBgColor: const Color(0xFFDBEAFE),
                children: [
                  TextFormField(
                    controller: _usernameController,
                    decoration: _buildInputDecoration(
                      label: 'Nombre de Usuario',
                      icon: Icons.account_circle_outlined,
                      hint: 'Ingrese el nombre de usuario',
                    ),
                    validator: (v) =>
                    v!.isEmpty ? 'Campo obligatorio' : null,
                    style: const TextStyle(color: _textPrimary, fontSize: 14),
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _emailController,
                    decoration: _buildInputDecoration(
                      label: 'Correo Electronico',
                      icon: Icons.email_outlined,
                      hint: 'ejemplo@correo.com',
                    ),
                    validator: (v) =>
                    v!.isEmpty ? 'Campo obligatorio' : null,
                    keyboardType: TextInputType.emailAddress,
                    style: const TextStyle(color: _textPrimary, fontSize: 14),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              // Seccion: Seguridad
              _buildSectionCard(
                title: 'Seguridad',
                subtitle: isEditing
                    ? 'Deja en blanco para mantener la actual'
                    : 'Establece una contrasena segura',
                icon: Icons.lock_outline,
                iconColor: const Color(0xFF10B981),
                iconBgColor: const Color(0xFFD1FAE5),
                children: [
                  TextFormField(
                    controller: _passwordController,
                    decoration: _buildInputDecoration(
                      label: isEditing
                          ? 'Nueva Contrasena (opcional)'
                          : 'Contrasena',
                      icon: Icons.lock_outline,
                      hint: 'Ingrese la contrasena',
                      suffixIcon: IconButton(
                        icon: Icon(
                          _obscurePassword
                              ? Icons.visibility_outlined
                              : Icons.visibility_off_outlined,
                          color: _textSecondary,
                          size: 20,
                        ),
                        onPressed: () {
                          setState(() {
                            _obscurePassword = !_obscurePassword;
                          });
                        },
                      ),
                    ),
                    obscureText: _obscurePassword,
                    validator: (v) => (!isEditing && v!.isEmpty)
                        ? 'Campo obligatorio'
                        : null,
                    style: const TextStyle(color: _textPrimary, fontSize: 14),
                  ),
                ],
              ),

              const SizedBox(height: 16),

              // Seccion: Roles
              _buildSectionCard(
                title: 'Roles del Usuario',
                subtitle: 'Selecciona los permisos de acceso',
                icon: Icons.shield_outlined,
                iconColor: const Color(0xFF8B5CF6),
                iconBgColor: const Color(0xFFEDE9FE),
                children: [
                  if (_availableRoles.isEmpty)
                    Container(
                      padding: const EdgeInsets.all(24),
                      child: Column(
                        children: [
                          Container(
                            padding: const EdgeInsets.all(12),
                            decoration: BoxDecoration(
                              color: _surfaceColor,
                              shape: BoxShape.circle,
                            ),
                            child: const Icon(
                              Icons.hourglass_empty,
                              color: _textSecondary,
                              size: 24,
                            ),
                          ),
                          const SizedBox(height: 12),
                          const Text(
                            'Cargando roles...',
                            style: TextStyle(
                              color: _textSecondary,
                              fontSize: 14,
                            ),
                          ),
                        ],
                      ),
                    )
                  else
                    ...List.generate(_availableRoles.length, (index) {
                      final role = _availableRoles[index];
                      final roleId = role['id'];
                      final roleName =
                          role['nombre'] ?? role['name'] ?? 'Rol';
                      final isSelected = _selectedRoleIds.contains(roleId);

                      return Padding(
                        padding: EdgeInsets.only(
                          bottom:
                          index < _availableRoles.length - 1 ? 8 : 0,
                        ),
                        child: InkWell(
                          onTap: () {
                            setState(() {
                              if (isSelected) {
                                _selectedRoleIds.remove(roleId);
                              } else {
                                _selectedRoleIds.add(roleId);
                              }
                            });
                          },
                          borderRadius: BorderRadius.circular(12),
                          child: Container(
                            padding: const EdgeInsets.symmetric(
                              horizontal: 16,
                              vertical: 14,
                            ),
                            decoration: BoxDecoration(
                              color: isSelected
                                  ? _primaryColor.withOpacity(0.08)
                                  : _surfaceColor,
                              borderRadius: BorderRadius.circular(12),
                              border: Border.all(
                                color: isSelected
                                    ? _primaryColor
                                    : _borderColor,
                                width: isSelected ? 2 : 1,
                              ),
                            ),
                            child: Row(
                              children: [
                                Container(
                                  width: 40,
                                  height: 40,
                                  decoration: BoxDecoration(
                                    color: isSelected
                                        ? _primaryColor.withOpacity(0.15)
                                        : Colors.white,
                                    borderRadius:
                                    BorderRadius.circular(10),
                                    border: Border.all(
                                      color: isSelected
                                          ? _primaryColor.withOpacity(0.3)
                                          : _borderColor,
                                    ),
                                  ),
                                  child: Icon(
                                    Icons.verified_user_outlined,
                                    color: isSelected
                                        ? _primaryColor
                                        : _textSecondary,
                                    size: 20,
                                  ),
                                ),
                                const SizedBox(width: 14),
                                Expanded(
                                  child: Column(
                                    crossAxisAlignment:
                                    CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        roleName,
                                        style: TextStyle(
                                          color: isSelected
                                              ? _primaryColor
                                              : _textPrimary,
                                          fontWeight: FontWeight.w600,
                                          fontSize: 14,
                                        ),
                                      ),
                                      const SizedBox(height: 2),
                                      Text(
                                        'ID: $roleId',
                                        style: const TextStyle(
                                          color: _textSecondary,
                                          fontSize: 12,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                Container(
                                  width: 24,
                                  height: 24,
                                  decoration: BoxDecoration(
                                    color: isSelected
                                        ? _primaryColor
                                        : Colors.white,
                                    borderRadius:
                                    BorderRadius.circular(6),
                                    border: Border.all(
                                      color: isSelected
                                          ? _primaryColor
                                          : _borderColor,
                                      width: 2,
                                    ),
                                  ),
                                  child: isSelected
                                      ? const Icon(
                                    Icons.check,
                                    color: Colors.white,
                                    size: 16,
                                  )
                                      : null,
                                ),
                              ],
                            ),
                          ),
                        ),
                      );
                    }),
                ],
              ),

              const SizedBox(height: 24),

              // Botones de accion
              Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.pop(context),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        side: const BorderSide(color: _borderColor),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: const [
                          Icon(Icons.close, size: 18, color: _textSecondary),
                          SizedBox(width: 8),
                          Text(
                            'Cancelar',
                            style: TextStyle(
                              color: _textSecondary,
                              fontWeight: FontWeight.w600,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    flex: 2,
                    child: ElevatedButton(
                      onPressed: _save,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: _primaryColor,
                        foregroundColor: Colors.white,
                        elevation: 0,
                        padding: const EdgeInsets.symmetric(vertical: 16),
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(12),
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: [
                          Icon(
                            isEditing ? Icons.check : Icons.add,
                            size: 18,
                          ),
                          const SizedBox(width: 8),
                          Text(
                            isEditing ? 'Guardar Cambios' : 'Crear Usuario',
                            style: const TextStyle(
                              fontWeight: FontWeight.w600,
                              fontSize: 15,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildSectionCard({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color iconColor,
    required Color iconBgColor,
    required List<Widget> children,
  }) {
    return Container(
      decoration: BoxDecoration(
        color: _cardColor,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: _borderColor),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.03),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header de la seccion
          Container(
            padding: const EdgeInsets.all(16),
            decoration: BoxDecoration(
              color: _surfaceColor,
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(16),
              ),
              border: Border(
                bottom: BorderSide(color: _borderColor),
              ),
            ),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: iconBgColor,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Icon(icon, color: iconColor, size: 20),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: const TextStyle(
                          color: _textPrimary,
                          fontSize: 15,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        subtitle,
                        style: const TextStyle(
                          color: _textSecondary,
                          fontSize: 12,
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
          // Contenido
          Padding(
            padding: const EdgeInsets.all(16),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: children,
            ),
          ),
        ],
      ),
    );
  }
}