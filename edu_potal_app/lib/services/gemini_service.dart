import 'dart:convert';
import 'package:http/http.dart' as http;
import 'dart:developer' as developer;

class GeminiService {
  static const String _apiKey =
      'AIzaSyB9HNN9nYfHK07TlZiCjMG-qVXZ2u70Rxc'; // Hardcoded temporalmente como solicitó el Frontend Original
  static const String _apiUrl =
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=$_apiKey';

  Future<String> generateResponse(String prompt) async {
    try {
      final response = await http.post(
        Uri.parse(_apiUrl),
        headers: {'Content-Type': 'application/json'},
        body: jsonEncode({
          "contents": [
            {
              "parts": [
                {"text": prompt}
              ]
            }
          ]
        }),
      );

      if (response.statusCode == 200) {
        final data = jsonDecode(response.body);
        if (data['candidates'] != null && data['candidates'].isNotEmpty) {
          final content = data['candidates'][0]['content'];
          if (content != null &&
              content['parts'] != null &&
              content['parts'].isNotEmpty) {
            return content['parts'][0]['text'] ??
                "Lo siento, no pude procesar la respuesta.";
          }
        }
        return "Respuesta vacía de Gemini.";
      } else {
        developer.log(
            "Gemini API Error: \${response.statusCode} - \${response.body}");
        return "Lo siento, hubo un error de conexión con mi cerebro artificial (\${response.statusCode}).";
      }
    } catch (e) {
      developer.log("Exception in GeminiService: \$e");
      return "Hubo un error del sistema contactando a IA: \$e";
    }
  }
}
