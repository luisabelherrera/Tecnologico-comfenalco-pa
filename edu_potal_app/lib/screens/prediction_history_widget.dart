import 'package:flutter/material.dart';
import '../models/prediction_history_entry.dart';
import '../utils/trend_helper.dart';

class PredictionHistoryWidget extends StatelessWidget {
  final List<PredictionHistoryEntry> historial;
  final String tendencia;
  final int maxItems;

  const PredictionHistoryWidget({
    Key? key,
    required this.historial,
    required this.tendencia,
    this.maxItems = 3,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    if (historial.isEmpty) {
      return _buildEmptyState();
    }

    final itemsToShow = historial.take(maxItems).toList();

    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFE5E7EB)),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 8,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Header
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Row(
                children: [
                  Icon(Icons.history, color: Color(0xFF4F46E5), size: 20),
                  SizedBox(width: 8),
                  Text(
                    'Historial de Predicciones',
                    style: TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF1F2937),
                    ),
                  ),
                ],
              ),
              TrendHelper.buildTrendBadge(tendencia, showText: true),
            ],
          ),
          const SizedBox(height: 12),
          
          // Items
          ...itemsToShow.asMap().entries.map((entry) {
            final index = entry.key;
            final item = entry.value;
            final isFirst = index == 0;

            return Column(
              children: [
                _buildHistoryItem(item, isFirst),
                if (index < itemsToShow.length - 1)
                  Padding(
                    padding: const EdgeInsets.symmetric(vertical: 8.0),
                    child: Container(
                      height: 1,
                      color: const Color(0xFFF0F0F0),
                    ),
                  ),
              ],
            );
          }).toList(),
          
          // Footer
          if (historial.length > maxItems) ...[
            const SizedBox(height: 12),
            Container(
              padding: const EdgeInsets.symmetric(vertical: 8),
              alignment: Alignment.center,
              child: Text(
                'y ${historial.length - maxItems} más',
                style: const TextStyle(
                  fontSize: 12,
                  color: Color(0xFF6B7280),
                  fontStyle: FontStyle.italic,
                ),
              ),
            ),
          ],
        ],
      ),
    );
  }

  Widget _buildEmptyState() {
    return Container(
      margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: const Color(0xFFF0F9FF),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: const Color(0xFFBFDBFE)),
      ),
      child: const Center(
        child: Column(
          children: [
            Icon(Icons.info_outline, color: Color(0xFF3B82F6), size: 24),
            SizedBox(height: 8),
            Text(
              'Sin historial de predicciones',
              style: TextStyle(
                fontSize: 13,
                color: Color(0xFF1E40AF),
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildHistoryItem(PredictionHistoryEntry item, bool isLatest) {
    final riskColor = item.esRiesgoAlto
        ? const Color(0xFFEF4444)
        : const Color(0xFF22C55E);

    final riskText =
        item.esRiesgoAlto ? 'Alto Riesgo' : 'Bajo Riesgo';

    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Fecha y label
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  if (isLatest)
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                      decoration: BoxDecoration(
                        color: const Color(0xFF4F46E5),
                        borderRadius: BorderRadius.circular(4),
                      ),
                      child: const Text(
                        'Más reciente',
                        style: TextStyle(
                          fontSize: 10,
                          color: Colors.white,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    )
                  else
                    Text(
                      _formatFecha(item.fecha),
                      style: const TextStyle(
                        fontSize: 11,
                        color: Color(0xFF6B7280),
                      ),
                    ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: riskColor.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(6),
                  border: Border.all(color: riskColor),
                ),
                child: Text(
                  riskText,
                  style: TextStyle(
                    fontSize: 11,
                    color: riskColor,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 8),

          // Confianza y promedio
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Confianza',
                    style: TextStyle(fontSize: 11, color: Color(0xFF6B7280)),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    item.confianza,
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF1F2937),
                    ),
                  ),
                ],
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  const Text(
                    'Promedio',
                    style: TextStyle(fontSize: 11, color: Color(0xFF6B7280)),
                  ),
                  const SizedBox(height: 2),
                  Text(
                    '${item.promedioParciales.toStringAsFixed(1)}',
                    style: const TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: Color(0xFF1F2937),
                    ),
                  ),
                ],
              ),
            ],
          ),

          // Asistencia
          const SizedBox(height: 6),
          Row(
            children: [
              const Icon(Icons.check_circle_outline,
                  size: 14, color: Color(0xFF6B7280)),
              const SizedBox(width: 4),
              Text(
                'Asistencia: ${(item.asistencia * 100).toStringAsFixed(0)}%',
                style:
                    const TextStyle(fontSize: 11, color: Color(0xFF6B7280)),
              ),
            ],
          ),
        ],
      ),
    );
  }

  String _formatFecha(DateTime fecha) {
    final ahora = DateTime.now();
    final diferencia = ahora.difference(fecha);

    if (diferencia.inDays == 0) {
      if (diferencia.inHours == 0) {
        return 'Hace ${diferencia.inMinutes} min';
      }
      return 'Hace ${diferencia.inHours}h';
    } else if (diferencia.inDays == 1) {
      return 'Ayer';
    } else if (diferencia.inDays < 7) {
      return 'Hace ${diferencia.inDays} días';
    }

    return '${fecha.day}/${fecha.month}/${fecha.year}';
  }
}
