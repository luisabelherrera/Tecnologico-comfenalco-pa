import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/noticia_model.dart';
import 'news_form_screen.dart';

class NewsManagementScreen extends StatefulWidget {
  const NewsManagementScreen({super.key});

  @override
  State<NewsManagementScreen> createState() => _NewsManagementScreenState();
}

class _NewsManagementScreenState extends State<NewsManagementScreen> {
  final ApiService _apiService = ApiService();
  late Future<List<Noticia>> _newsFuture;

  @override
  void initState() {
    super.initState();
    _newsFuture = _apiLoadNews();
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
        title: const Text('Eliminar Noticia'),
        content: Text('¿Estás seguro que deseas eliminar "$title"?'),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text('Cancelar')),
          TextButton(
            onPressed: () => Navigator.pop(context, true), 
            style: TextButton.styleFrom(foregroundColor: Colors.red),
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
            const SnackBar(content: Text('Noticia eliminada correctamente')),
          );
        }
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFFF5F7FA),
      appBar: AppBar(
        title: const Text('Gestión de Noticias', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: const Color(0xFF203A43),
        foregroundColor: Colors.white,
        actions: [
          IconButton(onPressed: _refreshNews, icon: const Icon(Icons.refresh_rounded)),
        ],
      ),
      body: FutureBuilder<List<Noticia>>(
        future: _newsFuture,
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }
          
          final newsList = snapshot.data ?? [];
          
          if (newsList.isEmpty) {
            return const Center(child: Text('No hay noticias publicadas'));
          }

          return ListView.builder(
            padding: const EdgeInsets.all(12),
            itemCount: newsList.length,
            itemBuilder: (context, index) {
              final notizia = newsList[index];
              return Card(
                margin: const EdgeInsets.only(bottom: 12),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                child: ListTile(
                  title: Text(notizia.titulo, maxLines: 1, overflow: TextOverflow.ellipsis, 
                      style: const TextStyle(fontWeight: FontWeight.bold)),
                  subtitle: Text(notizia.contenido, maxLines: 2, overflow: TextOverflow.ellipsis),
                  trailing: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      IconButton(
                        icon: const Icon(Icons.delete, color: Colors.red),
                        onPressed: () => _confirmDelete(notizia.id, notizia.titulo),
                      ),
                    ],
                  ),
                ),
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          final result = await Navigator.push(
            context,
            MaterialPageRoute(builder: (_) => const NewsFormScreen()),
          );
          if (result == true) _refreshNews();
        },
        backgroundColor: const Color(0xFF2C5364),
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }
}
