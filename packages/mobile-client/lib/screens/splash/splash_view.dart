import 'package:unfold/file_exporter.dart';
import 'package:unfold/screens/wallet_connect/wallet_connect_view.dart';
import 'package:unfold/services/wallet_connect_service.dart';

class SplashView extends StatelessWidget {
  const SplashView({super.key});

  @override
  Widget build(BuildContext context) {
    return AnimatedSplashScreen(
      splashIconSize: 200.hWise,
      splash: Padding(
        padding: EdgeInsets.only(right: 20.wWise),
        child: Text(
          "L E N D E N",
          style: GoogleFonts.outfit(
            fontSize: 26.hWise,
            fontWeight: FontWeight.w500,
          ),
        ),
      ),
      nextScreen: WalletConnectView(
        w3mService: WalletConnectService.instance.w3mService,
      ),
      splashTransition: SplashTransition.fadeTransition,
      backgroundColor: Colors.white,
      duration: 3000,
    );
  }
}
