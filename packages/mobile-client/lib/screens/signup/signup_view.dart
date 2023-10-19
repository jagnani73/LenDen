import 'package:flutter/material.dart';
import 'package:unfold/components/login_button.dart';
import 'package:unfold/components/text_field.dart';
import 'package:unfold/file_exporter.dart';
import 'package:unfold/screens/login_page/login_page_view.dart';

class SignupView extends StatefulWidget {
  const SignupView({super.key});

  @override
  State<SignupView> createState() => _SignupViewState();
}

class _SignupViewState extends State<SignupView> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        body: SingleChildScrollView(
      child: Padding(
        padding: const EdgeInsets.all(30.0),
        child: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            200.hGap,
            Text(
              "Signup",
              style: GoogleFonts.poppins(
                fontSize: 40.hWise,
                fontWeight: FontWeight.w600,
              ),
            ),
            10.hGap,
            Text("Please sign up to continue",
                style: TextStyle(
                  fontSize: 20.hWise,
                  fontWeight: FontWeight.w400,
                )),
            20.hGap,
            MyTextField(
              hintText: "Username",
              obscureText: false,
            ),
            20.hGap,
            MyTextField(
              hintText: "Password",
              obscureText: true,
            ),
            20.hGap,
            MyTextField(
              hintText: "Confirm Password",
              obscureText: true,
            ),
            20.hGap,
            LoginButton(onTap: () {}, buttonText: "Signup"),
            50.hGap,
            GestureDetector(
              onTap: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => LoginPageView()),
                );
              },
              child: Center(
                child: Text(
                  "Already have an account? Login",
                  style: TextStyle(
                    fontSize: 20,
                    fontWeight: FontWeight.w400,
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    ));
  }
}
