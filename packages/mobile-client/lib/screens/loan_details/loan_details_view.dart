import 'package:unfold/file_exporter.dart';
import 'package:unfold/screens/loan/nft_loan_view.dart';
import 'package:unfold/screens/loan/token_loan_view.dart';

class LoanDetailsView extends StatefulWidget {
  final String inputTicker;
  final String outputTicker;
  final String inputAddress;
  final String outputAddress;
  const LoanDetailsView(
      {super.key,
      required this.inputAddress,
      required this.outputAddress,
      required this.inputTicker,
      required this.outputTicker});

  @override
  State<LoanDetailsView> createState() => _LoanDetailsViewState();
}

class _LoanDetailsViewState extends State<LoanDetailsView> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
        backgroundColor: Color.fromARGB(31, 240, 237, 237),
        body: SingleChildScrollView(
          child: Center(
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                200.hGap,
                Text("Wanna Borrow?",
                    style: GoogleFonts.poppins(
                      textStyle: TextStyle(
                        color: Colors.white,
                        fontSize: 40,
                        fontWeight: FontWeight.w600,
                      ),
                    )),
                10.hGap,
                Text(
                  "What will be your collateral ?",
                  style: GoogleFonts.poppins(
                    textStyle: TextStyle(
                      color: Colors.white,
                      fontSize: 20,
                      fontWeight: FontWeight.w600,
                    ),
                  ),
                ),
                80.hGap,
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    GestureDetector(
                      onTap: () {
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => NFTLoanView(
                                      inputTicker:
                                          WalletConstants.chainIds.first ==
                                                  "Polygon"
                                              ? "MATIC"
                                              : "AVAX",
                                      outputTicker:
                                          WalletConstants.chainIds.first ==
                                                  "Polygon"
                                              ? "AVAX"
                                              : "MATIC",
                                      inputAddress: widget.inputAddress,
                                      outputAddress: widget.outputAddress,
                                      type: "nft",
                                    )));
                      },
                      child: Container(
                        height: 80.hWise,
                        width: 150.wWise,
                        margin: const EdgeInsets.symmetric(horizontal: 12),
                        decoration: BoxDecoration(
                            color: Color(0xffDD2282),
                            borderRadius: BorderRadius.circular(8)),
                        child: const Center(
                          child: Text(
                            "NFT",
                            style: TextStyle(
                                color: Colors.white,
                                fontSize: 20,
                                fontWeight: FontWeight.bold),
                          ),
                        ),
                      ),
                    ),
                    GestureDetector(
                      onTap: () {
                        Navigator.push(
                            context,
                            MaterialPageRoute(
                                builder: (context) => TokenLoanView(
                                      inputTicker:
                                          WalletConstants.chainIds.first ==
                                                  "Polygon"
                                              ? "MATIC"
                                              : "AVAX",
                                      outputTicker:
                                          WalletConstants.chainIds.first ==
                                                  "Polygon"
                                              ? "AVAX"
                                              : "MATIC",
                                      inputAddress: widget.inputAddress,
                                      outputAddress: widget.outputAddress,
                                      type: "token",
                                    )));
                      },
                      child: Container(
                        height: 80.hWise,
                        width: 150.wWise,
                        margin: const EdgeInsets.symmetric(horizontal: 12),
                        decoration: BoxDecoration(
                            color: Color(0xffDD2282),
                            borderRadius: BorderRadius.circular(8)),
                        child: Center(
                          child: Text(
                            "Token",
                            style: const TextStyle(
                                color: Colors.white,
                                fontSize: 20,
                                fontWeight: FontWeight.bold),
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ));
  }
}
