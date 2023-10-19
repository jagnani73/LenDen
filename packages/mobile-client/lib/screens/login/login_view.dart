import 'package:unfold/components/login_button.dart';
import 'package:unfold/components/text_field.dart';
import 'package:unfold/file_exporter.dart';
import 'package:unfold/screens/login_page/login_page_view.dart';

class LoginView extends StatefulWidget {
  final Function()? onTap;

  const LoginView({Key? key, this.onTap}) : super(key: key);

  @override
  State<LoginView> createState() => _LoginViewState();
}

class _LoginViewState extends State<LoginView> {
  @override
  Widget build(BuildContext context) {
    return Center(
      child: ElevatedButton(
        onPressed: () {
          Navigator.push(
            context,
            MaterialPageRoute(builder: (context) => LoginPageView()),
          );
        },
        child: Text('Login'),
      ),
    );
  }
}
