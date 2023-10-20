import 'package:unfold/file_exporter.dart';
import 'package:unfold/widgets/session_widget.dart';

class WalletConnectView extends StatefulWidget {
  final W3MService w3mService;
  final Web3App web3AppInit;

  const WalletConnectView({
    Key? key,
    required this.w3mService,
    required this.web3AppInit,
  }) : super(key: key);

  @override
  State<WalletConnectView> createState() => _WalletConnectViewState();
}

class _WalletConnectViewState extends State<WalletConnectView> {
  late Web3App _web3App;
  late W3MService _w3mService;
  bool _isConnected = false;

  @override
  void initState() {
    super.initState();
    _web3App = widget.web3AppInit;
    _web3App.onSessionConnect.subscribe(_onWeb3AppConnect);
    _web3App.onSessionDelete.subscribe(_onWeb3AppDisconnect);

    _initializeService();
  }

  void _initializeService() async {
    _w3mService = widget.w3mService;

    await _w3mService.init();

    setState(() {
      _isConnected = _web3App.sessions.getAll().isNotEmpty;
    });
  }

  @override
  void dispose() {
    _web3App.onSessionConnect.unsubscribe(_onWeb3AppConnect);
    _web3App.onSessionDelete.unsubscribe(_onWeb3AppDisconnect);
    super.dispose();
  }

  void _onWeb3AppConnect(SessionConnect? args) {
    setState(() {
      _isConnected = true;
    });
  }

  void _onWeb3AppDisconnect(SessionDelete? args) {
    setState(() {
      _isConnected = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            const SizedBox(
                height:
                    100), // Replaced with the SizedBox for better readability
            Text(
              "Lets get Started!",
              style: GoogleFonts.poppins(
                  color: Colors.black,
                  fontSize: 26, // Removed .hWise for simplicity
                  fontWeight: FontWeight.w500),
            ),
            const SizedBox(
                height:
                    10), // Replaced with the SizedBox for better readability
            Text(
              "As we are supporting multiple chains, please select the chain you want to connect with.",
              textAlign: TextAlign.center,
              style: GoogleFonts.poppins(
                color: Colors.black,
                fontSize: 20, // Removed .hWise for simplicity
                fontWeight: FontWeight.w500,
              ),
            ),
            const SizedBox(
                height:
                    100), // Replaced with the SizedBox for better readability
            GestureDetector(
              child: Container(
                height: 80, // Removed .hWise for simplicity
                width: 300, // Removed .wWise for simplicity
                decoration: BoxDecoration(
                  color: const Color.fromARGB(255, 94, 66, 99).withOpacity(0.2),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: W3MNetworkSelectButton(
                    size: BaseButtonSize.regular, service: widget.w3mService),
              ),
            ),
            const SizedBox(
                height:
                    20), // Replaced with the SizedBox for better readability
            SizedBox(
                height: 80, // Removed .hWise for simplicity
                width: 300, // Removed .wWise for simplicity
                child: W3MConnectWalletButton(service: widget.w3mService)),
            const SizedBox(
                height:
                    50), // Replaced with the SizedBox for better readability
            Visibility(
              visible: _isConnected,
              child: _w3mService.web3App!.sessions.getAll().isNotEmpty
                  ? SessionWidget(
                      session: _w3mService.web3App!.sessions.getAll().first,
                      web3App: _w3mService.web3App!,
                      launchRedirect: () {
                        
                        _w3mService.launchConnectedWallet();
                      },
                    )
                  : Container(), // Adding an empty Container when the session list is empty
            ),

            const SizedBox(
                height:
                    20), // Replaced with the SizedBox for better readability
            const Row(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Icon(
                  Icons.info_outline,
                  color: Colors.black,
                ),
                SizedBox(
                    width:
                        8), // Replaced with the SizedBox for better readability
                Text("You have to change the network on next page")
              ],
            ),
          ],
        ),
      ),
    );
  }
}
