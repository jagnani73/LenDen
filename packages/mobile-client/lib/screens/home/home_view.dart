import 'dart:developer';

import 'package:flutter/material.dart';
import 'package:unfold/file_exporter.dart';
import 'package:unfold/screens/loan_details/loan_details_view.dart';
import 'package:unfold/widgets/session_widget.dart';
import 'package:web3modal_flutter/services/w3m_service/w3m_service.dart';
import 'package:web3modal_flutter/web3modal_flutter.dart';

class HomeView extends StatefulWidget {
  final W3MService service;
  final Web3App web3AppInit;
  const HomeView({
    super.key,
    required this.service,
    required this.web3AppInit,
  });
  @override
  State<HomeView> createState() => _HomeViewState();
}

class _HomeViewState extends State<HomeView> {
  late IWeb3App _web3App;
  late W3MService _w3mService;

  void initState() {
    super.initState();
    _web3App = widget.web3AppInit;

    _initializeService();
  }

  void _initializeService() async {
    _w3mService = W3MService(
      web3App: widget.web3AppInit,
    );

    await _w3mService.init();

    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color.fromARGB(31, 240, 237, 237),
      body: SingleChildScrollView(
        child: SafeArea(
          child: SingleChildScrollView(
              child: Padding(
            padding: const EdgeInsets.all(20.0),
            child: Column(children: [
              20.hGap,
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text(
                    "gm, ${WalletConstants.username ?? "User"}",
                    style: GoogleFonts.poppins(
                        color: Colors.white, fontSize: 20.hWise),
                  ),
                  Container(
                      decoration: BoxDecoration(
                          color: Colors.white,
                          borderRadius: BorderRadius.circular(100)),
                      child: W3MAccountButton(service: _w3mService))
                ],
              ),
              50.hGap,
              GestureDetector(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => LoanDetailsView(
                        inputTicker: WalletConstants.chainIds.first == "Polygon"
                            ? "MATIC"
                            : "AVAX",
                        outputTicker: WalletConstants.chainIds.last == "Polygon"
                            ? "AVAX"
                            : "MATIC",
                        inputAddress: WalletConstants.walletAddresses.first,
                        outputAddress: WalletConstants.walletAddresses.last,
                      ),
                    ),
                  );
                },
                child: Container(
                  width: 400.wWise,
                  height: 200.hWise,
                  decoration: BoxDecoration(
                      color: Color(0xffDD2282),
                      borderRadius: BorderRadius.circular(20)),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      Text(
                        WalletConstants.chainIds.first,
                        style: GoogleFonts.poppins(
                            color: Colors.white,
                            fontSize: 20.hWise,
                            fontWeight: FontWeight.w500),
                      ),
                      Icon(Icons.arrow_forward_rounded, color: Colors.white),
                      Text(WalletConstants.chainIds.last,
                          style: GoogleFonts.poppins(
                              color: Colors.white,
                              fontSize: 20.hWise,
                              fontWeight: FontWeight.w500))
                    ],
                  ),
                ),
              ),
              30.hGap,
              GestureDetector(
                onTap: () {
                  Navigator.push(
                      context,
                      MaterialPageRoute(
                          builder: (context) => LoanDetailsView(
                              inputTicker:
                                  WalletConstants.chainIds.last == "Polygon"
                                      ? "MATIC"
                                      : "AVAX",
                              outputTicker:
                                  WalletConstants.chainIds.first == "Polygon"
                                      ? "AVAX"
                                      : "MATIC",
                              inputAddress: WalletConstants.chainIds.last,
                              outputAddress: WalletConstants.chainIds.first)));
                },
                child: Container(
                  width: 400.wWise,
                  height: 200.hWise,
                  decoration: BoxDecoration(
                      color: Color(0xffDD2282),
                      borderRadius: BorderRadius.circular(20)),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      Text(
                        WalletConstants.chainIds.last,
                        style: GoogleFonts.poppins(
                            color: Colors.white,
                            fontSize: 20.hWise,
                            fontWeight: FontWeight.w500),
                      ),
                      Icon(Icons.arrow_forward_rounded, color: Colors.white),
                      Text(
                        WalletConstants.chainIds.first,
                        style: GoogleFonts.poppins(
                            color: Colors.white,
                            fontSize: 20.hWise,
                            fontWeight: FontWeight.w500),
                      ),
                    ],
                  ),
                ),
              ),
              30.hGap,
              Text("Available Chains",
                      style: GoogleFonts.poppins(
                          color: Colors.white,
                          fontSize: 20.hWise,
                          fontWeight: FontWeight.w500))
                  .alignCL,
              10.hGap,
              GestureDetector(
                onTap: () {
                  log(_w3mService.address.toString());
                  log(_w3mService.selectedChain.toString());
                },
                child: Container(
                  width: 400.wWise,
                  height: 200.hWise,
                  decoration: BoxDecoration(
                      color: Color(0xff2071EE),
                      borderRadius: BorderRadius.circular(20)),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceEvenly,
                    children: [
                      Container(
                        height: 50.hWise,
                        width: 130.wWise,
                        decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(20)),
                        child: Text(
                          WalletConstants.chainIds.last,
                          style: GoogleFonts.poppins(
                              color: Colors.black,
                              fontSize: 20.hWise,
                              fontWeight: FontWeight.w500),
                        ).alignC,
                      ),
                      Container(
                        height: 50.hWise,
                        width: 130.wWise,
                        decoration: BoxDecoration(
                            color: Colors.white,
                            borderRadius: BorderRadius.circular(20)),
                        child: Text(
                          WalletConstants.chainIds.first,
                          style: GoogleFonts.poppins(
                              color: Colors.black,
                              fontSize: 20.hWise,
                              fontWeight: FontWeight.w500),
                        ).alignC,
                      ),
                    ],
                  ),
                ),
              ),
            ]),
          )),
        ),
      ),
    );
  }
}
