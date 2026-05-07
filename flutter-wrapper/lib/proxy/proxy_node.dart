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

  factory ProxyNode.fromJson(Map<String, dynamic> json) => ProxyNode(
        name: json['name'] as String,
        type: json['type'] as String,
        server: json['server'] as String,
        port: json['port'] as int,
        cipher: json['cipher'] as String,
        password: json['password'] as String,
        udp: (json['udp'] as bool?) ?? false,
      );

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
