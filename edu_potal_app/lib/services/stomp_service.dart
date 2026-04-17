import 'dart:async';
import 'dart:convert';
import 'package:stomp_dart_client/stomp_dart_client.dart';
import '../utils/api_constants.dart';
import 'dart:developer' as dev;

class StompService {
  static final StompService _instance = StompService._internal();
  factory StompService() => _instance;
  StompService._internal();

  StompClient? _client;
  final _messageController = StreamController<Map<String, dynamic>>.broadcast();
  final _privateMessageController =
      StreamController<Map<String, dynamic>>.broadcast();
  final _typingController = StreamController<Map<String, dynamic>>.broadcast();
  final _connectionController = StreamController<bool>.broadcast();

  Timer? _reconnectTimer;
  bool _isManualDisconnect = false;
  String? _lastUsername;

  Stream<Map<String, dynamic>> get messages => _messageController.stream;
  Stream<Map<String, dynamic>> get privateMessages =>
      _privateMessageController.stream;
  Stream<Map<String, dynamic>> get typingStream => _typingController.stream;
  Stream<bool> get connectionStatus => _connectionController.stream;

  bool get isConnected => _client?.connected ?? false;

  void connect(String username) {
    _lastUsername = username;
    _isManualDisconnect = false;

    // Si ya hay un cliente activo, no hacer nada o desactivar primero
    if (_client != null && _client!.isActive) return;

    final wsUrl =
        '${ApiConstants.baseUrl.replaceFirst('http', 'ws')}/chat-websocket/websocket';

    _client = StompClient(
      config: StompConfig(
        url: wsUrl,
        onConnect: (frame) => _onConnect(frame, username),
        onWebSocketError: (dynamic error) {
          dev.log('WebSocket Error: $error');
          _handleDisconnect();
        },
        onStompError: (frame) {
          dev.log('STOMP Error: ${frame.body}');
          _handleDisconnect();
        },
        onDisconnect: (frame) {
          dev.log('STOMP Disconnected');
          _handleDisconnect();
        },
      ),
    );

    _client?.activate();
  }

  void _handleDisconnect() {
    _connectionController.add(false);
    if (!_isManualDisconnect) {
      _scheduleReconnect();
    }
  }

  void _scheduleReconnect() {
    _reconnectTimer?.cancel();
    _reconnectTimer = Timer(const Duration(seconds: 5), () {
      if (!_isManualDisconnect && _lastUsername != null) {
        dev.log('Attempting to reconnect STOMP...');
        connect(_lastUsername!);
      }
    });
  }

  void _onConnect(StompFrame frame, String username) {
    _reconnectTimer?.cancel();
    _connectionController.add(true);
    dev.log('STOMP Connected as $username');

    _client?.subscribe(
      destination: '/chat/mensaje',
      callback: (frame) {
        if (frame.body != null) _messageController.add(jsonDecode(frame.body!));
      },
    );

    _client?.subscribe(
      destination: '/user/$username/queue/messages',
      callback: (frame) {
        if (frame.body != null)
          _privateMessageController.add(jsonDecode(frame.body!));
      },
    );

    _client?.subscribe(
      destination: '/chat/escribiendo',
      callback: (frame) {
        if (frame.body != null) {
          try {
            _typingController.add(jsonDecode(frame.body!));
          } catch (_) {
            // Handle legacy plain text writing notifications if any
          }
        }
      },
    );

    _client?.send(
      destination: '/app/mensaje',
      body: jsonEncode({
        'username': username,
        'texto': 'se ha unido',
        'tipo': 'NUEVO_USUARIO',
      }),
    );
  }

  void sendMessage(String from, String text, {String? to}) {
    if (isConnected) {
      final msg = {
        'username': from,
        'texto': text,
        'tipo': 'MENSAJE',
        'destinatario': to,
      };

      if (to != null) {
        _client?.send(
            destination: '/app/mensaje-privado', body: jsonEncode(msg));
      } else {
        _client?.send(destination: '/app/mensaje', body: jsonEncode(msg));
      }
    }
  }

  void sendTypingStatus(String username) {
    if (isConnected) {
      _client?.send(
        destination: '/app/escribiendo',
        body: username,
      );
    }
  }

  void disconnect() {
    _isManualDisconnect = true;
    _reconnectTimer?.cancel();
    _client?.deactivate();
    _connectionController.add(false);
  }

  void dispose() {
    disconnect();
    _messageController.close();
    _privateMessageController.close();
    _typingController.close();
    _connectionController.close();
  }
}
