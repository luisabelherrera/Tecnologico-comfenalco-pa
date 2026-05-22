import 'package:flutter/material.dart';

class TrendHelper {
  /// Retorna el ícono basado en la tendencia
  static IconData getIconForTrend(String trend) {
    switch (trend) {
      case 'mejora':
        return Icons.trending_up;
      case 'empeora':
        return Icons.trending_down;
      case 'estable':
        return Icons.trending_flat;
      default:
        return Icons.help_outline;
    }
  }

  /// Retorna el color basado en la tendencia
  static Color getColorForTrend(String trend) {
    switch (trend) {
      case 'mejora':
        return const Color(0xFF22C55E); // Verde
      case 'empeora':
        return const Color(0xFFEF4444); // Rojo
      case 'estable':
        return const Color(0xFFF59E0B); // Ámbar
      default:
        return const Color(0xFF6B7280); // Gris
    }
  }

  /// Retorna el texto descriptivo de la tendencia
  static String getTextForTrend(String trend) {
    switch (trend) {
      case 'mejora':
        return 'Mejora';
      case 'empeora':
        return 'Empeora';
      case 'estable':
        return 'Estable';
      default:
        return 'Sin datos';
    }
  }

  /// Widget para mostrar la tendencia
  static Widget buildTrendIndicator(String trend, {double size = 24}) {
    final icon = getIconForTrend(trend);
    final color = getColorForTrend(trend);

    return Tooltip(
      message: getTextForTrend(trend),
      child: Icon(
        icon,
        color: color,
        size: size,
      ),
    );
  }

  /// Widget para mostrar la tendencia con badge
  static Widget buildTrendBadge(String trend, {bool showText = true}) {
    final color = getColorForTrend(trend);
    final text = getTextForTrend(trend);
    final icon = getIconForTrend(trend);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.1),
        border: Border.all(color: color),
        borderRadius: BorderRadius.circular(8),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: color, size: 16),
          if (showText) ...[
            const SizedBox(width: 8),
            Text(
              text,
              style: TextStyle(
                color: color,
                fontWeight: FontWeight.w600,
                fontSize: 12,
              ),
            ),
          ],
        ],
      ),
    );
  }

  /// Calcula el cambio porcentual con formato
  static String formatPorcentajoCambio(double cambio) {
    if (cambio.isNaN || cambio.isInfinite) return '0%';

    final signo = cambio >= 0 ? '+' : '';
    return '$signo${cambio.toStringAsFixed(1)}%';
  }

  /// Widget para mostrar el cambio porcentual
  static Widget buildChangeWidget(double cambio) {
    final isPositive = cambio >= 0;
    final color = isPositive
        ? const Color(0xFF22C55E)
        : const Color(0xFFEF4444);
    final icon = isPositive ? Icons.arrow_upward : Icons.arrow_downward;

    return Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Icon(icon, color: color, size: 14),
        const SizedBox(width: 4),
        Text(
          formatPorcentajoCambio(cambio),
          style: TextStyle(
            color: color,
            fontWeight: FontWeight.w600,
            fontSize: 12,
          ),
        ),
      ],
    );
  }
}
