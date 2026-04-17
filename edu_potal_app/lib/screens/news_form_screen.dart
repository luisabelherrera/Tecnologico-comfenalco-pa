import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:file_picker/file_picker.dart';
import '../services/api_service.dart';

class NewsFormScreen extends StatefulWidget {
  const NewsFormScreen({super.key});

  @override
  State<NewsFormScreen> createState() => _NewsFormScreenState();
}

class _NewsFormScreenState extends State<NewsFormScreen> {
  final _formKey = GlobalKey<FormState>();
  final _apiService = ApiService();
  final _picker = ImagePicker();

  final _tituloController = TextEditingController();
  final _contenidoController = TextEditingController();

  String? _selectedImagePath;
  String? _selectedVideoPath;
  bool _isLoading = false;

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

    final success = await _apiService.createNoticia(
      titulo: _tituloController.text,
      contenido: _contenidoController.text,
      imagenPath: _selectedImagePath,
      videoPath: _selectedVideoPath,
    );

    setState(() => _isLoading = false);

    if (success) {
      if (mounted) Navigator.pop(context, true);
    } else {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Error al publicar la noticia')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Publicar Noticia'),
        backgroundColor: const Color(0xFF203A43),
        foregroundColor: Colors.white,
      ),
      body: _isLoading 
        ? const Center(child: CircularProgressIndicator())
        : Padding(
            padding: const EdgeInsets.all(20),
            child: Form(
              key: _formKey,
              child: ListView(
                children: [
                  TextFormField(
                    controller: _tituloController,
                    decoration: const InputDecoration(labelText: 'Título', border: OutlineInputBorder()),
                    validator: (v) => v!.isEmpty ? 'Campo obligatorio' : null,
                  ),
                  const SizedBox(height: 16),
                  TextFormField(
                    controller: _contenidoController,
                    decoration: const InputDecoration(labelText: 'Contenido', border: OutlineInputBorder()),
                    maxLines: 5,
                    validator: (v) => v!.isEmpty ? 'Campo obligatorio' : null,
                  ),
                  const SizedBox(height: 24),
                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: _pickImage,
                          icon: const Icon(Icons.image),
                          label: const Text('Imagen'),
                          style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 12)),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: OutlinedButton.icon(
                          onPressed: _pickVideo,
                          icon: const Icon(Icons.videocam),
                          label: const Text('Video'),
                          style: OutlinedButton.styleFrom(padding: const EdgeInsets.symmetric(vertical: 12)),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  if (_selectedImagePath != null)
                    ListTile(
                      leading: const Icon(Icons.check_circle, color: Colors.green),
                      title: const Text('Imagen seleccionada'),
                      subtitle: Text(_selectedImagePath!.split('/').last),
                      trailing: IconButton(icon: const Icon(Icons.close), onPressed: () => setState(() => _selectedImagePath = null)),
                    ),
                  if (_selectedVideoPath != null)
                    ListTile(
                      leading: const Icon(Icons.check_circle, color: Colors.green),
                      title: const Text('Video seleccionado'),
                      subtitle: Text(_selectedVideoPath!.split('/').last),
                      trailing: IconButton(icon: const Icon(Icons.close), onPressed: () => setState(() => _selectedVideoPath = null)),
                    ),
                  const SizedBox(height: 32),
                  ElevatedButton(
                    onPressed: _save,
                    style: ElevatedButton.styleFrom(
                      backgroundColor: const Color(0xFF2C5364),
                      foregroundColor: Colors.white,
                      padding: const EdgeInsets.symmetric(vertical: 16),
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    ),
                    child: const Text('Publicar Noticia'),
                  ),
                ],
              ),
            ),
          ),
    );
  }
}
