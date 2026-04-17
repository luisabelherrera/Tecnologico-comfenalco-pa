import 'package:flutter/material.dart';
import 'package:fl_chart/fl_chart.dart';
import '../services/api_service.dart';
import '../services/gemini_service.dart';

class ReportsScreen extends StatefulWidget {
  const ReportsScreen({super.key});

  @override
  State<ReportsScreen> createState() => _ReportsScreenState();
}

class _ReportsScreenState extends State<ReportsScreen> {
  final ApiService _apiService = ApiService();
  final GeminiService _geminiService = GeminiService();

  bool _isLoading = true;
  String? _error;

  List<dynamic> _inscripciones = [];
  List<dynamic> _calificaciones = [];
  List<dynamic> _niveles = [];

  // Stats
  int _totalEstudiantes = 0;
  int _totalInscripciones = 0;
  double _promedioGeneral = 0.0;
  int _totalNiveles = 0;

  // Chart Data
  List<BarChartGroupData> _gradesBarChunks = [];
  List<PieChartSectionData> _paymentPieSections = [];
  List<PieChartSectionData> _genderPieSections = [];
  List<FlSpot> _trendSpots = [];
  List<String> _trendLabels = [];

  String _aiInsight = 'Generando análisis con IA...';
  bool _aiLoading = false;

  @override
  void initState() {
    super.initState();
    _loadAllData();
  }

  Future<void> _loadAllData() async {
    setState(() {
      _isLoading = true;
      _error = null;
    });

    try {
      final results = await Future.wait([
        _apiService.getAllInscripciones(),
        _apiService.getAllCalificaciones(),
        _apiService.getAllNiveles(),
      ]);

      _inscripciones = results[0];
      _calificaciones = results[1];
      _niveles = results[2];

      _calculateSummaryStats();
      _processChartData();

      setState(() => _isLoading = false);

      _generateInitialAIInsight();
    } catch (e) {
      setState(() {
        _isLoading = false;
        _error = 'Error al cargar datos de reportes: $e';
      });
    }
  }

  void _calculateSummaryStats() {
    final uniqueEstudiantes =
        _inscripciones.map((ins) => ins['estudiante']?['idEstudiante']).toSet();
    _totalEstudiantes = uniqueEstudiantes.length;
    _totalInscripciones = _inscripciones.length;
    _totalNiveles = _niveles.length;

    if (_calificaciones.isNotEmpty) {
      final sum = _calificaciones.fold<double>(
          0, (prev, element) => prev + (element['nota'] ?? 0.0));
      _promedioGeneral = sum / _calificaciones.length;
    }
  }

  void _processChartData() {
    _processPaymentStats();
    _processGenderStats();
    _processGradesStats();
    _processTrendStats();
  }

  void _processPaymentStats() {
    final statusCounts = <String, int>{};
    for (var ins in _inscripciones) {
      final status = ins['estadoPago'] ?? 'DESCONOCIDO';
      statusCounts[status] = (statusCounts[status] ?? 0) + 1;
    }

    final colors = {
      'PAGADO': Colors.greenAccent,
      'PENDIENTE': Colors.orangeAccent,
      'EN_PROCESO': Colors.blueAccent,
    };

    _paymentPieSections = statusCounts.entries.map((entry) {
      return PieChartSectionData(
        color: colors[entry.key] ?? Colors.grey,
        value: entry.value.toDouble(),
        title: '${entry.key}\n${entry.value}',
        radius: 50,
        titleStyle: const TextStyle(
            fontSize: 10, fontWeight: FontWeight.bold, color: Colors.white),
      );
    }).toList();
  }

  void _processGenderStats() {
    int m = 0;
    int f = 0;
    final processedIds = <int>{};

    for (var ins in _inscripciones) {
      final est = ins['estudiante'];
      if (est == null) continue;
      final id = est['idEstudiante'];
      if (processedIds.contains(id)) continue;
      processedIds.add(id);

      if (est['sexo'] == 'M') {
        m++;
      } else if (est['sexo'] == 'F') f++;
    }

    _genderPieSections = [
      PieChartSectionData(
        color: const Color(0xFF277da1),
        value: m.toDouble(),
        title: 'M: $m',
        radius: 40,
        titleStyle: const TextStyle(
            fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white),
      ),
      PieChartSectionData(
        color: const Color(0xFFf9c74f),
        value: f.toDouble(),
        title: 'F: $f',
        radius: 40,
        titleStyle: const TextStyle(
            fontSize: 12, fontWeight: FontWeight.bold, color: Colors.white),
      ),
    ];
  }

  void _processGradesStats() {
    // Agrupar por asignatura
    final grouped = <String, List<double>>{};
    for (var cal in _calificaciones) {
      final asignatura = cal['curricular']?['descripcion'] ?? 'Otras';
      if (!grouped.containsKey(asignatura)) grouped[asignatura] = [];
      grouped[asignatura]!.add((cal['nota'] ?? 0.0).toDouble());
    }

    int index = 0;
    _gradesBarChunks = grouped.entries.take(6).map((entry) {
      final avg = entry.value.reduce((a, b) => a + b) / entry.value.length;
      return BarChartGroupData(
        x: index++,
        barRods: [
          BarChartRodData(
            toY: avg,
            color: Colors.indigoAccent,
            width: 16,
            borderRadius: BorderRadius.circular(4),
          )
        ],
      );
    }).toList();
  }

  void _processTrendStats() {
    // Por periodos
    final periodCounts = <int, List<double>>{};
    for (var cal in _calificaciones) {
      // Intentar encontrar el periodo a traves de la inscripcion/niveldetalle
      // Simplificacion: Usar idPeriodo si esta disponible en el objeto anidado o fake it for demo
      final periodoId = cal['curricular']?['docenteNivelDetalleCurso']
              ?['nivelDetalleCurso']?['nivelDetalle']?['nivel']?['idPeriodo'] ??
          1;
      if (!periodCounts.containsKey(periodoId)) periodCounts[periodoId] = [];
      periodCounts[periodoId]!.add((cal['nota'] ?? 0.0).toDouble());
    }

    final sortedKeys = periodCounts.keys.toList()..sort();
    _trendSpots = [];
    _trendLabels = [];
    double x = 0;
    for (var key in sortedKeys) {
      final avg = periodCounts[key]!.reduce((a, b) => a + b) /
          periodCounts[key]!.length;
      _trendSpots.add(FlSpot(x++, avg));
      _trendLabels.add('P$key');
    }
  }

  Future<void> _generateInitialAIInsight() async {
    setState(() => _aiLoading = true);
    final prompt = """
      Analiza estas estadísticas educativas:
      Estudiantes: $_totalEstudiantes
      Promedio General: ${_promedioGeneral.toStringAsFixed(2)}
      Inscripciones: $_totalInscripciones
      
      Dime 2 fortalezas y 1 debilidad basada en estos números en 2 oraciones cortas.
    """;

    try {
      final response = await _geminiService.generateResponse(prompt);
      setState(() {
        _aiInsight = response;
        _aiLoading = false;
      });
    } catch (e) {
      setState(() {
        _aiInsight = "No se pudo generar el análisis en este momento.";
        _aiLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF0F2F5),
      appBar: AppBar(
        title: const Text('Reportes y Estadísticas',
            style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFF203A43),
        foregroundColor: Colors.white,
        elevation: 0,
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(child: Text(_error!))
              : SingleChildScrollView(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      _buildAISection(),
                      const SizedBox(height: 20),
                      _buildSummaryCards(),
                      const SizedBox(height: 24),
                      _buildChartCard(
                        title: 'Promedios por Asignatura',
                        subtitle: 'Rendimiento académico global',
                        height: 250,
                        chart: BarChart(
                          BarChartData(
                            barGroups: _gradesBarChunks,
                            borderData: FlBorderData(show: false),
                            titlesData: FlTitlesData(
                              leftTitles: AxisTitles(
                                  sideTitles: SideTitles(
                                      showTitles: true, reservedSize: 30)),
                              bottomTitles: AxisTitles(
                                  sideTitles: SideTitles(showTitles: false)),
                              rightTitles: AxisTitles(
                                  sideTitles: SideTitles(showTitles: false)),
                              topTitles: AxisTitles(
                                  sideTitles: SideTitles(showTitles: false)),
                            ),
                          ),
                        ),
                      ),
                      const SizedBox(height: 16),
                      Row(
                        children: [
                          Expanded(
                            child: _buildChartCard(
                              title: 'Estado de Pagos',
                              subtitle: 'Inscripciones',
                              height: 200,
                              chart: PieChart(
                                PieChartData(
                                  sections: _paymentPieSections,
                                  sectionsSpace: 2,
                                  centerSpaceRadius: 30,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: _buildChartCard(
                              title: 'Género',
                              subtitle: 'Distribución',
                              height: 200,
                              chart: PieChart(
                                PieChartData(
                                  sections: _genderPieSections,
                                  sectionsSpace: 2,
                                  centerSpaceRadius: 30,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      _buildChartCard(
                        title: 'Tendencia de Notas',
                        subtitle: 'Evolución por periodo',
                        height: 250,
                        chart: LineChart(
                          LineChartData(
                            lineBarsData: [
                              LineChartBarData(
                                spots: _trendSpots,
                                isCurved: true,
                                color: Colors.orange,
                                barWidth: 4,
                                belowBarData: BarAreaData(
                                    show: true,
                                    color: Colors.orange.withOpacity(0.1)),
                              ),
                            ],
                            titlesData: FlTitlesData(
                              bottomTitles: AxisTitles(
                                sideTitles: SideTitles(
                                  showTitles: true,
                                  getTitlesWidget: (val, meta) {
                                    if (val.toInt() < _trendLabels.length) {
                                      return Text(_trendLabels[val.toInt()],
                                          style: const TextStyle(fontSize: 10));
                                    }
                                    return const Text('');
                                  },
                                ),
                              ),
                              leftTitles: AxisTitles(
                                  sideTitles: SideTitles(
                                      showTitles: true, reservedSize: 30)),
                              topTitles: AxisTitles(
                                  sideTitles: SideTitles(showTitles: false)),
                              rightTitles: AxisTitles(
                                  sideTitles: SideTitles(showTitles: false)),
                            ),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
    );
  }

  Widget _buildAISection() {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
            colors: [Color(0xFF2C5364), Color(0xFF203A43)]),
        borderRadius: BorderRadius.circular(15),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Icon(Icons.auto_awesome, color: Colors.amber, size: 20),
              const SizedBox(width: 8),
              const Text('Análisis IA (Gemini)',
                  style: TextStyle(
                      color: Colors.white, fontWeight: FontWeight.bold)),
              const Spacer(),
              if (_aiLoading)
                const SizedBox(
                    width: 16,
                    height: 16,
                    child: CircularProgressIndicator(
                        strokeWidth: 2, color: Colors.white)),
            ],
          ),
          const SizedBox(height: 8),
          Text(_aiInsight,
              style: const TextStyle(
                  color: Colors.white70, fontSize: 13, height: 1.4)),
        ],
      ),
    );
  }

  Widget _buildSummaryCards() {
    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      childAspectRatio: 1.8,
      mainAxisSpacing: 12,
      crossAxisSpacing: 12,
      children: [
        _buildStatCard('Estudiantes', _totalEstudiantes.toString(),
            Icons.people, Colors.blue),
        _buildStatCard('Promedio', _promedioGeneral.toStringAsFixed(1),
            Icons.star, Colors.orange),
        _buildStatCard('Matrículas', _totalInscripciones.toString(),
            Icons.assignment, Colors.green),
        _buildStatCard(
            'Niveles', _totalNiveles.toString(), Icons.layers, Colors.purple),
      ],
    );
  }

  Widget _buildStatCard(
      String label, String value, IconData icon, Color color) {
    return Container(
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)
        ],
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
                color: color.withOpacity(0.1),
                borderRadius: BorderRadius.circular(10)),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(width: 12),
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(value,
                  style: const TextStyle(
                      fontSize: 18, fontWeight: FontWeight.bold)),
              Text(label,
                  style: const TextStyle(fontSize: 10, color: Colors.grey)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildChartCard(
      {required String title,
      required String subtitle,
      required double height,
      required Widget chart}) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
        boxShadow: [
          BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 10)
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(title,
              style:
                  const TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
          Text(subtitle,
              style: const TextStyle(color: Colors.grey, fontSize: 11)),
          const SizedBox(height: 20),
          SizedBox(height: height, child: chart),
        ],
      ),
    );
  }
}
