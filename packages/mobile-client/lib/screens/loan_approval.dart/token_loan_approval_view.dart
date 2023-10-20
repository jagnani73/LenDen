import 'package:flutter/material.dart';
import 'package:unfold/file_exporter.dart'; // Import your file exporter
import 'package:google_fonts/google_fonts.dart';
import 'package:unfold/screens/loan/nft_loan_view.dart';
import 'package:unfold/screens/loan/token_loan_view.dart'; // Make sure to add this package to your pubspec.yaml file

class TokenLoanApprovalView extends StatefulWidget {
  final EvaluationToken evaluation;

  const TokenLoanApprovalView({Key? key, required this.evaluation})
      : super(key: key);

  @override
  State<TokenLoanApprovalView> createState() => _TokenLoanApprovalView();
}

class _TokenLoanApprovalView extends State<TokenLoanApprovalView> {
  void onPressedApprove() {}

  @override
  void initState() {
    super.initState();

    if (widget.evaluation == null) {
      // Handle the case when evaluation is null, for example, navigate back, show an error, etc.
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(31, 240, 237, 237),
      body: SafeArea(
        child: SingleChildScrollView(
          child: Column(children: [
            SizedBox(height: 20), // Added some space at the top
            Text(
              "Loan Details",
              style: GoogleFonts.poppins(
                  fontSize: 30, color: Colors.white), // Adjusted the font size
            ),
            SizedBox(height: 10), // Added for spacing
            detailContainer("Interest", widget.evaluation.interest.toString()),
            detailContainer(
                "Exchange Rate", widget.evaluation.exchangeRate.toString()),
            detailContainer(
                "Output Amount", widget.evaluation.outputAmount.toString()),
            detailContainer("ID", widget.evaluation.id.toString()),
            // Add more details as needed
          ]),
        ),
      ),
    );
  }

  // A helper widget to create detail containers
  Widget detailContainer(String title, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 5.0), // Added for spacing
      child: Container(
        width:
            400, // Removed wWise for simplicity; add it back as per your need
        height:
            100, // Removed hWise for simplicity; add it back as per your need
        decoration: BoxDecoration(
          color: Colors.lightBlueAccent,
          borderRadius: BorderRadius.circular(20),
        ),
        child: Padding(
          padding: const EdgeInsets.all(8.0), // Added for inner spacing
          child: Row(
            children: [
              Text(
                "$title: ",
                style: GoogleFonts.poppins(color: Colors.white),
              ),
              Text(
                value,
                style: GoogleFonts.poppins(color: Colors.white),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
