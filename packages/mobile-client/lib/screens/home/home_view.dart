import 'package:flutter/material.dart';
import 'package:unfold/widgets/session_widget.dart';
import 'package:web3modal_flutter/services/w3m_service/w3m_service.dart';
import 'package:web3modal_flutter/web3modal_flutter.dart';

class HomeView extends StatefulWidget {
  const HomeView({super.key, required this.w3mService});
  @override
  State<HomeView> createState() => _HomeViewState();
  final W3MService w3mService;
}

class _HomeViewState extends State<HomeView> {
  final List<String> namespaceAccounts = [];
  // final String account = NamespaceUtils.getAccount(
  //     namespaceAccounts[1],
  //   );
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Center(
          child: Center()
        ),
      ),
    );
  }
}
