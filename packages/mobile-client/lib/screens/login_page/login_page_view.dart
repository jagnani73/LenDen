import 'dart:convert';

import 'package:unfold/components/login_button.dart';
import 'package:unfold/components/text_field.dart';
import 'package:unfold/file_exporter.dart';
import 'package:unfold/screens/home/home_view.dart';
import 'package:unfold/screens/signup/signup_view.dart';
import 'package:http/http.dart' as http;

class LoginPageView extends StatefulWidget {
  final W3MService w3mService;
  final Web3App web3AppInit;

  const LoginPageView({
    super.key,
    required this.w3mService,
    required this.web3AppInit,
  });

  @override
  State<LoginPageView> createState() => _LoginPageViewState();
}

class _LoginPageViewState extends State<LoginPageView> {
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  late IWeb3App _web3App;
  late W3MService w3mService;
  bool isLoading = false;

  Future<bool> signIn() async {
    if (_usernameController.text.isEmpty || _passwordController.text.isEmpty) {
      print('Amount and period cannot be empty');
      return false;
    }

    setState(() {
      isLoading = true;
    });

    bool success = false;
    String walletToken1 = "";
    String walletToken2 = "";

    try {
      var url = Uri.parse(
          'https://6ac6-2409-40f2-104c-48fd-71e9-9608-c1a2-6ce6.ngrok.io/api/v1/loans/evaluate');

      if (WalletConstants.chainIds.first == "Polygon") {
        walletToken1 = "MATIC";
      } else if (WalletConstants.chainIds.first == "Ethereum") {
        walletToken1 = "ETH";
      } else if (WalletConstants.chainIds.first == "Avalanche") {
        walletToken1 = "AVAX";
      }

      Map<String, dynamic> requestBody = {
        "username": _usernameController.text,
        "password": _passwordController.text,
        "wallet_addresses": {
          walletToken1: {
            "wallet_addresses": WalletConstants.walletAddresses.first,
            "signature": WalletConstants.signatures.first,
          },
          walletToken2: {
            "wallet_addresses": WalletConstants.walletAddresses.last,
            "signature": WalletConstants.signatures.last,
          },
        }
      };

      final response = await http.post(
        url,
        body: jsonEncode(requestBody),
        headers: {'Content-Type': 'application/json'},
      );

      setState(() {
        isLoading = false;
      });

      if (response.statusCode == 200) {
        final responseBody = json.decode(response.body);
        TokenLoanApiResponse apiResponse =
            TokenLoanApiResponse.fromJson(responseBody);

        if (apiResponse.success) {
          // ignore: use_build_context_synchronously
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => TokenLoanApprovalView(
                  evaluation:
                      apiResponse.evaluation), // use the prefixed import here
            ),
          );
        } else {
          print('API Response Success is false');
        }
      } else {
        print('Error: ${response.statusCode}');
        print('Response Body: ${response.body}');
      }
    } catch (e) {
      print('Exception: $e');
    } finally {
      setState(() {
        isLoading = false;
      });
    }

    return success;
  }

  void initState() {
    super.initState();
    _web3App = widget.web3AppInit;

    _initializeService();
  }

  void _initializeService() async {
    w3mService = W3MService(
      web3App: widget.web3AppInit,
    );

    await w3mService.init();

    setState(() {
      var _isConnected = _web3App.sessions.getAll().isNotEmpty;
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(20.0),
        child: SingleChildScrollView(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.start,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              200.hGap,
              Text(
                "Login",
                style: GoogleFonts.poppins(
                  textStyle: const TextStyle(
                    fontSize: 40,
                    fontWeight: FontWeight.w600,
                  ),
                ),
              ),
              10.hGap,
              Text("Please sign in to continue",
                  style: GoogleFonts.poppins(
                    textStyle: const TextStyle(
                      fontSize: 20,
                      fontWeight: FontWeight.w400,
                    ),
                  )),
              20.hGap,
              MyTextField(
                controller: _usernameController,
                hintText: "Username",
                obscureText: false,
              ),
              20.hGap,
              MyTextField(
                controller: _passwordController,
                hintText: "Password",
                obscureText: true,
              ),
              20.hGap,
              LoginButton(
                  onTap: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => HomeView(
                                web3AppInit: widget.web3AppInit,
                                service: w3mService,
                              )),
                    );
                  },
                  buttonText: "Login"),
              50.hGap,
              GestureDetector(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                        builder: (context) => SignupView(
                              w3mService: widget.w3mService,
                              web3AppInit: widget.web3AppInit,
                            )),
                  );
                },
                child: Center(
                  child: Text(
                    "Don't have an account? Sign up",
                    style: GoogleFonts.poppins(
                      textStyle: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w400,
                      ),
                    ),
                  ),
                ),
              )
            ],
          ),
        ),
      ),
    );
  }
}
