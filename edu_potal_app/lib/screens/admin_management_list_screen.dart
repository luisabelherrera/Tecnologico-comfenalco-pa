import 'package:flutter/material.dart';
import '../services/api_service.dart';

class AdminManagementListScreen extends StatefulWidget {
  final String title;
  final Future<List<dynamic>> Function() fetchData;
  final IconData icon;
  final Color themeColor;
  final String? endpoint;
  final List<Map<String, dynamic>>? formFields;

  const AdminManagementListScreen({
    super.key,
    required this.title,
    required this.fetchData,
    required this.icon,
    this.themeColor = Colors.blue,
    this.endpoint,
    this.formFields,
  });

  @override
  State<AdminManagementListScreen> createState() =>
      _AdminManagementListScreenState();
}

class _AdminManagementListScreenState extends State<AdminManagementListScreen>
    with TickerProviderStateMixin {
  List<dynamic> _data = [];
  bool _isLoading = true;
  bool _hasError = false;
  final ApiService _apiService = ApiService();

  late AnimationController _headerAnim;
  late AnimationController _listAnim;
  late Animation<double> _headerFade;

  // Paleta de colores coherente
  static const _primaryDark = Color(0xFF0F2027);
  static const _primaryMid = Color(0xFF203A43);
  static const _primaryLight = Color(0xFF2C5364);
  static const _accentGold = Color(0xFFFFD700);
  static const _accentRed = Color(0xFFFF6B6B);
  static const _accentGreen = Color(0xFF4ADE80);

  @override
  void initState() {
    super.initState();
    _headerAnim = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    _headerFade = CurvedAnimation(parent: _headerAnim, curve: Curves.easeOutCubic);

    _listAnim = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 600),
    );

    _headerAnim.forward();
    _loadData();
  }

  @override
  void dispose() {
    _headerAnim.dispose();
    _listAnim.dispose();
    super.dispose();
  }

  Future<void> _loadData() async {
    setState(() {
      _isLoading = true;
      _hasError = false;
    });
    try {
      final results = await widget.fetchData();
      setState(() {
        _data = results;
        _isLoading = false;
      });
      _listAnim.forward(from: 0);
    } catch (e) {
      setState(() {
        _isLoading = false;
        _hasError = true;
      });
      if (mounted) {
        _showSnackBar('Error al cargar ${widget.title.toLowerCase()}', isError: true);
      }
    }
  }

  void _showSnackBar(String message, {bool isError = false, bool isSuccess = false}) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            Icon(
              isError ? Icons.error_outline_rounded :
              isSuccess ? Icons.check_circle_rounded : Icons.info_outline_rounded,
              color: Colors.white,
            ),
            const SizedBox(width: 12),
            Expanded(child: Text(message)),
          ],
        ),
        backgroundColor: isError ? _accentRed : isSuccess ? _accentGreen : _primaryMid,
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
        margin: const EdgeInsets.all(16),
      ),
    );
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
          child: Column(
            children: [
              FadeTransition(
                opacity: _headerFade,
                child: _buildHeader(),
              ),
              Expanded(
                child: _isLoading
                    ? _buildLoadingState()
                    : _hasError
                    ? _buildErrorState()
                    : _data.isEmpty
                    ? _buildEmptyState()
                    : _buildList(),
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: widget.endpoint != null && widget.formFields != null
          ? _buildFAB()
          : null,
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 20),
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
          Container(
            padding: const EdgeInsets.all(10),
            decoration: BoxDecoration(
              color: widget.themeColor.withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Icon(widget.icon, color: widget.themeColor, size: 22),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  widget.title,
                  style: const TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                  ),
                  overflow: TextOverflow.ellipsis,
                ),
                if (!_isLoading && !_hasError)
                  Text(
                    '${_data.length} registros',
                    style: TextStyle(
                      fontSize: 12,
                      color: Colors.white.withOpacity(0.6),
                    ),
                  ),
              ],
            ),
          ),
          Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: _loadData,
              borderRadius: BorderRadius.circular(14),
              child: Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: Colors.white.withOpacity(0.15)),
                ),
                child: const Icon(
                  Icons.refresh_rounded,
                  color: Colors.white,
                  size: 22,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLoadingState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.1),
              shape: BoxShape.circle,
              border: Border.all(color: Colors.white.withOpacity(0.15)),
            ),
            child: CircularProgressIndicator(
              color: widget.themeColor,
              strokeWidth: 3,
            ),
          ),
          const SizedBox(height: 20),
          Text(
            'Cargando ${widget.title.toLowerCase()}...',
            style: TextStyle(
              color: Colors.white.withOpacity(0.8),
              fontSize: 16,
              fontWeight: FontWeight.w500,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildErrorState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(24),
              decoration: BoxDecoration(
                color: _accentRed.withOpacity(0.15),
                shape: BoxShape.circle,
              ),
              child: const Icon(
                Icons.error_outline_rounded,
                color: _accentRed,
                size: 48,
              ),
            ),
            const SizedBox(height: 20),
            const Text(
              'Error al cargar datos',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: Colors.white,
              ),
            ),
            const SizedBox(height: 8),
            Text(
              'No se pudo conectar con el servidor',
              style: TextStyle(
                fontSize: 14,
                color: Colors.white.withOpacity(0.6),
              ),
            ),
            const SizedBox(height: 24),
            ElevatedButton.icon(
              onPressed: _loadData,
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

  Widget _buildEmptyState() {
    return Center(
      child: Padding(
        padding: const EdgeInsets.symmetric(horizontal: 32),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Container(
              padding: const EdgeInsets.all(28),
              decoration: BoxDecoration(
                color: widget.themeColor.withOpacity(0.15),
                shape: BoxShape.circle,
                border: Border.all(
                  color: widget.themeColor.withOpacity(0.2),
                  width: 2,
                ),
              ),
              child: Icon(
                widget.icon,
                size: 56,
                color: widget.themeColor,
              ),
            ),
            const SizedBox(height: 24),
            Text(
              'No hay ${widget.title.toLowerCase()}',
              style: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: Colors.white,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              widget.endpoint != null
                  ? 'Presiona + para agregar uno nuevo'
                  : 'No se encontraron registros',
              style: TextStyle(
                fontSize: 14,
                color: Colors.white.withOpacity(0.6),
              ),
              textAlign: TextAlign.center,
            ),
            if (widget.endpoint != null && widget.formFields != null) ...[
              const SizedBox(height: 28),
              ElevatedButton.icon(
                onPressed: () => _showFormDialog(),
                style: ElevatedButton.styleFrom(
                  backgroundColor: widget.themeColor,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(12),
                  ),
                ),
                icon: const Icon(Icons.add_rounded),
                label: const Text(
                  'Crear Nuevo',
                  style: TextStyle(fontWeight: FontWeight.w600),
                ),
              ),
            ],
          ],
        ),
      ),
    );
  }

  Widget _buildList() {
    return ListView.builder(
      padding: const EdgeInsets.fromLTRB(16, 0, 16, 100),
      physics: const BouncingScrollPhysics(),
      itemCount: _data.length,
      itemBuilder: (context, index) {
        final item = _data[index];
        return TweenAnimationBuilder<double>(
          tween: Tween(begin: 0.0, end: 1.0),
          duration: Duration(milliseconds: 300 + (index * 50).clamp(0, 300)),
          curve: Curves.easeOutCubic,
          builder: (context, value, child) {
            return Transform.translate(
              offset: Offset(0, 30 * (1 - value)),
              child: Opacity(opacity: value, child: child),
            );
          },
          child: _buildItemCard(item, index),
        );
      },
    );
  }

  Widget _buildItemCard(dynamic item, int index) {
    String title = 'Sin titulo';
    if (item['nombres'] != null && item['apellidos'] != null) {
      title = '${item['nombres']} ${item['apellidos']}';
    } else if (item['nombre'] != null) {
      title = item['nombre'];
    } else if (item['titulo'] != null) {
      title = item['titulo'];
    } else if (item['descripcion'] != null) {
      title = item['descripcion'];
    } else if (item['username'] != null) {
      title = item['username'];
    }
    
    final String subtitle = _getSubtitle(item);
    final bool isActive = item['activo'] ?? item['estado'] ?? true;

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Colors.white.withOpacity(0.12),
            Colors.white.withOpacity(0.05),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: Colors.white.withOpacity(0.1)),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: widget.endpoint != null && widget.formFields != null
              ? () => _showFormDialog(item: item)
              : null,
          borderRadius: BorderRadius.circular(18),
          splashColor: widget.themeColor.withOpacity(0.2),
          child: Padding(
            padding: const EdgeInsets.all(16),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      colors: [
                        widget.themeColor,
                        widget.themeColor.withOpacity(0.7),
                      ],
                    ),
                    borderRadius: BorderRadius.circular(14),
                    boxShadow: [
                      BoxShadow(
                        color: widget.themeColor.withOpacity(0.3),
                        blurRadius: 8,
                        offset: const Offset(0, 3),
                      ),
                    ],
                  ),
                  child: Icon(widget.icon, color: Colors.white, size: 22),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              title,
                              style: const TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.w700,
                                color: Colors.white,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          const SizedBox(width: 8),
                          _buildStatusBadge(isActive),
                        ],
                      ),
                      if (subtitle.isNotEmpty) ...[
                        const SizedBox(height: 4),
                        Text(
                          subtitle,
                          style: TextStyle(
                            fontSize: 13,
                            color: Colors.white.withOpacity(0.6),
                          ),
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                if (widget.endpoint != null)
                  Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      _buildActionIcon(
                        Icons.edit_rounded,
                        Colors.blue,
                            () => _showFormDialog(item: item),
                      ),
                      const SizedBox(width: 8),
                      _buildActionIcon(
                        Icons.delete_outline_rounded,
                        _accentRed,
                            () => _confirmDelete(item),
                      ),
                    ],
                  )
                else
                  Icon(
                    Icons.arrow_forward_ios_rounded,
                    size: 16,
                    color: Colors.white.withOpacity(0.4),
                  ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  String _getSubtitle(dynamic item) {
    if (item['documentoIdentidad'] != null) return 'Documento: ${item['documentoIdentidad']}';
    if (item['codigo'] != null) return 'Codigo: ${item['codigo']}';
    if (item['email'] != null) return item['email'];
    if (item['fechaInicio'] != null) {
      return 'Inicio: ${item['fechaInicio'].toString().split('T').first}';
    }
    if (item['roles'] != null) {
      if (item['roles'] is List && (item['roles'] as List).isNotEmpty) {
        final firstRole = (item['roles'] as List)[0];
        if (firstRole is Map && firstRole.containsKey('nombre')) {
          return 'Rol: ${firstRole['nombre']}';
        }
      }
      return 'Roles: ${item['roles']}';
    }
    return '';
  }

  Widget _buildStatusBadge(bool isActive) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
      decoration: BoxDecoration(
        color: (isActive ? _accentGreen : _accentRed).withOpacity(0.2),
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        isActive ? 'Activo' : 'Inactivo',
        style: TextStyle(
          fontSize: 10,
          fontWeight: FontWeight.w600,
          color: isActive ? _accentGreen : _accentRed,
        ),
      ),
    );
  }

  Widget _buildActionIcon(IconData icon, Color color, VoidCallback onTap) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(10),
        child: Container(
          padding: const EdgeInsets.all(8),
          decoration: BoxDecoration(
            color: color.withOpacity(0.15),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Icon(icon, color: color, size: 18),
        ),
      ),
    );
  }

  void _confirmDelete(dynamic item) {
    String title = 'este registro';
    if (item['nombres'] != null && item['apellidos'] != null) {
      title = '${item['nombres']} ${item['apellidos']}';
    } else if (item['nombre'] != null) {
      title = item['nombre'];
    } else if (item['titulo'] != null) {
      title = item['titulo'];
    } else if (item['descripcion'] != null) {
      title = item['descripcion'];
    } else if (item['username'] != null) {
      title = item['username'];
    }

    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
        title: Row(
          children: [
            Container(
              padding: const EdgeInsets.all(8),
              decoration: BoxDecoration(
                color: _accentRed.withOpacity(0.1),
                borderRadius: BorderRadius.circular(10),
              ),
              child: const Icon(Icons.delete_outline_rounded, color: _accentRed),
            ),
            const SizedBox(width: 12),
            const Expanded(child: Text('Eliminar Registro')),
          ],
        ),
        content: Text('Estas seguro que deseas eliminar "$title"?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: Text('Cancelar', style: TextStyle(color: Colors.grey.shade600)),
          ),
          ElevatedButton(
            onPressed: () async {
              Navigator.pop(ctx);
              final id = item['id'] ??
                  item['idPeriodo'] ??
                  item['idNivel'] ??
                  item['idDocente'] ??
                  item['idCurso'] ??
                  item['idCalificacion'];
              if (id != null) {
                final success =
                await _apiService.deleteEntity(widget.endpoint!, id);
                if (success) {
                  _loadData();
                  _showSnackBar('Registro eliminado correctamente', isSuccess: true);
                } else {
                  _showSnackBar('Error al eliminar el registro', isError: true);
                }
              }
            },
            style: ElevatedButton.styleFrom(
              backgroundColor: _accentRed,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
            ),
            child: const Text('Eliminar'),
          ),
        ],
      ),
    );
  }

  dynamic _getNestedValue(Map<String, dynamic> data, String key) {
    if (key.contains('.')) {
      final parts = key.split('.');
      if (data.containsKey(parts[0]) && data[parts[0]] is Map) {
        return data[parts[0]][parts[1]];
      }
    }
    return data[key];
  }

  void _showFormDialog({dynamic item}) {
    final Map<String, dynamic> formData = {};
    if (item != null) {
      formData.addAll(item as Map<String, dynamic>);
    }

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) {
        return StatefulBuilder(builder: (context, setState) {
          return Container(
            height: MediaQuery.of(context).size.height * 0.85,
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [_primaryDark, _primaryMid],
                begin: Alignment.topCenter,
                end: Alignment.bottomCenter,
              ),
              borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
            ),
            child: Column(
              children: [
                // Handle bar
                Container(
                  margin: const EdgeInsets.only(top: 12),
                  width: 40,
                  height: 4,
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.3),
                    borderRadius: BorderRadius.circular(2),
                  ),
                ),
                // Header
                Padding(
                  padding: const EdgeInsets.all(20),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: widget.themeColor.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Icon(
                          item == null ? Icons.add_rounded : Icons.edit_rounded,
                          color: widget.themeColor,
                          size: 22,
                        ),
                      ),
                      const SizedBox(width: 14),
                      Text(
                        item == null ? 'Crear Nuevo' : 'Editar Registro',
                        style: const TextStyle(
                          fontSize: 20,
                          fontWeight: FontWeight.w700,
                          color: Colors.white,
                        ),
                      ),
                      const Spacer(),
                      Material(
                        color: Colors.transparent,
                        child: InkWell(
                          onTap: () => Navigator.pop(ctx),
                          borderRadius: BorderRadius.circular(10),
                          child: Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: const Icon(
                              Icons.close_rounded,
                              color: Colors.white,
                              size: 20,
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
                Divider(color: Colors.white.withOpacity(0.1)),
                // Form fields
                Expanded(
                  child: ListView(
                    padding: const EdgeInsets.all(20),
                    children: widget.formFields!.map((field) {
                      final key = field['key'] as String;
                      final label = field['label'] as String;
                      final type = field['type'] as String;

                      if (type == 'bool') {
                        final initialVal = _getNestedValue(formData, key) ?? false;
                        formData[key] = initialVal;
                        return _buildSwitchField(label, formData[key] as bool, (val) {
                          setState(() => formData[key] = val);
                        });
                      } else if (type == 'date') {
                        final initialDate = _getNestedValue(formData, key);
                        return _buildDateField(label, initialDate, (date) {
                          setState(() => formData[key] = date.toIso8601String());
                        });
                      }

                      return _buildTextField(
                        label,
                        _getNestedValue(formData, key)?.toString() ?? '',
                            (val) => formData[key] = val,
                      );
                    }).toList(),
                  ),
                ),
                // Actions
                Container(
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    color: Colors.black.withOpacity(0.2),
                    border: Border(
                      top: BorderSide(color: Colors.white.withOpacity(0.1)),
                    ),
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () => Navigator.pop(ctx),
                          style: OutlinedButton.styleFrom(
                            foregroundColor: Colors.white,
                            side: BorderSide(color: Colors.white.withOpacity(0.3)),
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          child: const Text('Cancelar'),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        flex: 2,
                        child: ElevatedButton.icon(
                          onPressed: () => _saveForm(ctx, item, formData),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: widget.themeColor,
                            foregroundColor: Colors.white,
                            padding: const EdgeInsets.symmetric(vertical: 14),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(12),
                            ),
                          ),
                          icon: const Icon(Icons.save_rounded, size: 20),
                          label: const Text(
                            'Guardar',
                            style: TextStyle(fontWeight: FontWeight.w600),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          );
        });
      },
    );
  }

  Widget _buildTextField(String label, String initialValue, Function(String) onChanged) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: Colors.white.withOpacity(0.8),
            ),
          ),
          const SizedBox(height: 8),
          TextFormField(
            initialValue: initialValue,
            style: const TextStyle(color: Colors.white, fontSize: 15),
            decoration: InputDecoration(
              hintText: 'Ingresa $label',
              hintStyle: TextStyle(color: Colors.white.withOpacity(0.4)),
              filled: true,
              fillColor: Colors.white.withOpacity(0.08),
              border: OutlineInputBorder(
                borderRadius: BorderRadius.circular(14),
                borderSide: BorderSide(color: Colors.white.withOpacity(0.1)),
              ),
              enabledBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(14),
                borderSide: BorderSide(color: Colors.white.withOpacity(0.1)),
              ),
              focusedBorder: OutlineInputBorder(
                borderRadius: BorderRadius.circular(14),
                borderSide: BorderSide(color: widget.themeColor, width: 2),
              ),
              contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
            ),
            onChanged: onChanged,
          ),
        ],
      ),
    );
  }

  Widget _buildSwitchField(String label, bool value, Function(bool) onChanged) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white.withOpacity(0.08),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: Colors.white.withOpacity(0.1)),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: const TextStyle(
              fontSize: 15,
              fontWeight: FontWeight.w500,
              color: Colors.white,
            ),
          ),
          Switch(
            value: value,
            onChanged: onChanged,
            activeColor: widget.themeColor,
          ),
        ],
      ),
    );
  }

  Widget _buildDateField(String label, dynamic initialDate, Function(DateTime) onChanged) {
    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            label,
            style: TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w600,
              color: Colors.white.withOpacity(0.8),
            ),
          ),
          const SizedBox(height: 8),
          Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: () async {
                final date = await showDatePicker(
                  context: context,
                  initialDate: DateTime.now(),
                  firstDate: DateTime(2000),
                  lastDate: DateTime(2100),
                  builder: (context, child) {
                    return Theme(
                      data: Theme.of(context).copyWith(
                        colorScheme: ColorScheme.dark(
                          primary: widget.themeColor,
                          surface: _primaryMid,
                        ),
                      ),
                      child: child!,
                    );
                  },
                );
                if (date != null) {
                  onChanged(date);
                }
              },
              borderRadius: BorderRadius.circular(14),
              child: Container(
                padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                decoration: BoxDecoration(
                  color: Colors.white.withOpacity(0.08),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: Colors.white.withOpacity(0.1)),
                ),
                child: Row(
                  children: [
                    Icon(
                      Icons.calendar_today_rounded,
                      color: Colors.white.withOpacity(0.6),
                      size: 20,
                    ),
                    const SizedBox(width: 12),
                    Text(
                      initialDate?.toString().split('T').first ?? 'Seleccionar fecha',
                      style: TextStyle(
                        color: initialDate != null
                            ? Colors.white
                            : Colors.white.withOpacity(0.4),
                        fontSize: 15,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> _saveForm(BuildContext ctx, dynamic item, Map<String, dynamic> formData) async {
    Navigator.pop(ctx);
    bool success = false;

    Map<String, dynamic> finalData = {};
    formData.forEach((k, v) {
      if (k.contains('.')) {
        final parts = k.split('.');
        if (!finalData.containsKey(parts[0])) finalData[parts[0]] = {};
        finalData[parts[0]][parts[1]] =
        (int.tryParse(v.toString()) ?? double.tryParse(v.toString()) ?? v);
      } else if (k == 'nota') {
        finalData[k] = double.tryParse(v.toString()) ?? v;
      } else {
        finalData[k] = v;
      }
    });

    if (item == null) {
      if (finalData.containsKey('roles') && finalData['roles'] is List) {
        finalData['roles'] =
            (finalData['roles'] as List).map((roleId) => {'id': roleId}).toList();
      }
      success = await _apiService.createEntity(widget.endpoint!, finalData);
    } else {
      final id = item['id'] ??
          item['idPeriodo'] ??
          item['idNivel'] ??
          item['idDocente'] ??
          item['idCurso'] ??
          item['idCalificacion'];
      success = await _apiService.updateEntity(widget.endpoint!, id, finalData);
    }

    if (success) {
      _loadData();
      _showSnackBar('Operacion exitosa', isSuccess: true);
    } else {
      _showSnackBar('Error en la operacion', isError: true);
    }
  }

  Widget _buildFAB() {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        gradient: LinearGradient(
          colors: [widget.themeColor, widget.themeColor.withOpacity(0.7)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: [
          BoxShadow(
            color: widget.themeColor.withOpacity(0.4),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: FloatingActionButton(
        onPressed: () => _showFormDialog(),
        backgroundColor: Colors.transparent,
        elevation: 0,
        highlightElevation: 0,
        child: const Icon(Icons.add_rounded, color: Colors.white, size: 28),
      ),
    );
  }
}