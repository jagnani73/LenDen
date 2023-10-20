import 'dart:developer';

import 'package:unfold/file_exporter.dart';
import 'package:unfold/screens/login/login_view.dart';
import 'package:unfold/widgets/session_widget.dart';

class WalletConnectView2 extends StatefulWidget {
  final W3MService w3mService;
  final Web3App web3AppInit;

  const WalletConnectView2({
    Key? key,
    required this.w3mService,
    required this.web3AppInit,
  }) : super(key: key);

  @override
  State<WalletConnectView2> createState() => _WalletConnectViewState();
}

class _WalletConnectViewState extends State<WalletConnectView2> {
  bool _isConnected = false;
  late IWeb3App _web3App;
  late W3MService _w3mService;

  void initState() {
    super.initState();
    _web3App = widget.web3AppInit;
    _web3App.onSessionConnect.subscribe(_onWeb3AppConnect);
    _web3App.onSessionDelete.subscribe(_onWeb3AppDisconnect);

    _initializeService();
  }

  void _initializeService() async {
    _w3mService = W3MService(
      web3App: _web3App,
    );

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
    // If we connect, default to barebones
    setState(() {
      _isConnected = true;
    });
    Navigator.of(context)
        .pushReplacement(MaterialPageRoute(builder: (context) => LoginView()));
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
            200.hGap,
            Text(
              "Change your chain!!",
              style: GoogleFonts.poppins(
                  color: Colors.black,
                  fontSize: 20.hWise,
                  fontWeight: FontWeight.w500),
            ),
            100.hGap,
            GestureDetector(
              onTap: () {
                // WalletConstants.setaddressAndChainId(
                //     _w3mService.address!, _w3mService.selectedChain.toString());
                // log("address is ${WalletConstants.walletAddresses.toString()}");
              },
              child: Container(
                  height: 80.hWise,
                  width: 300.wWise,
                  decoration: BoxDecoration(
                    color:
                        const Color.fromARGB(255, 94, 66, 99).withOpacity(0.2),
                    borderRadius: BorderRadius.circular(20),
                  ),
                  child: W3MAccountButton(
                    service: _w3mService,
                  )),
            ),
            20.hGap,
            Visibility(
              visible: _isConnected,
              child: Visibility(
                visible: _isConnected,
                child: SessionWidget(
                  session: widget.w3mService.web3App!.sessions.getAll().first,
                  web3App: widget.w3mService.web3App!,
                  launchRedirect: () {
                    widget.w3mService.launchConnectedWallet();
                  },
                ),
              ),
            )
          ],
        ).alignC,
      ),
    );
  }
}
