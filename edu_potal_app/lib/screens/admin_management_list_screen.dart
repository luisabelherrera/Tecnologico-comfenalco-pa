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

class _AdminManagementListScreenState extends State<AdminManagementListScreen> {
  List<dynamic> _data = [];
  bool _isLoading = true;
  final ApiService _apiService = ApiService();

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);
    try {
      final results = await widget.fetchData();
      setState(() {
        _data = results;
        _isLoading = false;
      });
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
              content: Text('Error al cargar ${widget.title.toLowerCase()}')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        title: Text(widget.title),
        backgroundColor: widget.themeColor,
        foregroundColor: Colors.white,
        elevation: 0,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _loadData,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _data.isEmpty
              ? _buildEmptyState()
              : ListView.separated(
                  padding: const EdgeInsets.all(16),
                  itemCount: _data.length,
                  separatorBuilder: (_, __) => const SizedBox(height: 12),
                  itemBuilder: (context, index) {
                    final item = _data[index];
                    return _buildItemCard(item);
                  },
                ),
      floatingActionButton: widget.endpoint != null && widget.formFields != null
          ? FloatingActionButton(
              onPressed: () => _showFormDialog(),
              backgroundColor: widget.themeColor,
              child: const Icon(Icons.add, color: Colors.white),
            )
          : null,
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(widget.icon, size: 80, color: Colors.grey.withOpacity(0.5)),
          const SizedBox(height: 16),
          Text(
            'No hay datos disponibles',
            style: TextStyle(
                fontSize: 18,
                color: Colors.grey.shade600,
                fontWeight: FontWeight.bold),
          ),
          const SizedBox(height: 8),
          Text(
            'Presiona + para agregar uno nuevo',
            style: TextStyle(color: Colors.grey.shade500),
          ),
        ],
      ),
    );
  }

  Widget _buildItemCard(dynamic item) {
    // Intentar extraer campos comunes (nombre, titulo, descripcion, etc.)
    final String title =
        item['nombre'] ?? item['titulo'] ?? item['descripcion'] ?? 'Sin título';
    final String subtitle =
        item['codigo'] ?? item['roles']?.toString() ?? item['email'] ?? '';

    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 8),
        leading: CircleAvatar(
          backgroundColor: widget.themeColor.withOpacity(0.1),
          child: Icon(widget.icon, color: widget.themeColor, size: 20),
        ),
        title: Text(
          title,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        subtitle: subtitle.isNotEmpty ? Text(subtitle) : null,
        trailing: widget.endpoint != null
            ? IconButton(
                icon: const Icon(Icons.delete_outline, color: Colors.red),
                onPressed: () => _confirmDelete(item),
              )
            : const Icon(Icons.arrow_forward_ios, size: 14, color: Colors.grey),
        onTap: () {
          if (widget.endpoint != null && widget.formFields != null) {
            _showFormDialog(item: item);
          }
        },
      ),
    );
  }

  void _confirmDelete(dynamic item) {
    showDialog(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Confirmar Eliminación'),
        content:
            const Text('¿Estás seguro de que deseas eliminar este registro?'),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(ctx),
              child: const Text('Cancelar')),
          TextButton(
            onPressed: () async {
              Navigator.pop(ctx);
              final id = item['id'] ?? item['idPeriodo'] ?? item['idNivel'];
              if (id != null) {
                final success =
                    await _apiService.deleteEntity(widget.endpoint!, id);
                if (success) {
                  _loadData();
                  ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Registro eliminado')));
                } else {
                  ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Error al eliminar')));
                }
              }
            },
            child: const Text('Eliminar', style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );
  }

  void _showFormDialog({dynamic item}) {
    final Map<String, dynamic> formData = {};
    if (item != null) {
      formData.addAll(item as Map<String, dynamic>);
    }

    showDialog(
      context: context,
      builder: (ctx) {
        return StatefulBuilder(builder: (context, setState) {
          return AlertDialog(
            title: Text(item == null ? 'Crear Nuevo' : 'Editar Registro'),
            content: SingleChildScrollView(
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: widget.formFields!.map((field) {
                  final key = field['key'] as String;
                  final label = field['label'] as String;
                  final type = field['type'] as String;

                  if (type == 'bool') {
                    formData[key] = formData[key] ?? false;
                    return SwitchListTile(
                      title: Text(label),
                      value: formData[key] as bool,
                      onChanged: (val) => setState(() => formData[key] = val),
                    );
                  } else if (type == 'date') {
                    return ListTile(
                      title: Text(label),
                      subtitle: Text(
                          formData[key]?.toString().split('T').first ??
                              'Seleccionar fecha'),
                      trailing: const Icon(Icons.calendar_today),
                      onTap: () async {
                        final date = await showDatePicker(
                          context: context,
                          initialDate: DateTime.now(),
                          firstDate: DateTime(2000),
                          lastDate: DateTime(2100),
                        );
                        if (date != null) {
                          setState(
                              () => formData[key] = date.toIso8601String());
                        }
                      },
                    );
                  }

                  return Padding(
                    padding: const EdgeInsets.only(bottom: 12.0),
                    child: TextFormField(
                      initialValue: formData[key]?.toString() ?? '',
                      decoration: InputDecoration(
                          labelText: label, border: const OutlineInputBorder()),
                      onChanged: (val) => formData[key] = val,
                    ),
                  );
                }).toList(),
              ),
            ),
            actions: [
              TextButton(
                  onPressed: () => Navigator.pop(ctx),
                  child: const Text('Cancelar')),
              ElevatedButton(
                onPressed: () async {
                  Navigator.pop(ctx);
                  bool success = false;
                  if (item == null) {
                    if (formData.containsKey('roles')) {
                      formData['roles'] = (formData['roles'] as List)
                          .map((roleId) => {'id': roleId})
                          .toList();
                    }
                    success = await _apiService.createEntity(
                        widget.endpoint!, formData);
                  } else {
                    final id =
                        item['id'] ?? item['idPeriodo'] ?? item['idNivel'];
                    success = await _apiService.updateEntity(
                        widget.endpoint!, id, formData);
                  }
                  if (success) {
                    _loadData();
                    ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Operación exitosa')));
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Error en la operación')));
                  }
                },
                style: ElevatedButton.styleFrom(
                    backgroundColor: widget.themeColor),
                child: Text('Guardar',
                    style: const TextStyle(color: Colors.white)),
              ),
            ],
          );
        });
      },
    );
  }
}
