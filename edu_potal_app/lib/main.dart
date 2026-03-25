import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'services/auth_service.dart';
import 'screens/login_screen.dart';
import 'screens/role_router_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return ChangeNotifierProvider(
      create: (_) => AuthService(),
      child: MaterialApp(
        title: 'Edu Portal',
        theme: ThemeData(
          colorScheme: ColorScheme.fromSeed(seedColor: Colors.blue),
          useMaterial3: true,
        ),
        home: const InitialAuthCheckRoute(),
      ),
    );
  }
}

class InitialAuthCheckRoute extends StatefulWidget {
  const InitialAuthCheckRoute({super.key});

  @override
  State<InitialAuthCheckRoute> createState() => _InitialAuthCheckRouteState();
}

class _InitialAuthCheckRouteState extends State<InitialAuthCheckRoute> {
  final _authService = AuthService();
  bool _isLoading = true;
  bool _isLoggedIn = false;

  @override
  void initState() {
    super.initState();
    _checkLoginState();
  }

  void _checkLoginState() async {
    final isLoggedIn = await _authService.isLoggedIn();
    if (isLoggedIn) {
      await _authService.loadCurrentUser();
    }
    if (mounted) {
      setState(() {
        _isLoggedIn = isLoggedIn;
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    if (_isLoading) {
      return const Scaffold(
        body: Center(child: CircularProgressIndicator()),
      );
    }
    return _isLoggedIn ? const RoleRouterScreen() : const LoginScreen();
  }
}
