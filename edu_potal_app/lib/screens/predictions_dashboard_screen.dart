import 'package:flutter/material.dart';
import '../services/api_service.dart';

enum RiskType { high, medium, low }

class PredictionsDashboardScreen extends StatefulWidget {
  const PredictionsDashboardScreen({super.key});

  @override
  State<PredictionsDashboardScreen> createState() => _PredictionsDashboardScreenState();
}

class _PredictionsDashboardScreenState extends State<PredictionsDashboardScreen> {
  final ApiService _apiService = ApiService();
  late Future<List<dynamic>> _historialFuture;

  @override
  void initState() {
    super.initState();
    _historialFuture = _apiService.getHistorialPredicciones();
  }

  RiskType _getRiskType(String? prediccion) {
    final p = (prediccion ?? '').toLowerCase();
    if (p.contains('alto') || p.contains('high') || p.contains('si')) return RiskType.high;
    if (p.contains('medio') || p.contains('medium')) return RiskType.medium;
    return RiskType.low;
  }

  Color _getRiskColor(RiskType type) {
    switch (type) {
      case RiskType.high: return const Color(0xFFEF4444);
      case RiskType.medium: return const Color(0xFFF59E0B);
      case RiskType.low: return const Color(0xFF22C55E);
    }
  }

  IconData _getRiskIcon(RiskType type) {
    switch (type) {
      case RiskType.high: return Icons.warning_rounded;
      case RiskType.medium: return Icons.error_outline_rounded;
      case RiskType.low: return Icons.check_circle_outline_rounded;
    }
  }

  String _getRiskLabel(RiskType type) {
    switch (type) {
      case RiskType.high: return 'Riesgo Alto';
      case RiskType.medium: return 'Riesgo Medio';
      case RiskType.low: return 'Riesgo Bajo';
    }
  }

  String _getInitials(String? doc) {
    if (doc == null || doc.isEmpty) return '??';
    return doc.length >= 2 ? doc.substring(0, 2).toUpperCase() : doc.toUpperCase();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        elevation: 0,
        title: const Text('Predicciones IA', style: TextStyle(fontWeight: FontWeight.w600)),
        backgroundColor: const Color(0xFF4F46E5),
        foregroundColor: Colors.white,
        centerTitle: true,
        actions: [
          IconButton(
            onPressed: () => setState(() { _historialFuture = _apiService.getHistorialPredicciones(); }),
            icon: const Icon(Icons.refresh_rounded),
            tooltip: 'Actualizar',
          ),
        ],
      ),
      body: FutureBuilder<List<dynamic>>(
        future: _historialFuture,
        builder: (context, snapshot) {
          final historial = snapshot.data ?? [];
          final highCount = historial.where((e) => _getRiskType(e['perderaAsignatura']) == RiskType.high).length;
          final mediumCount = historial.where((e) => _getRiskType(e['perderaAsignatura']) == RiskType.medium).length;
          final lowCount = historial.where((e) => _getRiskType(e['perderaAsignatura']) == RiskType.low).length;

          return Column(
            children: [
              // Header
              Container(
                width: double.infinity,
                padding: const EdgeInsets.fromLTRB(20, 20, 20, 24),
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
                        const Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text('Análisis de Riesgo', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white)),
                              SizedBox(height: 2),
                              Text('Powered by Weka ML', style: TextStyle(fontSize: 13, color: Colors.white70)),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    Row(
                      children: [
                        _buildRiskSummaryItem(count: snapshot.connectionState == ConnectionState.waiting ? '-' : '$highCount', label: 'Alto', color: const Color(0xFFEF4444)),
                        const SizedBox(width: 12),
                        _buildRiskSummaryItem(count: snapshot.connectionState == ConnectionState.waiting ? '-' : '$mediumCount', label: 'Medio', color: const Color(0xFFF59E0B)),
                        const SizedBox(width: 12),
                        _buildRiskSummaryItem(count: snapshot.connectionState == ConnectionState.waiting ? '-' : '$lowCount', label: 'Bajo', color: const Color(0xFF22C55E)),
                      ],
                    ),
                  ],
                ),
              ),
              Padding(
                padding: const EdgeInsets.fromLTRB(20, 20, 20, 8),
                child: Row(
                  children: [
                    const Icon(Icons.analytics_outlined, size: 18, color: Color(0xFF6B7280)),
                    const SizedBox(width: 8),
                    Text(
                      snapshot.connectionState == ConnectionState.waiting
                          ? 'Cargando...'
                          : '${historial.length} Estudiante(s) Analizado(s)',
                      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w600, color: Color(0xFF6B7280)),
                    ),
                  ],
                ),
              ),
              Expanded(
                child: snapshot.connectionState == ConnectionState.waiting
                    ? const Center(child: CircularProgressIndicator(valueColor: AlwaysStoppedAnimation<Color>(Color(0xFF4F46E5))))
                    : historial.isEmpty
                        ? _buildEmptyState()
                        : ListView.builder(
                            padding: const EdgeInsets.fromLTRB(16, 8, 16, 16),
                            itemCount: historial.length,
                            itemBuilder: (context, index) {
                              final item = historial[index];
                              final riskType = _getRiskType(item['perderaAsignatura']);
                              final documento = item['documento']?.toString() ?? '—';
                              final confianza = item['confianza'] ?? '—';

                              // Build metrics from real data
                              final List<String> metrics = [];
                              if (item['asistencia'] != null) metrics.add('Asistencia: ${item['asistencia']}%');
                              if (item['promedioParciales'] != null) metrics.add('Promedio: ${item['promedioParciales']}');
                              if (item['horasEstudioSemanal'] != null) metrics.add('Estudio: ${item['horasEstudioSemanal']}h/sem');

                              final reason = _buildReason(item);

                              return _buildPredictionCard(
                                name: 'Doc: $documento',
                                initials: _getInitials(documento),
                                riskLevel: _getRiskLabel(riskType),
                                riskType: riskType,
                                reason: reason,
                                metrics: metrics,
                                confianza: confianza,
                              );
                            },
                          ),
              ),
            ],
          );
        },
      ),
    );
  }

  String _buildReason(Map<String, dynamic> item) {
    final partes = <String>[];
    final antecedentes = item['antecedentesPerdida'];
    if (antecedentes == 'si' || antecedentes == 'Si') partes.add('tiene antecedentes de pérdida');
    final participacion = item['participacionClases'];
    if (participacion == 'bajo' || participacion == 'Bajo') partes.add('baja participación en clases');
    final apoyo = item['apoyoFamiliar'];
    if (apoyo == 'no') partes.add('sin apoyo familiar');
    final problemas = item['problemasPersonales'];
    if (problemas == 'si' || problemas == 'Si') partes.add('problemas personales');

    if (partes.isEmpty) return 'Análisis basado en historial académico y asistencia.';
    return 'Factores identificados: ${partes.join(', ')}.';
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(color: const Color(0xFF4F46E5).withOpacity(0.1), borderRadius: BorderRadius.circular(16)),
            child: const Icon(Icons.psychology_outlined, size: 48, color: Color(0xFF4F46E5)),
          ),
          const SizedBox(height: 16),
          const Text('Sin predicciones', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Color(0xFF1F2937))),
          const SizedBox(height: 8),
          const Text('Aún no se han generado predicciones en el sistema.',
              style: TextStyle(fontSize: 14, color: Color(0xFF6B7280)), textAlign: TextAlign.center),
        ],
      ),
    );
  }

  Widget _buildRiskSummaryItem({required String count, required String label, required Color color}) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12),
        decoration: BoxDecoration(color: Colors.white.withOpacity(0.15), borderRadius: BorderRadius.circular(12)),
        child: Column(
          children: [
            Container(width: 10, height: 10, decoration: BoxDecoration(color: color, borderRadius: BorderRadius.circular(5))),
            const SizedBox(height: 8),
            Text(count, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white)),
            const SizedBox(height: 2),
            Text(label, style: const TextStyle(fontSize: 12, color: Colors.white70)),
          ],
        ),
      ),
    );
  }

  Widget _buildPredictionCard({
    required String name,
    required String initials,
    required String riskLevel,
    required RiskType riskType,
    required String reason,
    required List<String> metrics,
    String confianza = '',
  }) {
    final riskColor = _getRiskColor(riskType);
    final riskIcon = _getRiskIcon(riskType);

    return Container(
      margin: const EdgeInsets.only(bottom: 12.0),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        border: Border.all(color: riskColor.withOpacity(0.3)),
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10, offset: const Offset(0, 4))],
      ),
      child: Padding(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 48, height: 48,
                  decoration: BoxDecoration(color: riskColor.withOpacity(0.1), borderRadius: BorderRadius.circular(12)),
                  child: Center(child: Text(initials, style: TextStyle(color: riskColor, fontWeight: FontWeight.bold, fontSize: 16))),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(name, style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: Color(0xFF1F2937))),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(color: riskColor.withOpacity(0.1), borderRadius: BorderRadius.circular(20)),
                            child: Row(
                              mainAxisSize: MainAxisSize.min,
                              children: [
                                Icon(riskIcon, color: riskColor, size: 14),
                                const SizedBox(width: 4),
                                Text(riskLevel, style: TextStyle(color: riskColor, fontWeight: FontWeight.w600, fontSize: 12)),
                              ],
                            ),
                          ),
                          if (confianza.isNotEmpty) ...[
                            const SizedBox(width: 8),
                            Text('$confianza confianza', style: const TextStyle(fontSize: 12, color: Color(0xFF9CA3AF))),
                          ],
                        ],
                      ),
                    ],
                  ),
                ),
              ],
            ),
            const SizedBox(height: 14),
            Container(height: 1, color: const Color(0xFFE5E7EB)),
            const SizedBox(height: 14),
            Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Icon(Icons.insights_rounded, color: Color(0xFF6B7280), size: 18),
                const SizedBox(width: 10),
                Expanded(child: Text(reason, style: const TextStyle(color: Color(0xFF4B5563), fontSize: 14, height: 1.4))),
              ],
            ),
            if (metrics.isNotEmpty) ...[
              const SizedBox(height: 14),
              Wrap(
                spacing: 8,
                runSpacing: 6,
                children: metrics.map((metric) => Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(color: const Color(0xFFF3F4F6), borderRadius: BorderRadius.circular(8)),
                  child: Text(metric, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w500, color: Color(0xFF6B7280))),
                )).toList(),
              ),
            ],
          ],
        ),
      ),
    );
  }
}