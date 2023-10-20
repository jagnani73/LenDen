import 'dart:convert';
import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:unfold/components/login_button.dart';
import 'package:unfold/components/text_field.dart';
import 'package:unfold/file_exporter.dart';
import 'package:http/http.dart' as http;

class NFTLoanView extends StatefulWidget {
  final String inputAddress;
  final String outputAddress;
  final String inputTicker;
  final String outputTicker;
  final String type;
  const NFTLoanView(
      {super.key,
      required this.inputAddress,
      required this.outputAddress,
      required this.type,
      required this.inputTicker,
      required this.outputTicker});

  @override
  State<NFTLoanView> createState() => _NFTLoanViewState();
}

class _NFTLoanViewState extends State<NFTLoanView> {
  final TextEditingController _mintAddressController = TextEditingController();
  final TextEditingController _tokenIdController = TextEditingController();
  final TextEditingController _periodController = TextEditingController();
  bool isLoading = false; // Added a loading state

  @override
  void dispose() {
    _mintAddressController.dispose();
    _tokenIdController.dispose();
    _periodController.dispose();
    super.dispose();
  }

  Future<bool> nftloan() async {
    setState(() {
      isLoading = true;
    });

    var url = Uri.parse(
        'https://fd6e-2409-40f2-104c-48fd-24c8-427d-126-e57e.ngrok.io/api/v1/loans/evaluate');

    int startTimeEpoch = DateTime.now().millisecondsSinceEpoch;
    int period = int.parse(_periodController.text);

    Map<String, dynamic> requestBody = {
      "type": "nft",
      "input_ticker": widget.inputTicker,
      "period_unit": "weeks",
      "period": period,
      "start_time": startTimeEpoch.toString(),
      "output_ticker": widget.outputTicker,
      "input_wallet_address": widget.inputAddress,
      "output_wallet_address": widget.outputAddress,
      "username": "hs",
      "token_id": _tokenIdController.text,
      "mint_address": _mintAddressController.text,
    };
    log(startTimeEpoch.toString());

    final response = await http.post(
      url,
      body: jsonEncode(requestBody),
      headers: {'Content-Type': 'application/json'},
    );

    print(response.body);

    setState(() {
      isLoading = false; // Reset loading state
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
                        Text("NFT as Collateral",
                            style: GoogleFonts.poppins(
                              textStyle: const TextStyle(
                                color: Colors.white,
                                fontSize: 40,
                                fontWeight: FontWeight.w600,
                              ),
                            )).alignCL,
                        20.hGap,
                        Text("Enter details of your NFT",
                            style: GoogleFonts.poppins(
                              textStyle: const TextStyle(
                                color: Colors.white,
                                fontSize: 20,
                                fontWeight: FontWeight.w600,
                              ),
                            )).alignCL,
                        40.hGap,
                        MyTextField(
                                controller: _mintAddressController,
                                hintText: "Mint Address",
                                obscureText: false)
                            .alignCL,
                        30.hGap,
                        MyTextField(
                                controller: _tokenIdController,
                                hintText: "Token ID",
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
                              bool isSuccess = await nftloan();
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
