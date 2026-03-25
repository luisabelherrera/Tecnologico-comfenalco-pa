class UserProfile {
  final int id;
  final String username;
  final String email;
  final dynamic estudiante;
  final dynamic docente;
  final List<String> roles; // added roles

  UserProfile({
    required this.id,
    required this.username,
    required this.email,
    this.estudiante,
    this.docente,
    this.roles = const [],
  });

  factory UserProfile.fromJson(Map<String, dynamic> json) {
    List<String> parsedRoles = [];
    if (json['roles'] != null) {
      if (json['roles'] is List) {
        parsedRoles = (json['roles'] as List).map((r) {
          if (r is String) return r;
          if (r is Map && r.containsKey('nombre')) return r['nombre'] as String;
          if (r is Map && r.containsKey('name')) return r['name'] as String;
          return r.toString();
        }).toList();
      }
    }

    return UserProfile(
      id: json['id'] ?? 0,
      username: json['username'] ?? '',
      email: json['email'] ?? '',
      estudiante: json['estudiante'],
      docente: json['docente'],
      roles: parsedRoles,
    );
  }

  String get nombres {
    if (estudiante != null && estudiante is Map) return estudiante['nombres'] ?? '';
    if (docente != null && docente is Map) return docente['nombres'] ?? '';
    return username;
  }

  String get apellidos {
    if (estudiante != null && estudiante is Map) return estudiante['apellidos'] ?? '';
    if (docente != null && docente is Map) return docente['apellidos'] ?? '';
    return '';
  }
}

