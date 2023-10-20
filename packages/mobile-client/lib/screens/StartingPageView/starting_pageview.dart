import 'package:flutter/material.dart';
import 'package:smooth_page_indicator/smooth_page_indicator.dart';
import 'package:unfold/file_exporter.dart';
import 'package:unfold/screens/home/home_view.dart';
import 'package:unfold/screens/login_page/login_page_view.dart';
import 'package:unfold/screens/wallet_connect/wallet_connect_view.dart';
import 'package:unfold/screens/wallet_connect_view_2.dart/wallet_connect_view2.dart';
import 'package:unfold/utils/constants.dart';

class StartingPageView extends StatefulWidget {
  const StartingPageView(
      {Key? key, required this.w3mService, required this.web3AppInit})
      : super(key: key);
  final W3MService w3mService;
  final Web3App web3AppInit;

  @override
  State<StartingPageView> createState() => _StartingPageViewState();
}

class _StartingPageViewState extends State<StartingPageView> {
  int _currentPage = 0;
  late Web3App _web3App;
  late W3MService _w3mService;
  final controller = PageController();

  @override
  void initState() {
    super.initState();
    _web3App = widget.web3AppInit;
    _w3mService = widget.w3mService;
    _initializeService();
  }

  void _initializeService() async {
    _w3mService = W3MService(
      web3App: _web3App,
    );

    await _w3mService.init();
  }

  @override
  Widget build(BuildContext context) {
    List<Widget> pages = [
      WalletConnectView(
        w3mService: _w3mService,
        web3AppInit: _web3App,
      ),
      WalletConnectView2(
          w3mService: widget.w3mService, web3AppInit: widget.web3AppInit),
      LoginPageView(
        w3mService: widget.w3mService,
        web3AppInit: widget.web3AppInit,
      ),
    ];

    return Scaffold(
      body: Column(
        children: [
          Expanded(
            child: SingleChildScrollView(
              child: Column(
                children: [
                  Container(
                    width: MediaQuery.of(context).size.width,
                    height: MediaQuery.of(context).size.height -
                        120, // Adjusted value
                    child: PageView.builder(
                      scrollDirection: Axis.horizontal,
                      // Removed the NoGlowScrollBehavior
                      controller: controller,
                      onPageChanged: (index) {
                        setState(() {
                          _currentPage =
                              index; // Ensuring the page number is updated
                        });
                      },
                      itemCount: pages.length,
                      itemBuilder: (_, i) {
                        return pages[i];
                      },
                    ),
                  ),
                  SizedBox(height: 8), // Replaced the 8.hGap
                  SmoothPageIndicator(
                    controller: controller,
                    count: pages.length,
                    effect: ExpandingDotsEffect(
                      activeDotColor: Colors.black, // Adjusted value
                      dotColor: Colors.black.withOpacity(0.5), // Adjusted value
                      dotHeight: 5, // Adjusted value
                      dotWidth: 5, // Adjusted value
                    ),
                  ),
                  SizedBox(height: 16), // Replaced the 16.hGap
                  SizedBox(
                    height: 60, // Adjusted value
                    width: 350, // Adjusted value
                    child: ElevatedButton(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.black, // Adjusted value
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(30),
                          side: BorderSide(
                            color: Colors.white, // Adjusted value
                          ),
                        ),
                      ),
                      onPressed: () {
                        if (_currentPage < pages.length - 1) {
                          // Navigating to the next page if the current page is not the last one
                          controller.nextPage(
                            duration: Duration(milliseconds: 300),
                            curve: Curves.ease,
                          );
                        } else {
                          // Navigating to the HomeView if the current page is the last one
                          Navigator.pushReplacement(
                            context,
                            MaterialPageRoute(
                              builder: (context) => HomeView(
                                web3AppInit: widget.web3AppInit,
                                service: widget.w3mService,
                              ),
                            ),
                          );
                        }
                      },
                      child: Text(
                        _currentPage < pages.length - 1 ? "NEXT" : "START",
                        style: TextStyle(
                          fontSize: 26, // Adjusted value
                          fontWeight: FontWeight.w500,
                        ),
                      ),
                    ),
                  ),
                  SizedBox(height: 20), // Replaced the 20.hGap
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
