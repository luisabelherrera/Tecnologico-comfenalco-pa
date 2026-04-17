import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:file_picker/file_picker.dart';
import '../services/api_service.dart';

class NewsFormScreen extends StatefulWidget {
  const NewsFormScreen({super.key});

  @override
  State<NewsFormScreen> createState() => _NewsFormScreenState();
}

class _NewsFormScreenState extends State<NewsFormScreen>
    with TickerProviderStateMixin {
  final _formKey = GlobalKey<FormState>();
  final _apiService = ApiService();
  final _picker = ImagePicker();
  final _scrollController = ScrollController();

  final _tituloController = TextEditingController();
  final _contenidoController = TextEditingController();

  String? _selectedImagePath;
  String? _selectedVideoPath;
  bool _isLoading = false;

  late AnimationController _headerAnim;
  late Animation<double> _headerFade;

  // Paleta de colores coherente
  static const _primaryDark = Color(0xFF0F2027);
  static const _primaryMid = Color(0xFF203A43);
  static const _primaryLight = Color(0xFF2C5364);
  static const _accentGold = Color(0xFFFFD700);
  static const _accentAmber = Color(0xFFFFC107);
  static const _accentGreen = Color(0xFF4ADE80);
  static const _accentRed = Color(0xFFFF6B6B);

  @override
  void initState() {
    super.initState();
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
    _tituloController.dispose();
    _contenidoController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  Future<void> _pickImage() async {
    final XFile? image = await _picker.pickImage(source: ImageSource.gallery);
    if (image != null) {
      setState(() {
        _selectedImagePath = image.path;
      });
    }
  }

  Future<void> _pickVideo() async {
    FilePickerResult? result = await FilePicker.platform.pickFiles(
      type: FileType.video,
    );
    if (result != null) {
      setState(() {
        _selectedVideoPath = result.files.single.path;
      });
    }
  }

  void _save() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      final success = await _apiService.createNoticia(
        titulo: _tituloController.text.trim(),
        contenido: _contenidoController.text.trim(),
        imagenPath: _selectedImagePath,
        videoPath: _selectedVideoPath,
      );

      setState(() => _isLoading = false);

      if (success && mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: const Row(
              children: [
                Icon(Icons.check_circle_rounded, color: Colors.white),
                SizedBox(width: 12),
                Text('Noticia publicada exitosamente'),
              ],
            ),
            backgroundColor: _accentGreen,
            behavior: SnackBarBehavior.floating,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            margin: const EdgeInsets.all(16),
          ),
        );
        Future.delayed(const Duration(milliseconds: 1500), () {
          if (mounted) Navigator.pop(context, true);
        });
      } else if (mounted) {
        _showErrorSnackBar('Error al publicar la noticia. Intenta de nuevo.');
      }
    } catch (e) {
      setState(() => _isLoading = false);
      if (mounted) {
        _showErrorSnackBar('Error inesperado. Por favor intenta de nuevo.');
      }
    }
  }

  void _showErrorSnackBar(String message) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Row(
          children: [
            const Icon(Icons.error_outline_rounded, color: Colors.white),
            const SizedBox(width: 12),
            Expanded(child: Text(message)),
          ],
        ),
        backgroundColor: _accentRed,
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
          child: _isLoading ? _buildLoadingState() : _buildForm(),
        ),
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
            'Publicando noticia...',
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

  Widget _buildForm() {
    return Column(
      children: [
        FadeTransition(
          opacity: _headerFade,
          child: _buildHeader(),
        ),
        Expanded(
          child: SingleChildScrollView(
            controller: _scrollController,
            physics: const BouncingScrollPhysics(),
            child: Padding(
              padding: const EdgeInsets.fromLTRB(20, 24, 20, 32),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Titulo del formulario
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: _accentGold.withOpacity(0.2),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: const Icon(
                            Icons.article_rounded,
                            color: _accentGold,
                            size: 24,
                          ),
                        ),
                        const SizedBox(width: 14),
                        const Text(
                          'Nueva Noticia',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w700,
                            color: Colors.white,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 28),
                    // Campo titulo
                    _buildLabel('Título de la Noticia'),
                    const SizedBox(height: 10),
                    _buildTextField(
                      controller: _tituloController,
                      hintText: 'Ej: Inicio de semestres académicos 2025-I',
                      icon: Icons.title_rounded,
                      validator: (v) =>
                      v!.isEmpty ? 'El título es obligatorio' : null,
                      maxLines: 1,
                    ),
                    const SizedBox(height: 24),
                    // Campo contenido
                    _buildLabel('Contenido'),
                    const SizedBox(height: 10),
                    _buildTextField(
                      controller: _contenidoController,
                      hintText:
                      'Escribe el contenido detallado de la noticia aqui...',
                      icon: Icons.description_rounded,
                      validator: (v) =>
                      v!.isEmpty ? 'El contenido es obligatorio' : null,
                      maxLines: 6,
                    ),
                    const SizedBox(height: 32),
                    // Titulo de archivos
                    _buildLabel('Archivos Multimedia'),
                    const SizedBox(height: 14),
                    // Botones de seleccion
                    Row(
                      children: [
                        Expanded(
                          child: _buildUploadButton(
                            icon: Icons.image_rounded,
                            label: 'Imagen',
                            onTap: _pickImage,
                            color: const Color(0xFF4ECDC4),
                          ),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: _buildUploadButton(
                            icon: Icons.videocam_rounded,
                            label: 'Video',
                            onTap: _pickVideo,
                            color: const Color(0xFFFF6B9D),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 18),
                    // Previsualizaciones de archivos
                    if (_selectedImagePath != null) ...[
                      _buildFilePreview(
                        icon: Icons.image_rounded,
                        title: 'Imagen seleccionada',
                        fileName: _selectedImagePath!.split('/').last,
                        onRemove: () =>
                            setState(() => _selectedImagePath = null),
                        color: const Color(0xFF4ECDC4),
                      ),
                      const SizedBox(height: 12),
                    ],
                    if (_selectedVideoPath != null) ...[
                      _buildFilePreview(
                        icon: Icons.videocam_rounded,
                        title: 'Video seleccionado',
                        fileName: _selectedVideoPath!.split('/').last,
                        onRemove: () =>
                            setState(() => _selectedVideoPath = null),
                        color: const Color(0xFFFF6B9D),
                      ),
                      const SizedBox(height: 12),
                    ],
                    const SizedBox(height: 8),
                    // Boton de publicar
                    SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: ElevatedButton.icon(
                        onPressed: _save,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _accentGold,
                          foregroundColor: _primaryDark,
                          elevation: 0,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          shadowColor: _accentGold.withOpacity(0.4),
                        ),
                        icon: const Icon(Icons.publish_rounded, size: 22),
                        label: const Text(
                          'Publicar Noticia',
                          style: TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ],
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
          const Text(
            'Publicar Noticia',
            style: TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w700,
              color: Colors.white,
            ),
          ),
          const Spacer(),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: _accentGold.withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: _accentGold.withOpacity(0.3)),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.newspaper_rounded,
                    color: _accentGold, size: 16),
                const SizedBox(width: 6),
                Text(
                  'Administrador',
                  style: TextStyle(
                    color: _accentGold,
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildLabel(String label) {
    return Row(
      children: [
        Text(
          label,
          style: const TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w700,
            color: Colors.white,
            letterSpacing: 0.3,
          ),
        ),
        const SizedBox(width: 6),
        Container(
          width: 4,
          height: 4,
          decoration: const BoxDecoration(
            color: _accentGold,
            shape: BoxShape.circle,
          ),
        ),
      ],
    );
  }

  Widget _buildTextField({
    required TextEditingController controller,
    required String hintText,
    required IconData icon,
    required String? Function(String?) validator,
    required int maxLines,
  }) {
    return TextFormField(
      controller: controller,
      maxLines: maxLines,
      validator: validator,
      style: const TextStyle(color: Colors.white, fontSize: 15),
      decoration: InputDecoration(
        hintText: hintText,
        hintStyle: TextStyle(color: Colors.white.withOpacity(0.4)),
        prefixIcon: Icon(icon, color: Colors.white.withOpacity(0.6)),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: Colors.white.withOpacity(0.1)),
        ),
        enabledBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: BorderSide(color: Colors.white.withOpacity(0.1)),
        ),
        focusedBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: _accentGold, width: 2),
        ),
        errorBorder: OutlineInputBorder(
          borderRadius: BorderRadius.circular(16),
          borderSide: const BorderSide(color: _accentRed, width: 1.5),
        ),
        filled: true,
        fillColor: Colors.white.withOpacity(0.08),
        contentPadding:
        const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
      ),
    );
  }

  Widget _buildUploadButton({
    required IconData icon,
    required String label,
    required VoidCallback onTap,
    required Color color,
  }) {
    return Material(
      color: Colors.transparent,
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(16),
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 16),
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [
                Colors.white.withOpacity(0.12),
                Colors.white.withOpacity(0.05),
              ],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(16),
            border: Border.all(color: Colors.white.withOpacity(0.15)),
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: color.withOpacity(0.2),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Icon(icon, color: color, size: 24),
              ),
              const SizedBox(height: 10),
              Text(
                label,
                style: const TextStyle(
                  color: Colors.white,
                  fontSize: 14,
                  fontWeight: FontWeight.w600,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildFilePreview({
    required IconData icon,
    required String title,
    required String fileName,
    required VoidCallback onRemove,
    required Color color,
  }) {
    return Container(
      padding: const EdgeInsets.all(14),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          colors: [
            Colors.white.withOpacity(0.1),
            Colors.white.withOpacity(0.05),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: color.withOpacity(0.3)),
      ),
      child: Row(
        children: [
          Container(
            padding: const EdgeInsets.all(8),
            decoration: BoxDecoration(
              color: color.withOpacity(0.2),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, color: color, size: 20),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  title,
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.9),
                    fontSize: 13,
                    fontWeight: FontWeight.w600,
                  ),
                ),
                const SizedBox(height: 2),
                Text(
                  fileName,
                  style: TextStyle(
                    color: Colors.white.withOpacity(0.5),
                    fontSize: 12,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ],
            ),
          ),
          const SizedBox(width: 12),
          Material(
            color: Colors.transparent,
            child: InkWell(
              onTap: onRemove,
              borderRadius: BorderRadius.circular(8),
              child: Container(
                padding: const EdgeInsets.all(6),
                decoration: BoxDecoration(
                  color: _accentRed.withOpacity(0.15),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Icon(
                  Icons.close_rounded,
                  color: _accentRed,
                  size: 18,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}