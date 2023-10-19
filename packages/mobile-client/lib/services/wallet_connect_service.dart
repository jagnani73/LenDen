import 'package:unfold/file_exporter.dart';

class WalletConnectService {
  late final Web3App _web3App;
  late final W3MService w3mService; 

  // Make the default constructor private.
  WalletConnectService._();

  // Declare a static instance of the service.
  static final WalletConnectService _instance = WalletConnectService._();

  // Public getter to access the instance of the service.
  static WalletConnectService get instance => _instance;

  // Method to initialize the service.
  Future<void> initialize() async {
    _web3App = await Web3App.createInstance(
      projectId: 'YOUR_PROJECT_ID',
      metadata: const PairingMetadata(
        name: 'Web3Modal Flutter Example',
        description: 'Web3Modal Flutter Example',
        url: 'https://www.walletconnect.com/',
        icons: ['https://walletconnect.com/walletconnect-logo.png'],
        redirect: Redirect(
          native: 'flutterdapp://',
          universal: 'https://www.walletconnect.com',
        ),
      ),
    );

    w3mService = W3MService(web3App: _web3App);  
    await w3mService.init();
  }
}
