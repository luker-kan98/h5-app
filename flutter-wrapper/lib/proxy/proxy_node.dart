class ProxyNode {
  final String name;
  final String type;
  final String server;
  final int port;
  final String cipher;
  final String password;
  final bool udp;

  const ProxyNode({
    required this.name,
    required this.type,
    required this.server,
    required this.port,
    required this.cipher,
    required this.password,
    this.udp = false,
  });

  factory ProxyNode.fromJson(Map<String, dynamic> json) {
    final type = json['type'] as String;
    if (type != 'ss') {
      throw FormatException('unsupported proxy type: $type');
    }
    final port = json['port'] as int;
    if (port < 1 || port > 65535) {
      throw FormatException('port out of range [1, 65535]: $port');
    }
    return ProxyNode(
      name: json['name'] as String,
      type: type,
      server: json['server'] as String,
      port: port,
      cipher: json['cipher'] as String,
      password: json['password'] as String,
      udp: (json['udp'] as bool?) ?? false,
    );
  }

  Map<String, dynamic> toJson() => {
        'name': name,
        'type': type,
        'server': server,
        'port': port,
        'cipher': cipher,
        'password': password,
        'udp': udp,
      };

  @override
  String toString() => 'ProxyNode($name $server:$port)';
}
