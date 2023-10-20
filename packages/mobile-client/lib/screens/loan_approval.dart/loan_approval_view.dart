import 'package:flutter/material.dart';
import 'package:unfold/file_exporter.dart';

class LoanApprovalView extends StatefulWidget {
  const LoanApprovalView({super.key});

  @override
  State<LoanApprovalView> createState() => _LoanApprovalViewState();
}

class _LoanApprovalViewState extends State<LoanApprovalView> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color.fromARGB(31, 240, 237, 237),
      body: SafeArea(
          child: SingleChildScrollView(
        child: Column(children: [
          Text(
            "Loan Details",
            style: GoogleFonts.poppins(fontSize: 30.hWise, color: Colors.white),
          ),
          10.hGap,
          Container(
            width: 400.wWise,
            height: 100.hWise,
            decoration: BoxDecoration(
                color: Color(0xffDD2282),
                borderRadius: BorderRadius.circular(20)),
            child: Row(
              children: [
                Text("Interest:",
                style: GoogleFonts.poppins(
                  
                ),
                ),
              ],
            ),
          )
        ]),
      )),
    );
  }
}
