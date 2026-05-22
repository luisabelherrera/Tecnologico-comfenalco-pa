import 'package:flutter/material.dart';
import '../services/api_service.dart';
import 'prediction_form_screen.dart';
import 'prediction_history_screen.dart';

class PredictionsDashboardScreen extends StatefulWidget {
  const PredictionsDashboardScreen({super.key});

  @override
  State<PredictionsDashboardScreen> createState() => _PredictionsDashboardScreenState();
}

class _PredictionsDashboardScreenState extends State<PredictionsDashboardScreen> {
  final ApiService _apiService = ApiService();
  bool _isLoading = true;
  bool _isServiceOnline = false;
  Map<String, dynamic>? _metricas;

  @override
  void initState() {
    super.initState();
    _loadData();
  }

  Future<void> _loadData() async {
    setState(() => _isLoading = true);

    // 1. Verificar estado
    _isServiceOnline = await _apiService.checkHealthFastAPI();

    // 2. Obtener métricas
    if (_isServiceOnline) {
      _metricas = await _apiService.obtenerMetricasModelo();
    } else {
      _metricas = null;
    }

    if (mounted) setState(() => _isLoading = false);
  }

  Future<void> _reentrenar() async {
    final confirmar = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        title: const Text('Reentrenar Modelo'),
        content: const Text(
          'Esto leerá los datos actuales de la base de datos de estudiantes, generará un nuevo dataset y reentrenará el modelo de Machine Learning.\n\nEste proceso puede tomar varios minutos. ¿Deseas continuar?'
        ),
        actions: [
          TextButton(onPressed: () => Navigator.pop(ctx, false), child: const Text('Cancelar')),
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: ElevatedButton.styleFrom(backgroundColor: const Color(0xFF4F46E5), foregroundColor: Colors.white),
            child: const Text('Reentrenar'),
          ),
        ],
      ),
    );

    if (confirmar != true) return;

    // Mostrar modal de carga
    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (ctx) => const AlertDialog(
        content: Row(
          children: [
            CircularProgressIndicator(color: Color(0xFF4F46E5)),
            SizedBox(width: 20),
            Expanded(child: Text('Reentrenando modelo... Por favor espera.')),
          ],
        ),
      ),
    );

    try {
      final res = await _apiService.reentrenarModeloIA();
      Navigator.pop(context); // cerrar modal
      
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(res['mensaje'] ?? 'Modelo reentrenado exitosamente.'), backgroundColor: Colors.green),
      );
      
      _loadData(); // Recargar métricas
    } catch (e) {
      Navigator.pop(context); // cerrar modal
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error al reentrenar: $e'), backgroundColor: Colors.red),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        elevation: 0,
        title: const Text('Dashboard IA', style: TextStyle(fontWeight: FontWeight.w600)),
        backgroundColor: const Color(0xFF4F46E5),
        foregroundColor: Colors.white,
        centerTitle: true,
        actions: [
          IconButton(
            onPressed: _loadData,
            icon: const Icon(Icons.refresh_rounded),
            tooltip: 'Actualizar',
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator(valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF4F46E5))))
          : RefreshIndicator(
              onRefresh: _loadData,
              child: SingleChildScrollView(
                physics: const AlwaysScrollableScrollPhysics(),
                child: Column(
                  children: [
                    _buildHeader(),
                    if (!_isServiceOnline)
                      _buildOfflineWarning()
                    else ...[
                      _buildMetricsGrid(),
                      const SizedBox(height: 20),
                      _buildHistoryButton(),
                      const SizedBox(height: 16),
                      _buildActionButtons(),
                      const SizedBox(height: 40), // Espacio para el FAB
                    ]
                  ],
                ),
              ),
            ),
      floatingActionButton: _isServiceOnline
          ? FloatingActionButton.extended(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const PredictionFormScreen()),
                );
              },
              backgroundColor: const Color(0xFF4F46E5),
              icon: const Icon(Icons.add_chart_rounded, color: Colors.white),
              label: const Text('Nueva Predicción', style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
            )
          : null,
    );
  }

  Widget _buildHeader() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.fromLTRB(20, 20, 20, 30),
      decoration: const BoxDecoration(
        gradient: LinearGradient(
          colors: [Color(0xFF4F46E5), Color(0xFF6366F1)],
          begin: Alignment.topCenter,
          end: Alignment.bottomCenter,
        ),
        borderRadius: BorderRadius.only(
          bottomLeft: Radius.circular(24),
          bottomRight: Radius.circular(24),
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(10),
                decoration: BoxDecoration(color: Colors.white.withOpacity(0.2), borderRadius: BorderRadius.circular(12)),
                child: const Icon(Icons.psychology_rounded, color: Colors.white, size: 28),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('Rendimiento del Modelo', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white)),
                    const SizedBox(height: 4),
                    Row(
                      children: [
                        Container(
                          width: 8, height: 8,
                          decoration: BoxDecoration(
                            color: _isServiceOnline ? Colors.greenAccent : Colors.redAccent,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          _isServiceOnline ? 'Microservicio En Línea' : 'Microservicio Fuera de Línea',
                          style: const TextStyle(fontSize: 13, color: Colors.white70),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildOfflineWarning() {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Container(
        padding: const EdgeInsets.all(16),
        decoration: BoxDecoration(
          color: Colors.red.shade50,
          borderRadius: BorderRadius.circular(12),
          border: Border.all(color: Colors.red.shade200),
        ),
        child: const Row(
          children: [
            Icon(Icons.error_outline, color: Colors.red),
            SizedBox(width: 12),
            Expanded(
              child: Text(
                'El microservicio de inteligencia artificial no está disponible actualmente. Verifica que el contenedor esté corriendo o intenta refrescar en unos segundos.',
                style: TextStyle(color: Colors.red, fontSize: 14),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildMetricsGrid() {
    if (_metricas == null) {
      return const Padding(
        padding: EdgeInsets.all(20.0),
        child: Text('No hay métricas disponibles.', style: TextStyle(color: Colors.grey)),
      );
    }

    final acc = _metricas!['accuracy'] != null ? (_metricas!['accuracy'] * 100).toStringAsFixed(1) : '--';
    final precision = _metricas!['precision'] != null ? (_metricas!['precision'] * 100).toStringAsFixed(1) : '--';
    final recall = _metricas!['recall'] != null ? (_metricas!['recall'] * 100).toStringAsFixed(1) : '--';
    final f1 = _metricas!['f1_score'] != null ? (_metricas!['f1_score'] * 100).toStringAsFixed(1) : '--';

    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Padding(
            padding: EdgeInsets.only(left: 4, bottom: 12),
            child: Text('Métricas de Entrenamiento', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF1F2937))),
          ),
          GridView.count(
            crossAxisCount: 2,
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            mainAxisSpacing: 12,
            crossAxisSpacing: 12,
            childAspectRatio: 1.5,
            children: [
              _buildMetricCard('Exactitud (Accuracy)', '$acc%', Icons.track_changes, Colors.blue),
              _buildMetricCard('Precisión', '$precision%', Icons.gps_fixed, Colors.purple),
              _buildMetricCard('Sensibilidad (Recall)', '$recall%', Icons.call_made, Colors.orange),
              _buildMetricCard('F1-Score', '$f1%', Icons.insert_chart, Colors.teal),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildMetricCard(String title, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.04), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Row(
            children: [
              Icon(icon, size: 20, color: color),
              const SizedBox(width: 8),
              Expanded(child: Text(title, style: const TextStyle(fontSize: 12, color: Color(0xFF6B7280)), maxLines: 1, overflow: TextOverflow.ellipsis)),
            ],
          ),
          const SizedBox(height: 8),
          Text(value, style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: color)),
        ],
      ),
    );
  }

  Widget _buildActionButtons() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: InkWell(
        onTap: _reentrenar,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: LinearGradient(colors: [Colors.orange.shade400, Colors.orange.shade600]),
            borderRadius: BorderRadius.circular(16),
            boxShadow: [BoxShadow(color: Colors.orange.withOpacity(0.3), blurRadius: 8, offset: const Offset(0, 4))],
          ),
          child: const Row(
            children: [
              Icon(Icons.model_training_rounded, color: Colors.white, size: 32),
              SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Reentrenar Modelo', style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold)),
                    SizedBox(height: 4),
                    Text('Actualizar la IA con datos recientes de la base de datos.', style: TextStyle(color: Colors.white70, fontSize: 13)),
                  ],
                ),
              ),
              Icon(Icons.arrow_forward_ios_rounded, color: Colors.white70, size: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHistoryButton() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: InkWell(
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
                builder: (context) => const PredictionHistoryScreen()),
          );
        },
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.all(20),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF6366F1), Color(0xFF4F46E5)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(16),
            boxShadow: [
              BoxShadow(
                color: const Color(0xFF4F46E5).withOpacity(0.3),
                blurRadius: 8,
                offset: const Offset(0, 4),
              )
            ],
          ),
          child: const Row(
            children: [
              Icon(Icons.history_edu_rounded, color: Colors.white, size: 32),
              SizedBox(width: 16),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Historial de Predicciones',
                        style: TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.bold)),
                    SizedBox(height: 4),
                    Text('Ver todas las predicciones realizadas anteriormente.',
                        style: TextStyle(color: Colors.white70, fontSize: 13)),
                  ],
                ),
              ),
              Icon(Icons.arrow_forward_ios_rounded,
                  color: Colors.white70, size: 16),
            ],
          ),
        ),
      ),
    );
  }
}