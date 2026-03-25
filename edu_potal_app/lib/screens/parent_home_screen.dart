import 'package:flutter/material.dart';
import '../services/auth_service.dart';
import 'login_screen.dart';
import 'news_screen.dart';
import 'parent_students_screen.dart';
import 'ai_assistant_screen.dart';
import 'chat_list_screen.dart';

class ParentHomeScreen extends StatefulWidget {
  const ParentHomeScreen({super.key});

  @override
  State<ParentHomeScreen> createState() => _ParentHomeScreenState();
}

class _ParentHomeScreenState extends State<ParentHomeScreen> with SingleTickerProviderStateMixin {
  final _authService = AuthService();
  late AnimationController _animController;

  @override
  void initState() {
    super.initState();
    _animController = AnimationController(vsync: this, duration: const Duration(milliseconds: 800));
    _animController.forward();
  }

  @override
  void dispose() {
    _animController.dispose();
    super.dispose();
  }

  void _logout() async {
    await _authService.logout();
    if (mounted) {
      Navigator.pushReplacement(
        context,
        PageRouteBuilder(
          pageBuilder: (_, __, ___) => const LoginScreen(),
          transitionsBuilder: (_, anim, __, child) => FadeTransition(opacity: anim, child: child),
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBodyBehindAppBar: true,
      appBar: AppBar(
        title: const Text('Portal Acudiente', style: TextStyle(fontWeight: FontWeight.bold)),
        backgroundColor: Colors.transparent,
        elevation: 0,
        actions: [
          IconButton(icon: const Icon(Icons.logout), onPressed: _logout, tooltip: 'Cerrar Sesión'),
        ],
      ),
      body: Container(
        decoration: BoxDecoration(
          gradient: LinearGradient(
            colors: [Colors.teal.shade800, Colors.tealAccent.shade700],
            begin: Alignment.bottomLeft,
            end: Alignment.topRight,
          ),
        ),
        child: SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const SizedBox(height: 20),
                Hero(
                  tag: 'avatar_parent',
                  child: CircleAvatar(
                    radius: 40,
                    backgroundColor: Colors.white.withOpacity(0.2),
                    child: const Icon(Icons.family_restroom, size: 50, color: Colors.white),
                  ),
                ),
                const SizedBox(height: 16),
                const Text('¡Hola, Acudiente!', style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Colors.white)),
                Text('Sigue de cerca el desarrollo escolar', style: TextStyle(fontSize: 18, color: Colors.white.withOpacity(0.9))),
                const SizedBox(height: 40),
                Expanded(
                  child: ListView(
                    physics: const BouncingScrollPhysics(),
                    children: [
                      _buildAnimatedMenuCard(Icons.face, 'Mis Acudidos', Colors.limeAccent, () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ParentStudentsScreen()))),
                      _buildAnimatedMenuCard(Icons.article, 'Noticias Escolares', Colors.white, () => Navigator.push(context, MaterialPageRoute(builder: (_) => const NewsScreen()))),
                      _buildAnimatedMenuCard(Icons.chat_bubble, 'Chat Institucional', Colors.orangeAccent, () => Navigator.push(context, MaterialPageRoute(builder: (_) => const ChatListScreen()))),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () => Navigator.push(context, MaterialPageRoute(builder: (_) => const AiAssistantScreen())),
        backgroundColor: Colors.deepPurple,
        child: const Icon(Icons.auto_awesome, color: Colors.white),
      ),
    );
  }

  Widget _buildAnimatedMenuCard(IconData icon, String title, Color accentColor, VoidCallback onTap) {
    return TweenAnimationBuilder<double>(
      tween: Tween(begin: 0.0, end: 1.0),
      duration: const Duration(milliseconds: 600),
      curve: Curves.easeOutCubic,
      builder: (context, value, child) {
        return Transform.translate(
          offset: Offset(0, 50 * (1 - value)),
          child: Opacity(opacity: value, child: child),
        );
      },
      child: Container(
        margin: const EdgeInsets.only(bottom: 16),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.15),
          borderRadius: BorderRadius.circular(20),
          border: Border.all(color: Colors.white.withOpacity(0.2)),
        ),
        child: Material(
          color: Colors.transparent,
          child: InkWell(
            borderRadius: BorderRadius.circular(20),
            onTap: onTap,
            splashColor: accentColor.withOpacity(0.3),
            child: Padding(
              padding: const EdgeInsets.all(20.0),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(color: accentColor.withOpacity(0.2), shape: BoxShape.circle),
                    child: Icon(icon, color: accentColor, size: 30),
                  ),
                  const SizedBox(width: 20),
                  Expanded(child: Text(title, style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white))),
                  const Icon(Icons.arrow_forward_ios, color: Colors.white54),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
