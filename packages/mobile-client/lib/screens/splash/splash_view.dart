import 'package:unfold/file_exporter.dart';
import 'package:unfold/models/chain_metadata.dart';
import 'package:unfold/screens/StartingPageView/starting_pageview.dart';
import 'package:unfold/screens/login/login_view.dart';
import 'package:unfold/screens/wallet_connect/wallet_connect_view.dart';
import 'package:unfold/utils/crypto/chain_data_wrapper.dart';
import 'package:unfold/utils/crypto/helper.dart';

class SplashView extends StatefulWidget {
  const SplashView({super.key});

  @override
  State<SplashView> createState() => _SplashViewState();
}

class _SplashViewState extends State<SplashView> {
  late final W3MService w3mService;
  late final Web3App _web3App;
  bool _initialized = false;

  @override
  void initState() {
    super.initState();
    _initialize();
  }

  void _initialize() async {
    _web3App = Web3App(
      core: Core(projectId: "6c0866f9cef23a851c18c1cedf0c5a2d"),
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

    _web3App!.onSessionPing.subscribe(_onSessionPing);
    _web3App!.onSessionEvent.subscribe(_onSessionEvent);

    await _web3App.init();
    await w3mService.init();

    // Loop through all the chain data

    setState(() => _initialized = true);
  }

  @override
  void dispose() {
    _web3App!.onSessionPing.unsubscribe(_onSessionPing);
    _web3App!.onSessionEvent.unsubscribe(_onSessionEvent);
    super.dispose();
  }

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
      nextScreen: StartingPageView(
        w3mService: w3mService,
        web3AppInit: _web3App,
      ),
      splashTransition: SplashTransition.fadeTransition,
      backgroundColor: Colors.white,
      duration: 3000,
    );
  }

  void _onSessionPing(SessionPing? args) => showDialog(
        context: context,
        builder: (BuildContext context) {
          return EventWidget(
            title: StringConstants.receivedPing,
            content: 'Topic: ${args!.topic}',
          );
        },
      );

  void _onSessionEvent(SessionEvent? args) => showDialog(
        context: context,
        builder: (BuildContext context) {
          return EventWidget(
            title: StringConstants.receivedEvent,
            content: 'Topic: ${args!.topic}\n'
                'Event Name: ${args.name}\n'
                'Event Data: ${args.data}',
          );
        },
      );
}
