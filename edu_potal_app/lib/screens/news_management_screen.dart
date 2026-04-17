import 'dart:io';
import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/noticia_model.dart';
import 'news_form_screen.dart';

class NewsManagementScreen extends StatefulWidget {
  const NewsManagementScreen({super.key});

  @override
  State<NewsManagementScreen> createState() => _NewsManagementScreenState();
}

class _NewsManagementScreenState extends State<NewsManagementScreen>
    with TickerProviderStateMixin {
  final ApiService _apiService = ApiService();
  late Future<List<Noticia>> _newsFuture;
  late AnimationController _headerAnim;
  late Animation<double> _headerFade;

  // Paleta de colores coherente
  static const _primaryDark = Color(0xFF0F2027);
  static const _primaryMid = Color(0xFF203A43);
  static const _primaryLight = Color(0xFF2C5364);
  static const _accentGold = Color(0xFFFFD700);
  static const _accentAmber = Color(0xFFFFC107);
  static const _accentRed = Color(0xFFFF6B6B);
  static const _accentGreen = Color(0xFF4ADE80);
  static const _accentTeal = Color(0xFF4ECDC4);
  static const _accentPink = Color(0xFFFF6B9D);

  @override
  void initState() {
    super.initState();
    _newsFuture = _apiLoadNews();

    _headerAnim = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 800),
    );
    _headerFade = CurvedAnimation(parent: _headerAnim, curve: Curves.easeOutCubic);
    _headerAnim.forward();
  }

  @override
  void dispose() {
    _headerAnim.dispose();
    super.dispose();
  }

  Future<List<Noticia>> _apiLoadNews() async {
    return await _apiService.getNoticias();
  }

  void _refreshNews() {
    setState(() {
      _newsFuture = _apiLoadNews();
    });
  }

  void _confirmDelete(String id, String title) async {
    final confirm = await showDialog<bool>(
      context: context,
      builder: (context) => AlertDialog(
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
            const Text('Eliminar Noticia'),
          ],
        ),
        content: Text('¿Estas seguro que deseas eliminar "$title"?'),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context, false),
            child: Text('Cancelar', style: TextStyle(color: Colors.grey.shade600)),
          ),
          ElevatedButton(
            onPressed: () => Navigator.pop(context, true),
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

    if (confirm == true) {
      final success = await _apiService.deleteNoticia(id);
      if (success) {
        _refreshNews();
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: const Row(
                children: [
                  Icon(Icons.check_circle_rounded, color: Colors.white),
                  SizedBox(width: 12),
                  Text('Noticia eliminada correctamente'),
                ],
              ),
              backgroundColor: _accentGreen,
              behavior: SnackBarBehavior.floating,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              margin: const EdgeInsets.all(16),
            ),
          );
        }
      }
    }
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
                child: FutureBuilder<List<Noticia>>(
                  future: _newsFuture,
                  builder: (context, snapshot) {
                    if (snapshot.connectionState == ConnectionState.waiting) {
                      return _buildLoadingState();
                    }
                    if (snapshot.hasError) {
                      return _buildErrorState(snapshot.error.toString());
                    }

                    final newsList = snapshot.data ?? [];

                    if (newsList.isEmpty) {
                      return _buildEmptyState();
                    }

                    return _buildNewsList(newsList);
                  },
                ),
              ),
            ],
          ),
        ),
      ),
      floatingActionButton: _buildFAB(),
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
          const Expanded(
            child: Text(
              'Gestion de Noticias',
              style: TextStyle(
                fontSize: 22,
                fontWeight: FontWeight.w700,
                color: Colors.white,
              ),
            ),
          ),
          Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: _refreshNews,
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
            child: const CircularProgressIndicator(
              color: _accentGold,
              strokeWidth: 3,
            ),
          ),
          const SizedBox(height: 20),
          Text(
            'Cargando noticias...',
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
                color: _accentGold.withOpacity(0.15),
                shape: BoxShape.circle,
                border: Border.all(
                  color: _accentGold.withOpacity(0.2),
                  width: 2,
                ),
              ),
              child: const Icon(
                Icons.newspaper_rounded,
                size: 56,
                color: _accentGold,
              ),
            ),
            const SizedBox(height: 24),
            const Text(
              'No hay noticias publicadas',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w700,
                color: Colors.white,
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 8),
            Text(
              'Comienza creando la primera noticia para tu institucion',
              style: TextStyle(
                fontSize: 14,
                color: Colors.white.withOpacity(0.6),
              ),
              textAlign: TextAlign.center,
            ),
            const SizedBox(height: 28),
            ElevatedButton.icon(
              onPressed: () async {
                final result = await Navigator.push(
                  context,
                  MaterialPageRoute(builder: (_) => const NewsFormScreen()),
                );
                if (result == true) _refreshNews();
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: _accentGold,
                foregroundColor: _primaryDark,
                padding: const EdgeInsets.symmetric(horizontal: 28, vertical: 14),
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              icon: const Icon(Icons.add_rounded),
              label: const Text(
                'Crear Noticia',
                style: TextStyle(fontWeight: FontWeight.w600),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildErrorState(String error) {
    return Center(
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
          Text(
            'Error al cargar noticias',
            style: TextStyle(
              color: Colors.white.withOpacity(0.8),
              fontSize: 16,
              fontWeight: FontWeight.w500,
            ),
          ),
          const SizedBox(height: 20),
          ElevatedButton.icon(
            onPressed: _refreshNews,
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
    );
  }

  Widget _buildNewsList(List<Noticia> newsList) {
    return ListView.builder(
      padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
      physics: const BouncingScrollPhysics(),
      itemCount: newsList.length,
      itemBuilder: (context, index) {
        final noticia = newsList[index];
        return TweenAnimationBuilder<double>(
          tween: Tween(begin: 0.0, end: 1.0),
          duration: Duration(milliseconds: 300 + (index * 100)),
          curve: Curves.easeOutCubic,
          builder: (context, value, child) {
            return Transform.translate(
              offset: Offset(0, 30 * (1 - value)),
              child: Opacity(opacity: value, child: child),
            );
          },
          child: _buildNewsCard(noticia),
        );
      },
    );
  }

  Widget _buildNewsCard(Noticia noticia) {
    final hasImage = noticia.imagenPath != null && noticia.imagenPath!.isNotEmpty;
    final hasVideo = noticia.videoPath != null && noticia.videoPath!.isNotEmpty;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Colors.white.withOpacity(0.12),
            Colors.white.withOpacity(0.05),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.white.withOpacity(0.1)),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          onTap: () => _showNewsDetail(noticia),
          borderRadius: BorderRadius.circular(20),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Imagen de la noticia
              if (hasImage) _buildNewsImage(noticia),

              Padding(
                padding: const EdgeInsets.all(18),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Titulo y contenido
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        if (!hasImage)
                          Container(
                            padding: const EdgeInsets.all(10),
                            decoration: BoxDecoration(
                              color: _accentGold.withOpacity(0.2),
                              borderRadius: BorderRadius.circular(12),
                            ),
                            child: const Icon(
                              Icons.newspaper_rounded,
                              color: _accentGold,
                              size: 22,
                            ),
                          ),
                        if (!hasImage) const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                noticia.titulo,
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                                style: const TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.w700,
                                  color: Colors.white,
                                  height: 1.2,
                                ),
                              ),
                              const SizedBox(height: 6),
                              Text(
                                noticia.contenido,
                                maxLines: 2,
                                overflow: TextOverflow.ellipsis,
                                style: TextStyle(
                                  fontSize: 13,
                                  color: Colors.white.withOpacity(0.65),
                                  height: 1.4,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),

                    // Indicadores de archivos adjuntos
                    if (hasImage || hasVideo) ...[
                      const SizedBox(height: 14),
                      Row(
                        children: [
                          if (hasImage)
                            _buildAttachmentChip(
                              Icons.image_rounded,
                              'Imagen',
                              _accentTeal,
                            ),
                          if (hasImage && hasVideo) const SizedBox(width: 8),
                          if (hasVideo)
                            _buildAttachmentChip(
                              Icons.videocam_rounded,
                              'Video',
                              _accentPink,
                            ),
                        ],
                      ),
                    ],

                    const SizedBox(height: 16),
                    Divider(color: Colors.white.withOpacity(0.1)),
                    const SizedBox(height: 12),

                    // Botones de accion
                    Row(
                      mainAxisAlignment: MainAxisAlignment.end,
                      children: [
                        _buildActionButton(
                          Icons.visibility_rounded,
                          'Ver',
                          Colors.white.withOpacity(0.6),
                              () => _showNewsDetail(noticia),
                        ),
                        const SizedBox(width: 10),
                        _buildActionButton(
                          Icons.edit_rounded,
                          'Editar',
                          Colors.blue,
                              () async {
                            final result = await Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (_) => const NewsFormScreen(),
                              ),
                            );
                            if (result == true) _refreshNews();
                          },
                        ),
                        const SizedBox(width: 10),
                        _buildActionButton(
                          Icons.delete_outline_rounded,
                          'Eliminar',
                          _accentRed,
                              () => _confirmDelete(noticia.id, noticia.titulo),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildNewsImage(Noticia noticia) {
    String finalUrl = noticia.imagenPath!;
    if (!_isNetworkUrl(finalUrl)) {
      finalUrl = _apiService.getNoticiaImageUrl(noticia.id);
    }

    return ClipRRect(
      borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
      child: Stack(
        children: [
          // Imagen
          Container(
            height: 160,
            width: double.infinity,
            decoration: BoxDecoration(
              color: _primaryMid,
            ),
            child: Image.network(
              finalUrl,
              fit: BoxFit.cover,
              errorBuilder: (_, __, ___) => _buildImagePlaceholder(),
              loadingBuilder: (context, child, loadingProgress) {
                if (loadingProgress == null) return child;
                return _buildImageLoading();
              },
            ),
          ),
          // Gradient overlay
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Container(
              height: 60,
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                  colors: [
                    Colors.transparent,
                    Colors.black.withOpacity(0.5),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  bool _isNetworkUrl(String url) {
    return url.startsWith('http://') || url.startsWith('https://');
  }

  Widget _buildImagePlaceholder() {
    return Container(
      color: _primaryMid,
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(
              Icons.image_not_supported_rounded,
              color: Colors.white.withOpacity(0.3),
              size: 40,
            ),
            const SizedBox(height: 8),
            Text(
              'Imagen no disponible',
              style: TextStyle(
                color: Colors.white.withOpacity(0.3),
                fontSize: 12,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildImageLoading() {
    return Container(
      color: _primaryMid,
      child: Center(
        child: CircularProgressIndicator(
          color: _accentGold.withOpacity(0.5),
          strokeWidth: 2,
        ),
      ),
    );
  }

  Widget _buildAttachmentChip(IconData icon, String label, Color color) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
      decoration: BoxDecoration(
        color: color.withOpacity(0.15),
        borderRadius: BorderRadius.circular(8),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(icon, color: color, size: 14),
          const SizedBox(width: 6),
          Text(
            label,
            style: TextStyle(
              color: color,
              fontSize: 11,
              fontWeight: FontWeight.w600,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton(
      IconData icon,
      String label,
      Color color,
      VoidCallback onTap,
      ) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(10),
        child: Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
          decoration: BoxDecoration(
            color: color.withOpacity(0.2),
            borderRadius: BorderRadius.circular(10),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              Icon(icon, color: color, size: 16),
              const SizedBox(width: 6),
              Text(
                label,
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                  color: color,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  void _showNewsDetail(Noticia noticia) {
    final hasImage = noticia.imagenPath != null && noticia.imagenPath!.isNotEmpty;
    final hasVideo = noticia.videoPath != null && noticia.videoPath!.isNotEmpty;

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => DraggableScrollableSheet(
        initialChildSize: 0.85,
        minChildSize: 0.5,
        maxChildSize: 0.95,
        builder: (context, scrollController) => Container(
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
              Expanded(
                child: ListView(
                  controller: scrollController,
                  padding: const EdgeInsets.all(24),
                  children: [
                    // Imagen grande
                    if (hasImage)
                      ClipRRect(
                        borderRadius: BorderRadius.circular(16),
                        child: Container(
                          height: 200,
                          width: double.infinity,
                          decoration: BoxDecoration(
                            color: _primaryMid,
                          ),
                          child: Image.network(
                            _isNetworkUrl(noticia.imagenPath!) ? noticia.imagenPath! : _apiService.getNoticiaImageUrl(noticia.id),
                            fit: BoxFit.cover,
                            errorBuilder: (_, __, ___) =>
                                _buildImagePlaceholder(),
                          ),
                        ),
                      ),
                    if (hasImage) const SizedBox(height: 20),

                    // Titulo
                    Text(
                      noticia.titulo,
                      style: const TextStyle(
                        fontSize: 24,
                        fontWeight: FontWeight.w800,
                        color: Colors.white,
                        height: 1.2,
                      ),
                    ),
                    const SizedBox(height: 16),

                    // Chips de adjuntos
                    if (hasImage || hasVideo)
                      Row(
                        children: [
                          if (hasImage)
                            _buildAttachmentChip(
                              Icons.image_rounded,
                              'Imagen adjunta',
                              _accentTeal,
                            ),
                          if (hasImage && hasVideo) const SizedBox(width: 8),
                          if (hasVideo)
                            _buildAttachmentChip(
                              Icons.videocam_rounded,
                              'Video adjunto',
                              _accentPink,
                            ),
                        ],
                      ),
                    if (hasImage || hasVideo) const SizedBox(height: 20),

                    // Contenido completo
                    Text(
                      noticia.contenido,
                      style: TextStyle(
                        fontSize: 15,
                        color: Colors.white.withOpacity(0.85),
                        height: 1.6,
                      ),
                    ),

                    // Video preview
                    if (hasVideo) ...[
                      const SizedBox(height: 24),
                      Container(
                        padding: const EdgeInsets.all(16),
                        decoration: BoxDecoration(
                          color: _accentPink.withOpacity(0.15),
                          borderRadius: BorderRadius.circular(16),
                          border: Border.all(color: _accentPink.withOpacity(0.3)),
                        ),
                        child: Row(
                          children: [
                            Container(
                              padding: const EdgeInsets.all(12),
                              decoration: BoxDecoration(
                                color: _accentPink.withOpacity(0.2),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: const Icon(
                                Icons.play_circle_rounded,
                                color: _accentPink,
                                size: 28,
                              ),
                            ),
                            const SizedBox(width: 14),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    'Video Adjunto',
                                    style: TextStyle(
                                      color: Colors.white,
                                      fontSize: 14,
                                      fontWeight: FontWeight.w600,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    noticia.videoPath!.split('/').last,
                                    style: TextStyle(
                                      color: Colors.white.withOpacity(0.6),
                                      fontSize: 12,
                                    ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ),
                    ],
                    const SizedBox(height: 32),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFAB() {
    return Container(
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(16),
        gradient: const LinearGradient(
          colors: [_accentGold, _accentAmber],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: [
          BoxShadow(
            color: _accentGold.withOpacity(0.4),
            blurRadius: 20,
            offset: const Offset(0, 8),
          ),
        ],
      ),
      child: FloatingActionButton(
        onPressed: () async {
          final result = await Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const NewsFormScreen()),
          );
          if (result == true) _refreshNews();
        },
        backgroundColor: Colors.transparent,
        elevation: 0,
        highlightElevation: 0,
        child: const Icon(Icons.add_rounded, color: Colors.white, size: 28),
      ),
    );
  }
}