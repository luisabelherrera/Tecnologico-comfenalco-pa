import 'package:flutter/material.dart';
import '../models/prediction_history_entry.dart';
import '../services/prediction_history_service.dart';

class PredictionHistoryScreen extends StatefulWidget {
  const PredictionHistoryScreen({super.key});

  @override
  State<PredictionHistoryScreen> createState() =>
      _PredictionHistoryScreenState();
}

class _PredictionHistoryScreenState extends State<PredictionHistoryScreen>
    with SingleTickerProviderStateMixin {
  final PredictionHistoryService _historyService = PredictionHistoryService();
  late TabController _tabController;
  List<PredictionHistoryEntry> _allHistory = [];
  bool _isLoading = true;
  String _filterRisk = 'Todos'; // Todos | Alto | Bajo

  // ─── Colores del tema ────────────────────────────────────────────────────
  static const Color _primary = Color(0xFF4F46E5);
  static const Color _danger = Color(0xFFEF4444);
  static const Color _success = Color(0xFF22C55E);
  static const Color _surface = Color(0xFFF5F7FA);
  static const Color _textSecondary = Color(0xFF6B7280);

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 3, vsync: this);
    _tabController.addListener(() => setState(() {}));
    _loadHistory();
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _loadHistory() async {
    setState(() => _isLoading = true);
    final history = await _historyService.getHistory();
    if (mounted) {
      setState(() {
        _allHistory = history;
        _isLoading = false;
      });
    }
  }

  List<PredictionHistoryEntry> get _filteredHistory {
    switch (_tabController.index) {
      case 1:
        return _allHistory.where((e) => e.esRiesgoAlto).toList();
      case 2:
        return _allHistory.where((e) => !e.esRiesgoAlto).toList();
      default:
        return _allHistory;
    }
  }

  Future<void> _deleteEntry(PredictionHistoryEntry entry) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Eliminar registro'),
        content:
            const Text('¿Deseas eliminar esta predicción del historial?'),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(ctx, false),
              child: const Text('Cancelar')),
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: ElevatedButton.styleFrom(
                backgroundColor: _danger, foregroundColor: Colors.white),
            child: const Text('Eliminar'),
          ),
        ],
      ),
    );
    if (confirm == true) {
      await _historyService.deleteEntry(entry.id);
      _loadHistory();
    }
  }

  Future<void> _clearAll() async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Limpiar historial'),
        content: const Text(
            '¿Estás seguro? Esta acción eliminará todas las predicciones guardadas.'),
        actions: [
          TextButton(
              onPressed: () => Navigator.pop(ctx, false),
              child: const Text('Cancelar')),
          ElevatedButton(
            onPressed: () => Navigator.pop(ctx, true),
            style: ElevatedButton.styleFrom(
                backgroundColor: _danger, foregroundColor: Colors.white),
            child: const Text('Limpiar todo'),
          ),
        ],
      ),
    );
    if (confirm == true) {
      await _historyService.clearAll();
      _loadHistory();
    }
  }

  String _formatDate(DateTime date) {
    final now = DateTime.now();
    final diff = now.difference(date);
    if (diff.inMinutes < 1) return 'Hace un momento';
    if (diff.inMinutes < 60) return 'Hace ${diff.inMinutes} min';
    if (diff.inHours < 24) return 'Hace ${diff.inHours}h';
    if (diff.inDays == 1) return 'Ayer';
    if (diff.inDays < 7) return 'Hace ${diff.inDays} días';
    return '${date.day}/${date.month}/${date.year}';
  }

  @override
  Widget build(BuildContext context) {
    final total = _allHistory.length;
    final riesgoAlto = _allHistory.where((e) => e.esRiesgoAlto).length;
    final riesgoBajo = total - riesgoAlto;

    return Scaffold(
      backgroundColor: _surface,
      appBar: AppBar(
        elevation: 0,
        backgroundColor: _primary,
        foregroundColor: Colors.white,
        title: const Text('Historial de Predicciones',
            style: TextStyle(fontWeight: FontWeight.w600)),
        centerTitle: true,
        actions: [
          if (_allHistory.isNotEmpty)
            IconButton(
              onPressed: _clearAll,
              icon: const Icon(Icons.delete_sweep_rounded),
              tooltip: 'Limpiar historial',
            ),
          IconButton(
            onPressed: _loadHistory,
            icon: const Icon(Icons.refresh_rounded),
            tooltip: 'Actualizar',
          ),
        ],
        bottom: TabBar(
          controller: _tabController,
          indicatorColor: Colors.white,
          labelColor: Colors.white,
          unselectedLabelColor: Colors.white60,
          labelStyle: const TextStyle(fontWeight: FontWeight.w600),
          tabs: [
            Tab(text: 'Todos ($total)'),
            Tab(text: 'Riesgo (${riesgoAlto})'),
            Tab(text: 'Bien (${riesgoBajo})'),
          ],
        ),
      ),
      body: Column(
        children: [
          // Tarjetas de resumen
          if (!_isLoading && _allHistory.isNotEmpty) _buildSummaryBanner(total, riesgoAlto, riesgoBajo),

          // Lista principal
          Expanded(
            child: _isLoading
                ? const Center(
                    child: CircularProgressIndicator(
                        valueColor:
                            AlwaysStoppedAnimation<Color>(_primary)))
                : _filteredHistory.isEmpty
                    ? _buildEmptyState()
                    : ListView.builder(
                        padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
                        itemCount: _filteredHistory.length,
                        itemBuilder: (context, index) {
                          return _buildHistoryCard(_filteredHistory[index]);
                        },
                      ),
          ),
        ],
      ),
    );
  }

  Widget _buildSummaryBanner(int total, int alto, int bajo) {
    return Container(
      margin: const EdgeInsets.all(16),
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(16),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withOpacity(0.05),
              blurRadius: 10,
              offset: const Offset(0, 4))
        ],
      ),
      child: Row(
        children: [
          _buildStatBadge('Total', '$total', _primary, Icons.history_rounded),
          const SizedBox(width: 8),
          _buildStatBadge(
              'Riesgo', '$alto', _danger, Icons.warning_amber_rounded),
          const SizedBox(width: 8),
          _buildStatBadge('Sin riesgo', '$bajo', _success,
              Icons.check_circle_outline_rounded),
        ].map((w) => Expanded(child: w)).toList(),
      ),
    );
  }

  Widget _buildStatBadge(
      String label, String value, Color color, IconData icon) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
      decoration: BoxDecoration(
        color: color.withOpacity(0.08),
        borderRadius: BorderRadius.circular(12),
      ),
      child: Column(
        children: [
          Icon(icon, color: color, size: 20),
          const SizedBox(height: 4),
          Text(value,
              style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: color)),
          Text(label,
              style: const TextStyle(fontSize: 10, color: _textSecondary),
              textAlign: TextAlign.center),
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Container(
            padding: const EdgeInsets.all(24),
            decoration: BoxDecoration(
              color: _primary.withOpacity(0.08),
              shape: BoxShape.circle,
            ),
            child: const Icon(Icons.history_edu_rounded,
                size: 56, color: _primary),
          ),
          const SizedBox(height: 20),
          const Text('Sin predicciones',
              style: TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: Color(0xFF1F2937))),
          const SizedBox(height: 8),
          const Text(
            'Las predicciones que realices\naparecerán aquí automáticamente.',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 14, color: _textSecondary),
          ),
        ],
      ),
    );
  }

  Widget _buildHistoryCard(PredictionHistoryEntry entry) {
    final isRiesgo = entry.esRiesgoAlto;
    final color = isRiesgo ? _danger : _success;
    final icon =
        isRiesgo ? Icons.warning_amber_rounded : Icons.check_circle_rounded;
    final label = isRiesgo ? 'Riesgo Alto' : 'Sin Riesgo';

    return Dismissible(
      key: Key(entry.id),
      direction: DismissDirection.endToStart,
      background: Container(
        alignment: Alignment.centerRight,
        padding: const EdgeInsets.only(right: 20),
        margin: const EdgeInsets.only(bottom: 12),
        decoration: BoxDecoration(
          color: _danger,
          borderRadius: BorderRadius.circular(16),
        ),
        child: const Icon(Icons.delete_rounded, color: Colors.white, size: 28),
      ),
      confirmDismiss: (_) async {
        await _deleteEntry(entry);
        return false; // Manejamos la eliminación manualmente
      },
      child: GestureDetector(
        onTap: () => _showDetailSheet(entry),
        child: Container(
          margin: const EdgeInsets.only(bottom: 12),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: color.withOpacity(0.2)),
            boxShadow: [
              BoxShadow(
                  color: Colors.black.withOpacity(0.04),
                  blurRadius: 8,
                  offset: const Offset(0, 3))
            ],
          ),
          child: Row(
            children: [
              // Barra lateral
              Container(
                width: 4,
                height: 100,
                decoration: BoxDecoration(
                  color: color,
                  borderRadius: const BorderRadius.only(
                    topLeft: Radius.circular(16),
                    bottomLeft: Radius.circular(16),
                  ),
                ),
              ),
              const SizedBox(width: 14),
              // Icono resultado
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: color.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: color, size: 24),
              ),
              const SizedBox(width: 12),
              // Información principal
              Expanded(
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Row(
                        children: [
                          Expanded(
                            child: Text(
                              entry.nombreEstudiante.isNotEmpty
                                  ? entry.nombreEstudiante
                                  : entry.documento != null
                                      ? 'Doc: ${entry.documento}'
                                      : 'Estudiante sin nombre',
                              style: const TextStyle(
                                  fontWeight: FontWeight.bold,
                                  fontSize: 15,
                                  color: Color(0xFF1F2937)),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                          Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: color.withOpacity(0.1),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(label,
                                style: TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.bold,
                                    color: color)),
                          ),
                        ],
                      ),
                      const SizedBox(height: 6),
                      Row(
                        children: [
                          Icon(Icons.percent_rounded,
                              size: 13, color: _textSecondary),
                          const SizedBox(width: 4),
                          Text('Asistencia: ${entry.asistencia.toStringAsFixed(0)}%',
                              style: const TextStyle(
                                  fontSize: 12, color: _textSecondary)),
                          const SizedBox(width: 12),
                          Icon(Icons.bar_chart_rounded,
                              size: 13, color: _textSecondary),
                          const SizedBox(width: 4),
                          Text(
                              'Promedio: ${entry.promedioParciales.toStringAsFixed(1)}',
                              style: const TextStyle(
                                  fontSize: 12, color: _textSecondary)),
                        ],
                      ),
                      const SizedBox(height: 4),
                      Row(
                        children: [
                          Icon(Icons.access_time_rounded,
                              size: 13, color: _textSecondary),
                          const SizedBox(width: 4),
                          Text(
                            _formatDate(entry.fecha),
                            style: const TextStyle(
                                fontSize: 12, color: _textSecondary),
                          ),
                          const Spacer(),
                          Text('Confianza: ${entry.confianza}',
                              style: TextStyle(
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600,
                                  color: color)),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const Padding(
                padding: EdgeInsets.only(right: 12),
                child: Icon(Icons.chevron_right_rounded,
                    color: Color(0xFFD1D5DB)),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showDetailSheet(PredictionHistoryEntry entry) {
    final isRiesgo = entry.esRiesgoAlto;
    final color = isRiesgo ? _danger : _success;
    final icon =
        isRiesgo ? Icons.warning_amber_rounded : Icons.verified_rounded;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => DraggableScrollableSheet(
        initialChildSize: 0.75,
        maxChildSize: 0.95,
        minChildSize: 0.4,
        builder: (_, scrollCtrl) => Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
          ),
          child: ListView(
            controller: scrollCtrl,
            padding: const EdgeInsets.all(24),
            children: [
              // Handle
              Center(
                child: Container(
                  width: 40,
                  height: 4,
                  margin: const EdgeInsets.only(bottom: 20),
                  decoration: BoxDecoration(
                      color: Colors.grey.shade300,
                      borderRadius: BorderRadius.circular(2)),
                ),
              ),
              // Resultado principal
              Container(
                padding: const EdgeInsets.all(20),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [color.withOpacity(0.8), color],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  children: [
                    Icon(icon, color: Colors.white, size: 40),
                    const SizedBox(width: 16),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            isRiesgo
                                ? 'Riesgo Alto de Pérdida'
                                : 'Sin Riesgo de Pérdida',
                            style: const TextStyle(
                                color: Colors.white,
                                fontSize: 18,
                                fontWeight: FontWeight.bold),
                          ),
                          const SizedBox(height: 4),
                          Text('Confianza: ${entry.confianza}',
                              style: const TextStyle(
                                  color: Colors.white70, fontSize: 13)),
                          Text('Modelo: ${entry.modelo}',
                              style: const TextStyle(
                                  color: Colors.white54, fontSize: 12)),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 20),
              // Fecha
              _detailRow(Icons.calendar_today_rounded, 'Fecha',
                  '${entry.fecha.day}/${entry.fecha.month}/${entry.fecha.year} ${entry.fecha.hour.toString().padLeft(2, '0')}:${entry.fecha.minute.toString().padLeft(2, '0')}'),
              if (entry.nombreEstudiante.isNotEmpty)
                _detailRow(
                    Icons.person_rounded, 'Estudiante', entry.nombreEstudiante),
              if (entry.documento != null)
                _detailRow(Icons.badge_rounded, 'Documento',
                    '${entry.documento}'),
              const Divider(height: 28),
              const Text('Datos Académicos',
                  style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                      color: Color(0xFF1F2937))),
              const SizedBox(height: 12),
              _detailRow(Icons.percent_rounded, 'Asistencia',
                  '${entry.asistencia.toStringAsFixed(1)}%'),
              _detailRow(Icons.bar_chart_rounded, 'Promedio Parciales',
                  entry.promedioParciales.toStringAsFixed(2)),
              _detailRow(Icons.schedule_rounded, 'Horas Estudio/Sem',
                  '${entry.horasEstudioSemanal} h'),
              _detailRow(Icons.school_rounded, 'Carga Académica',
                  '${entry.cargaAcademica} materias'),
              _detailRow(Icons.record_voice_over_rounded, 'Participación',
                  entry.participacionClases),
              _detailRow(Icons.computer_rounded, 'Uso Plataforma',
                  entry.usoPlataformaVirtual),
              const Divider(height: 28),
              const Text('Contexto Personal',
                  style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 15,
                      color: Color(0xFF1F2937))),
              const SizedBox(height: 12),
              _detailRow(
                  Icons.wc_rounded, 'Género', entry.genero),
              _detailRow(Icons.cake_rounded, 'Edad', '${entry.edad} años'),
              _detailRow(Icons.history_edu_rounded, 'Antecedentes',
                  entry.antecedentesPerdida),
              _detailRow(Icons.family_restroom_rounded, 'Apoyo Familiar',
                  entry.apoyoFamiliar),
              _detailRow(Icons.sentiment_dissatisfied_rounded,
                  'Problemas Personales', entry.problemasPersonales),

              // Factores de riesgo
              if (entry.factoresRiesgo.isNotEmpty) ...[
                const Divider(height: 28),
                const Text('Factores de Riesgo Principales',
                    style: TextStyle(
                        fontWeight: FontWeight.bold,
                        fontSize: 15,
                        color: Color(0xFF1F2937))),
                const SizedBox(height: 12),
                ...entry.factoresRiesgo.map((f) => Container(
                      margin: const EdgeInsets.only(bottom: 8),
                      padding: const EdgeInsets.symmetric(
                          horizontal: 14, vertical: 10),
                      decoration: BoxDecoration(
                        color: _danger.withOpacity(0.06),
                        borderRadius: BorderRadius.circular(10),
                        border: Border.all(
                            color: _danger.withOpacity(0.15)),
                      ),
                      child: Row(
                        children: [
                          const Icon(Icons.arrow_right_rounded,
                              color: _danger, size: 20),
                          const SizedBox(width: 8),
                          Expanded(
                            child: Text(
                              '${f["variable"] ?? ""} — Imp: ${f["importancia"] ?? ""}',
                              style: const TextStyle(
                                  fontSize: 13,
                                  color: Color(0xFF374151)),
                            ),
                          ),
                        ],
                      ),
                    )),
              ],
              const SizedBox(height: 12),
              // Botón eliminar
              OutlinedButton.icon(
                onPressed: () async {
                  Navigator.pop(ctx);
                  await _deleteEntry(entry);
                },
                icon: const Icon(Icons.delete_outline_rounded,
                    color: _danger, size: 18),
                label: const Text('Eliminar del historial',
                    style: TextStyle(color: _danger)),
                style: OutlinedButton.styleFrom(
                  side: const BorderSide(color: _danger),
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(10)),
                ),
              ),
              const SizedBox(height: 20),
            ],
          ),
        ),
      ),
    );
  }

  Widget _detailRow(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        children: [
          Icon(icon, size: 16, color: _primary),
          const SizedBox(width: 10),
          Text('$label: ',
              style: const TextStyle(
                  fontSize: 13,
                  color: _textSecondary,
                  fontWeight: FontWeight.w500)),
          Expanded(
            child: Text(value,
                style: const TextStyle(
                    fontSize: 13,
                    color: Color(0xFF1F2937),
                    fontWeight: FontWeight.w600),
                overflow: TextOverflow.ellipsis),
          ),
        ],
      ),
    );
  }
}
