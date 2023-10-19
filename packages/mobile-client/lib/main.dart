import 'package:flutter/material.dart';
import 'package:unfold/screens/splash/splash_view.dart';
import 'package:unfold/services/wallet_connect_service.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  // await WalletConnectService.instance.initialize();
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'LenDen',
      theme: ThemeData(primarySwatch: Colors.blue),
      home: SplashView(),
    );
  }
}
