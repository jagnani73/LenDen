import 'package:unfold/file_exporter.dart';
import 'package:unfold/screens/home/home_view.dart';
import 'package:unfold/screens/login/login_view.dart';
import 'package:unfold/screens/login_page/login_page_view.dart';
import 'package:unfold/widgets/session_widget.dart';

class WalletConnectView extends StatefulWidget {
  final W3MService w3mService;
  final Web3App web3AppInit;
  final Function onChainSelected;

  const WalletConnectView({
    Key? key,
    required this.w3mService,
    required this.web3AppInit,
    required this.onChainSelected,
  }) : super(key: key);

  @override
  State<WalletConnectView> createState() => _WalletConnectViewState();
}

class _WalletConnectViewState extends State<WalletConnectView> {
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
    Navigator.of(context).pushReplacement(MaterialPageRoute(
        builder: (context) => HomeView(
              w3mService: _w3mService,
            )));
  }

  void _onWeb3AppDisconnect(SessionDelete? args) {
    setState(() {
      _isConnected = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: LayoutBuilder(
        builder: (BuildContext context, BoxConstraints viewportConstraints) {
          return SingleChildScrollView(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                100.hGap,
                Text(
                  "Lets get Started!",
                  style: GoogleFonts.poppins(
                      color: Colors.black,
                      fontSize: 26.hWise,
                      fontWeight: FontWeight.w500),
                ),
                10.hGap,
                Text(
                  "As we are supporting multiple chains, please select the chain you want to connect with.",
                  textAlign: TextAlign.center,
                  style: GoogleFonts.poppins(
                    color: Colors.black,
                    fontSize: 20.hWise,
                    fontWeight: FontWeight.w500,
                  ),
                ),
                100.hGap,
                GestureDetector(
                  onTap: () {
                    widget.onChainSelected();
                  },
                  child: Container(
                    height: 80.hWise,
                    width: 300.wWise,
                    decoration: BoxDecoration(
                      color: const Color.fromARGB(255, 94, 66, 99)
                          .withOpacity(0.2),
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: W3MNetworkSelectButton(
                        size: BaseButtonSize.regular,
                        service: widget.w3mService),
                  ),
                ),
                20.hGap,
                50.hGap,
                Visibility(
                  visible: _isConnected,
                  child: SessionWidget(
                    session: widget.w3mService.web3App!.sessions.getAll().first,
                    web3App: widget.w3mService.web3App!,
                    launchRedirect: () {
                      widget.w3mService.launchConnectedWallet();
                    },
                  ),
                ),
                20.hGap,
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.info_outline,
                      color: Colors.black,
                    ),
                    8.wGap,
                    Text("You have to change the network on next page")
                  ],
                ),
              ],
            ).alignC,
          );
        },
      ),
    );
  }
}
