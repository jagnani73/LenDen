import 'package:unfold/components/login_button.dart';
import 'package:unfold/components/text_field.dart';
import 'package:unfold/file_exporter.dart';
import 'package:unfold/screens/signup/signup_view.dart';

class LoginPageView extends StatefulWidget {
  const LoginPageView({super.key});

  @override
  State<LoginPageView> createState() => _LoginPageViewState();
}

class _LoginPageViewState extends State<LoginPageView> {
  final TextEditingController _usernameController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
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
              LoginButton(onTap: () {}, buttonText: "Login"),
              50.hGap,
              GestureDetector(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => SignupView()),
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
