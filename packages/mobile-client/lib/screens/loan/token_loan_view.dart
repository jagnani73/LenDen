import 'dart:convert';
import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:unfold/screens/loan_approval.dart/token_loan_approval_view.dart'
    as token_loan;
import 'package:unfold/screens/loan_approval.dart/token_loan_approval_view.dart';

class TokenLoanView extends StatefulWidget {
  final String inputTicker;
  final String outputTicker;
  final String inputAddress;
  final String outputAddress;
  final String type;

  const TokenLoanView({
    Key? key,
    required this.inputAddress,
    required this.outputAddress,
    required this.type,
    required this.inputTicker,
    required this.outputTicker,
  }) : super(key: key);

  @override
  State<TokenLoanView> createState() => _TokenLoanViewState();
}

class _TokenLoanViewState extends State<TokenLoanView> {
  final TextEditingController _periodController = TextEditingController();
  final TextEditingController _amountController = TextEditingController();
  bool isLoading = false;

  @override
  void dispose() {
    _amountController.dispose();
    _periodController.dispose();
    super.dispose();
  }

  Future<bool> tokenloan() async {
    if (_amountController.text.isEmpty || _periodController.text.isEmpty) {
      print('Amount and period cannot be empty');
      return false;
    }

    setState(() {
      isLoading = true;
    });

    bool success = false;

    try {
      var url = Uri.parse(
          'https://6ac6-2409-40f2-104c-48fd-71e9-9608-c1a2-6ce6.ngrok.io/api/v1/loans/evaluate');

      int startTimeEpoch = DateTime.now().millisecondsSinceEpoch;
      int period = int.tryParse(_periodController.text) ?? 0;
      int amount = int.tryParse(_amountController.text) ?? 0;

      Map<String, dynamic> requestBody = {
        "type": "token",
        "input_ticker": widget.inputTicker,
        "period_unit": "weeks",
        "period": period,
        "start_time": startTimeEpoch.toString(),
        "output_ticker": widget.outputTicker,
        "input_wallet_address": widget.inputAddress,
        "output_wallet_address": widget.outputAddress,
        "username": "hs",
        "input_amount": amount,
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
                  evaluation: apiResponse.evaluation),  // use the prefixed import here
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor:
          Colors.grey[200], // Adjust the color according to your needs
      body: SafeArea(
        child: isLoading
            ? Center(child: CircularProgressIndicator())
            : SingleChildScrollView(
                child: Center(
                  child: Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      crossAxisAlignment: CrossAxisAlignment.center,
                      children: [
                        SizedBox(height: 150),
                        Text(
                          "Token as Collateral",
                          style: TextStyle(
                            color: Colors
                                .black, // Adjust the color according to your needs
                            fontSize: 40,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        SizedBox(height: 20),
                        Text(
                          "Enter details",
                          style: TextStyle(
                            color: Colors
                                .black, // Adjust the color according to your needs
                            fontSize: 20,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        SizedBox(height: 40),
                        TextField(
                          controller: _amountController,
                          decoration: InputDecoration(hintText: "Amount"),
                        ),
                        SizedBox(height: 30),
                        TextField(
                          controller: _periodController,
                          decoration:
                              InputDecoration(hintText: "Period (1,2,3)"),
                        ),
                        SizedBox(height: 50),
                        ElevatedButton(
                          onPressed: () async {
                            bool isSuccess = await tokenloan();
                            if (isSuccess) {
                              print("Loan request is successful.");
                            } else {
                              print("Loan request failed.");
                            }
                          },
                          child: Text("Request Money"),
                        )
                      ],
                    ),
                  ),
                ),
              ),
      ),
    );
  }
}

class TokenLoanApiResponse {
  bool success;
  EvaluationToken evaluation;

  TokenLoanApiResponse({
    required this.success,
    required this.evaluation,
  });

  factory TokenLoanApiResponse.fromJson(Map<String, dynamic> json) {
    return TokenLoanApiResponse(
      success: json['success'],
      evaluation: EvaluationToken.fromJson(json['evaluation']),
    );
  }
}

class EvaluationToken {
  String id;
  int interest;
  int exchangeRate;
  double outputAmount;
  double principal;
  String outputTicker;
  int period;
  String periodUnit;

  EvaluationToken({
    required this.id,
    required this.interest,
    required this.exchangeRate,
    required this.outputAmount,
    required this.principal,
    required this.outputTicker,
    required this.period,
    required this.periodUnit,
  });

  factory EvaluationToken.fromJson(Map<String, dynamic> json) {
    return EvaluationToken(
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
