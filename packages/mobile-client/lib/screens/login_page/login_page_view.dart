import 'package:unfold/components/login_button.dart';
import 'package:unfold/components/text_field.dart';
import 'package:unfold/file_exporter.dart';
import 'package:unfold/screens/home/home_view.dart';
import 'package:unfold/screens/signup/signup_view.dart';

class LoginPageView extends StatefulWidget {
  final W3MService w3mService;
  final Web3App web3AppInit;

  const LoginPageView({super.key, required this.w3mService, required this.web3AppInit, });

  @override
  State<LoginPageView> createState() => _LoginPageViewState();
}

class _LoginPageViewState extends State<LoginPageView> {
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  late IWeb3App _web3App;
  late W3MService w3mService;

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
                      MaterialPageRoute(builder: (context) => HomeView(
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
                    MaterialPageRoute(builder: (context) => SignupView(
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
