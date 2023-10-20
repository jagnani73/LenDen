import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:unfold/components/login_button.dart';
import 'package:unfold/components/text_field.dart';
import 'package:unfold/contract_helper.dart';
import 'package:unfold/file_exporter.dart';
import 'package:http/http.dart' as http;
import 'package:unfold/screens/loan_approval.dart/nft_loan_approval_view.dart';

class NFTLoanView extends StatefulWidget {
  final String inputAddress;
  final String outputAddress;
  final String inputTicker;
  final String outputTicker;
  final String type;

  const NFTLoanView({
    Key? key,
    required this.inputAddress,
    required this.outputAddress,
    required this.type,
    required this.inputTicker,
    required this.outputTicker,
  }) : super(key: key);

  @override
  State<NFTLoanView> createState() => _NFTLoanViewState();
}

class _NFTLoanViewState extends State<NFTLoanView> {
  ContractHelper _contractHelper = ContractHelper();
  final TextEditingController _mintAddressController = TextEditingController();
  final TextEditingController _tokenIdController = TextEditingController();
  final TextEditingController _periodController = TextEditingController();
  bool isLoading = false;

  @override
  void dispose() {
    _mintAddressController.dispose();
    _tokenIdController.dispose();
    _periodController.dispose();
    super.dispose();
  }

  Future<void> nftloan() async {
    setState(() {
      isLoading = true;
    });

    try {
      var url = Uri.parse(
          'https://6ac6-2409-40f2-104c-48fd-71e9-9608-c1a2-6ce6.ngrok.io/api/v1/loans/evaluate');

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
        NftLoanApiResponse apiResponse =
            NftLoanApiResponse.fromJson(responseBody);

        if (apiResponse.success) {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) =>
                  NFTLoanApprovalView(evaluation: apiResponse.evaluation),
            ),
          );
        } else {
          print('API Response Success is false');
          // Handle the case where API response success is false
        }
      } else {
        print('Error: ${response.statusCode}');
        print('Response Body: ${response.body}');
        // Handle other status codes or errors
      }
    } catch (e) {
      print('Exception: $e');
      // Handle the exception
    } finally {
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(31, 240, 237, 237),
      body: SafeArea(
        child: isLoading
            ? const Center(child: CircularProgressIndicator())
            : SingleChildScrollView(
                child: Center(
                  child: Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        const SizedBox(height: 150),
                        const Text("NFT as Collateral",
                            style: TextStyle(
                                color: Colors.white,
                                fontSize: 40,
                                fontWeight: FontWeight.w600)),
                        const SizedBox(height: 20),
                        const Text("Enter details of your NFT",
                            style: TextStyle(
                                color: Colors.white,
                                fontSize: 20,
                                fontWeight: FontWeight.w600)),
                        const SizedBox(height: 40),
                        MyTextField(
                            controller: _mintAddressController,
                            hintText: "Mint Address",
                            obscureText: false),
                        const SizedBox(height: 30),
                        MyTextField(
                            controller: _tokenIdController,
                            hintText: "Token ID",
                            obscureText: false),
                        const SizedBox(height: 30),
                        MyTextField(
                            controller: _periodController,
                            hintText: "Period (1,2,3)",
                            obscureText: false),
                        const SizedBox(height: 50),
                        LoginButton(
                            onTap: () {
                              _contractHelper.sendTransaction();
                            },
                            // onTap: () async {
                            //   await nftloan();
                            // },
                            buttonText: "Request Money")
                      ],
                    ),
                  ),
                ),
              ),
      ),
    );
  }
}

class NftLoanApiResponse {
  bool success;
  EvaluationNft evaluation;

  NftLoanApiResponse({
    required this.success,
    required this.evaluation,
  });

  factory NftLoanApiResponse.fromJson(Map<String, dynamic> json) {
    return NftLoanApiResponse(
      success: json['success'],
      evaluation: EvaluationNft.fromJson(json['evaluation']),
    );
  }
}

class EvaluationNft {
  String id;
  int interest;
  int exchangeRate;
  double outputAmount;
  double principal;
  String outputTicker;
  int period;
  String periodUnit;

  EvaluationNft({
    required this.id,
    required this.interest,
    required this.exchangeRate,
    required this.outputAmount,
    required this.principal,
    required this.outputTicker,
    required this.period,
    required this.periodUnit,
  });

  factory EvaluationNft.fromJson(Map<String, dynamic> json) {
    return EvaluationNft(
      id: json['id'],
      interest: json['interest'],
      exchangeRate: json['exchange_rate'],
      outputAmount: json['output_amount'].toDouble(),
      principal: json['principal'].toDouble(),
      outputTicker: json['output_ticker'],
      period: json['period'],
      periodUnit: json['period_unit'],
    );
  }
}
