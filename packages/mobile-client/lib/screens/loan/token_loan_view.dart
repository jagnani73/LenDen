import 'dart:convert';
import 'dart:developer';

import 'package:easy_widgets/easy_widget_extensions.dart';
import 'package:flutter/material.dart';
import 'package:unfold/file_exporter.dart';
import 'package:http/http.dart' as http;

import '../../components/login_button.dart';
import '../../components/text_field.dart';

class TokenLoanView extends StatefulWidget {
  final String inputTicker;
  final String outputTicker;
  final String inputAddress;
  final String outputAddress;
  final String type;
  const TokenLoanView(
      {super.key,
      required this.inputAddress,
      required this.outputAddress,
      required this.type,
      required this.inputTicker,
      required this.outputTicker});

  @override
  State<TokenLoanView> createState() => _TokenLoanViewState();
}

class _TokenLoanViewState extends State<TokenLoanView> {
  final TextEditingController _periodController = TextEditingController();
  final TextEditingController _amountController = TextEditingController();
  bool isLoading = false; // To handle the loading state

  @override
  void dispose() {
    _amountController.dispose();
    _periodController.dispose();
    super.dispose();
  }

  Future<bool> tokenloan() async {
    setState(() {
      isLoading = true;
    });

    var url = Uri.parse(
        'https://fd6e-2409-40f2-104c-48fd-24c8-427d-126-e57e.ngrok.io/api/v1/loans/evaluate');

    int startTimeEpoch = DateTime.now().millisecondsSinceEpoch;
    int period = int.parse(_periodController.text);

    Map<String, dynamic> requestBody = {
      "type": "token",
      "input_ticker": widget.inputTicker,
      "period_unit": "weeks",
      "period": period,
      "start_time": startTimeEpoch,
      "output_ticker": widget.outputTicker,
      "input_wallet_address": widget.inputAddress,
      "output_wallet_address": widget.outputAddress,
      "username": "hs",
      "amount": _amountController.text,
    };
    log(startTimeEpoch.toString());

    final response = await http.post(
      url,
      body: jsonEncode(requestBody),
      headers: {'Content-Type': 'application/json'},
    );

    print(response.body);

    setState(() {
      isLoading = false; // Reset the loading state after API call
    });

    if (response.statusCode == 200) {
      final responseBody = json.decode(response.body);

      if (responseBody['success'] == true) {
        log(jsonEncode(responseBody));
        return true;
      } else {
        return false;
      }
    } else {
      throw Exception('Failed to load');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: const Color.fromARGB(31, 240, 237, 237),
        body: SafeArea(
          child: isLoading // Check if it is loading
              ? Center(
                  child: CircularProgressIndicator()) // Show loading indicator
              : SingleChildScrollView(
                  child: Center(
                      child: Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        150.hGap,
                        Text("Token as Collateral",
                            style: GoogleFonts.poppins(
                              textStyle: const TextStyle(
                                color: Colors.white,
                                fontSize: 40,
                                fontWeight: FontWeight.w600,
                              ),
                            )).alignCL,
                        20.hGap,
                        Text("Enter details",
                            style: GoogleFonts.poppins(
                              textStyle: const TextStyle(
                                color: Colors.white,
                                fontSize: 20,
                                fontWeight: FontWeight.w600,
                              ),
                            )).alignCL,
                        40.hGap,
                        MyTextField(
                                controller: _amountController,
                                hintText: "Amount",
                                obscureText: false)
                            .alignCL,
                        30.hGap,
                        MyTextField(
                                controller: _periodController,
                                hintText: "Period (1,2,3)",
                                obscureText: false)
                            .alignCL,
                        50.hGap,
                        LoginButton(
                            onTap: () async {
                              bool isSuccess = await tokenloan();
                              if (isSuccess) {
                                print("Loan request is successful.");
                              } else {
                                print("Loan request failed.");
                              }
                            },
                            buttonText: "Request Money")
                      ],
                    ),
                  )),
                ),
        ));
  }
}
