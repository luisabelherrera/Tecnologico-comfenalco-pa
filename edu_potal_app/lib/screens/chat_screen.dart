import 'dart:async';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../services/stomp_service.dart';
import '../services/auth_service.dart';
import '../services/api_service.dart';
import '../utils/api_constants.dart';
import 'package:intl/intl.dart';


class ChatScreen extends StatefulWidget {
  final String? recipient;
  const ChatScreen({super.key, this.recipient});

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final StompService _stompService = StompService();
  final ApiService _apiService = ApiService();
  final TextEditingController _msgController = TextEditingController();
  final ScrollController _scrollController = ScrollController();
  
  final List<StreamSubscription> _subscriptions = [];
  List<Map<String, dynamic>> _messages = [];
  bool _isConnected = false;
  String? _username;
  String? _typingUser;
  Timer? _typingTimer;

  @override
  void initState() {
    super.initState();
    _initChat();
  }

  void _initChat() async {
    final authProvider = Provider.of<AuthService>(context, listen: false);
    _username = authProvider.currentUser?.nombres ?? 'Usuario';
    
    // Conectar si no lo está (el singleton lo maneja)
    _stompService.connect(_username!);
    setState(() => _isConnected = _stompService.isConnected);

    // Subscripciones
    _subscriptions.add(_stompService.connectionStatus.listen((connected) {
      if (mounted) setState(() => _isConnected = connected);
    }));

    _subscriptions.add(_stompService.typingStream.listen((data) {
      if (mounted && data['username'] != _username) {
        // En un chat privado, solo mostramos si es el destinatario
        if (widget.recipient == null || data['username'] == widget.recipient) {
          setState(() => _typingUser = data['username']);
          _typingTimer?.cancel();
          _typingTimer = Timer(const Duration(seconds: 3), () {
            if (mounted) setState(() => _typingUser = null);
          });
        }
      }
    }));

    if (widget.recipient != null) {
      _loadPrivateHistory();
      _subscriptions.add(_stompService.privateMessages.listen((msg) {
        if (mounted && (msg['username'] == widget.recipient || msg['username'] == _username)) {
           setState(() => _messages.add(msg));
           _scrollToBottom();
        }
      }));
    } else {
      _loadGeneralHistory();
      _subscriptions.add(_stompService.messages.listen((msg) {
        if (mounted) {
          setState(() => _messages.add(msg));
          _scrollToBottom();
        }
      }));
    }
  }

  Future<void> _loadPrivateHistory() async {
    try {
      final history = await _apiService.getChatHistory(_username!, widget.recipient!);
      if (mounted) {
        setState(() => _messages = List<Map<String, dynamic>>.from(history));
        _scrollToBottom();
      }
    } catch (e) {
      print('Error loading history: $e');
    }
  }

  Future<void> _loadGeneralHistory() async {
    // Implementación en ApiService si es necesario, por ahora usamos el endpoint /historial
    // Pero el backend tiene /historial para los últimos 10
    // Usaremos un truco: si recipient es null, podemos llamar a un endpoint de historial general
    try {
      final url = Uri.parse('${ApiConstants.baseUrl}/historial');
      final token = await AuthService().getToken();
      final response = await http.get(url, headers: {'Authorization': 'Bearer $token'});
      if (response.statusCode == 200) {
        final List<dynamic> history = jsonDecode(response.body);
        if (mounted) {
          setState(() => _messages = List<Map<String, dynamic>>.from(history));
          _scrollToBottom();
        }
      }
    } catch (_) {}
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _onTyping() {
    _stompService.sendTypingStatus(_username!);
  }

  void _sendMessage() {
    if (_msgController.text.trim().isNotEmpty && _isConnected) {
      _stompService.sendMessage(_username!, _msgController.text.trim(), to: widget.recipient);
      _msgController.clear();
    }
  }

  @override
  void dispose() {
    for (var sub in _subscriptions) {
      sub.cancel();
    }
    _typingTimer?.cancel();
    _msgController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        titleSpacing: 0,
        title: Row(
          children: [
            const SizedBox(width: 8),
            Hero(
              tag: 'chat_avatar_${widget.recipient ?? 'global'}',
              child: CircleAvatar(
                radius: 18,
                backgroundColor: Colors.white24,
                child: Text(
                  widget.recipient?.isNotEmpty == true ? widget.recipient![0] : 'G',
                  style: const TextStyle(color: Colors.white, fontSize: 14),
                ),
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    widget.recipient != null ? widget.recipient! : 'Chat Institucional',
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
                    overflow: TextOverflow.ellipsis,
                  ),
                  if (_typingUser != null)
                    Text(
                      '$_typingUser está escribiendo...',
                      style: const TextStyle(fontSize: 11, color: Colors.greenAccent, fontWeight: FontWeight.w500),
                    )
                  else
                    Row(
                      children: [
                        Container(
                          width: 8,
                          height: 8,
                          decoration: BoxDecoration(
                            color: _isConnected ? Colors.greenAccent : Colors.redAccent,
                            shape: BoxShape.circle,
                          ),
                        ),
                        const SizedBox(width: 4),
                        Text(
                          _isConnected ? 'Conectado' : 'Reconectando...',
                          style: TextStyle(fontSize: 11, color: Colors.white.withOpacity(0.7)),
                        ),
                      ],
                    ),
                ],
              ),
            ),
          ],
        ),
        backgroundColor: const Color(0xFF1E3C72),
        foregroundColor: Colors.white,
        elevation: 4,
      ),
      body: Container(
        decoration: const BoxDecoration(
          image: DecorationImage(
            image: NetworkImage('https://www.transparenttextures.com/patterns/cubes.png'),
            opacity: 0.05,
            repeat: ImageRepeat.repeat,
          ),
          color: Color(0xFFE5DDD5),
        ),
        child: Column(
          children: [
            Expanded(
              child: ListView.builder(
                controller: _scrollController,
                padding: const EdgeInsets.all(16),
                itemCount: _messages.length,
                itemBuilder: (context, index) {
                  final msg = _messages[index];
                  final bool isMe = msg['username'] == _username;
                  final bool isSystem = msg['tipo'] == 'NUEVO_USUARIO';

                  if (isSystem) {
                    return _buildSystemMessage(msg);
                  }

                  return _buildMessageBubble(msg, isMe);
                },
              ),
            ),
            _buildInputArea(),
          ],
        ),
      ),
    );
  }

  Widget _buildSystemMessage(Map<String, dynamic> msg) {
    return Center(
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 12),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
        decoration: BoxDecoration(
          color: Colors.white.withOpacity(0.8),
          borderRadius: BorderRadius.circular(20),
          boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), blurRadius: 2)],
        ),
        child: Text(
          '${msg['username']} ${msg['texto']}',
          style: TextStyle(fontSize: 12, color: Colors.blueGrey[700], fontStyle: FontStyle.italic, fontWeight: FontWeight.w500),
        ),
      ),
    );
  }

  Widget _buildMessageBubble(Map<String, dynamic> msg, bool isMe) {
    String time = '';
    if (msg['fecha'] != null) {
      final dt = DateTime.fromMillisecondsSinceEpoch(msg['fecha']);
      time = DateFormat('HH:mm').format(dt);
    }

    return Align(
      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
      child: Container(
        margin: const EdgeInsets.symmetric(vertical: 4),
        child: Column(
          crossAxisAlignment: isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
          children: [
            if (!isMe && widget.recipient == null)
              Padding(
                padding: const EdgeInsets.only(left: 12, bottom: 2),
                child: Text(
                  msg['username'] ?? '...',
                  style: TextStyle(fontSize: 11, color: Colors.blueGrey[600], fontWeight: FontWeight.bold),
                ),
              ),
            Container(
              constraints: BoxConstraints(maxWidth: MediaQuery.of(context).size.width * 0.75),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
              decoration: BoxDecoration(
                color: isMe ? const Color(0xFFDCF8C6) : Colors.white,
                borderRadius: BorderRadius.only(
                  topLeft: const Radius.circular(12),
                  topRight: const Radius.circular(12),
                  bottomLeft: isMe ? const Radius.circular(12) : Radius.zero,
                  bottomRight: isMe ? Radius.zero : const Radius.circular(12),
                ),
                boxShadow: [
                  BoxShadow(color: Colors.black.withOpacity(0.06), blurRadius: 2, offset: const Offset(0, 1)),
                ],
              ),
              child: Stack(
                children: [
                  Padding(
                    padding: const EdgeInsets.only(bottom: 4, right: 30),
                    child: Text(
                      msg['texto'] ?? '',
                      style: const TextStyle(color: Colors.black87, fontSize: 15),
                    ),
                  ),
                  Positioned(
                    bottom: -2,
                    right: -2,
                    child: Text(
                      time,
                      style: TextStyle(color: Colors.black45, fontSize: 10),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInputArea() {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
      decoration: BoxDecoration(
        color: Colors.white,
        boxShadow: [BoxShadow(color: Colors.black.withOpacity(0.05), offset: const Offset(0, -1), blurRadius: 5)],
      ),
      child: SafeArea(
        child: Row(
          children: [
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  color: const Color(0xFFF0F2F5),
                  borderRadius: BorderRadius.circular(24),
                ),
                child: TextField(
                  controller: _msgController,
                  maxLines: null,
                  onChanged: (val) {
                    if (val.isNotEmpty) _onTyping();
                  },
                  decoration: const InputDecoration(
                    hintText: 'Escribe un mensaje...',
                    contentPadding: EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                    border: InputBorder.none,
                  ),
                  onSubmitted: (_) => _sendMessage(),
                ),
              ),
            ),
            const SizedBox(width: 8),
            GestureDetector(
              onTap: _sendMessage,
              child: const CircleAvatar(
                radius: 22,
                backgroundColor: Color(0xFF075E54),
                child: Icon(Icons.send, color: Colors.white, size: 22),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
