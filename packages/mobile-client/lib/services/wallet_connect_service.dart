// import 'dart:developer';

// import 'package:unfold/file_exporter.dart';

// class WalletConnectService {
//   late final Web3App _web3App;
//   late final W3MService w3mService;
//   WalletConnectService._();

//   static final WalletConnectService _instance = WalletConnectService._();

//   static WalletConnectService get instance => _instance;

//   Future<bool> initialize() async {
//     try {
//       w3mService = W3MService(
//         projectId: '6c0866f9cef23a851c18c1cedf0c5a2d',
//         metadata: const PairingMetadata(
//           name: 'Web3Modal Flutter Example',
//           description: 'Web3Modal Flutter Example',
//           url: 'https://www.walletconnect.com/',
//           icons: ['https://walletconnect.com/walletconnect-logo.png'],
//           redirect: Redirect(
//             native: 'flutterdapp://',
//             universal: 'https://www.walletconnect.com',
//           ),
//         ),
//       );
//       await w3mService.init();
//       log('WalletConnectService initialized');
//       return true;
//     } catch (e) {
//       log('Error initializing WalletConnectService: $e');
//       return false;
//     }
//   }
// }
