import 'package:unfold/file_exporter.dart';
import 'package:unfold/services/wallet_connect_service.dart';

class WalletConnectView extends StatelessWidget {
  final W3MService w3mService;

  const WalletConnectView({Key? key, required this.w3mService})
      : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Text(
            "Connect your Wallet!!",
            style: GoogleFonts.poppins(
                color: Colors.black,
                fontSize: 20.hWise,
                fontWeight: FontWeight.w500),
          ),
          W3MNetworkSelectButton(
              size: BaseButtonSize.regular, service: w3mService),
          W3MConnectWalletButton(service: w3mService),
        ],
      ).alignC,
    );
  }
}
