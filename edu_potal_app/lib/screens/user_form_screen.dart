import 'package:flutter/material.dart';
import '../services/api_service.dart';

class UserFormScreen extends StatefulWidget {
  final dynamic user; // Si es null, es creación. Si no, es edición.
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

  @override
  void initState() {
    super.initState();
    _usernameController = TextEditingController(text: widget.user?['username'] ?? '');
    _emailController = TextEditingController(text: widget.user?['email'] ?? '');
    _passwordController = TextEditingController();

    if (widget.user != null && widget.user['roles'] != null) {
      _selectedRoleIds = (widget.user['roles'] as List).map((r) => r['id'] as int).toList();
    }

    _loadRoles();
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
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Debe seleccionar al menos un rol')),
      );
      return;
    }

    setState(() => _isLoading = true);

    final userData = {
      'username': _usernameController.text,
      'email': _emailController.text,
      'password': _passwordController.text.isNotEmpty ? _passwordController.text : null,
      'roles': _selectedRoleIds,
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
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Error al guardar el usuario')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final isEditing = widget.user != null;

    return Scaffold(
      appBar: AppBar(
        title: Text(isEditing ? 'Editar Usuario' : 'Nuevo Usuario'),
        backgroundColor: const Color(0xFF203A43),
        foregroundColor: Colors.white,
      ),
      body: _isLoading 
        ? const Center(child: CircularProgressIndicator())
        : Padding(
            padding: const EdgeInsets.all(20),
            child: Form(
              key: _formKey,
              child: ListView(
                children: [
                  TextFormField(
                    controller: _usernameController,
                    decoration: const InputDecoration(labelText: 'Nombre de Usuario', border: OutlineInputBorder()),
                    validator: (v) => v!.isEmpty ? 'Campo obligatorio' : null,
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _emailController,
                    decoration: const InputDecoration(labelText: 'Email', border: OutlineInputBorder()),
                    validator: (v) => v!.isEmpty ? 'Campo obligatorio' : null,
                    keyboardType: TextInputType.emailAddress,
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _passwordController,
                    decoration: InputDecoration(
                      labelText: isEditing ? 'Nueva Contraseña (opcional)' : 'Contraseña',
                      border: const OutlineInputBorder(),
                    ),
                    obscureText: true,
                    validator: (v) => (!isEditing && v!.isEmpty) ? 'Campo obligatorio' : null,
                  ),
                  const SizedBox(height: 24),
                  const Text('Roles:', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  ..._availableRoles.map((role) {
                    final roleId = role['id'];
                    final roleName = role['nombre'] ?? role['name'] ?? 'Rol';
                    return CheckboxListTile(
                      title: Text(roleName),
                      value: _selectedRoleIds.contains(roleId),
                      onChanged: (val) {
                        setState(() {
                          if (val == true) {
                            _selectedRoleIds.add(roleId);
                          } else {
                            _selectedRoleIds.remove(roleId);
                          }
                        });
                      },
                    );
                  }),
                  const SizedBox(height: 32),
                  ElevatedButton(
                    onPressed: _save,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF2C5364),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    child: Text(isEditing ? 'Actualizar' : 'Crear Usuario'),
                  ),
                ],
              ),
            ),
          ),
    );
  }
}
