class JwtResponseDto {
  final String token;

  JwtResponseDto({required this.token});

  factory JwtResponseDto.fromJson(Map<String, dynamic> json) {
    return JwtResponseDto(
      token: json['token'] ?? json['accessToken'] ?? '',
    );
  }
}
