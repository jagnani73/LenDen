import 'dart:convert';
import 'dart:developer';
import 'dart:ffi';
import 'dart:typed_data';
import 'dart:ui';
import 'package:http/http.dart';
import 'package:web3dart/web3dart.dart';

class ContractHelper {
  var apiUrl = "https://rpc-mumbai.matic.today";

  Future<void> sendTransaction() async {
    var httpClient = Client();
    var polyClient = Web3Client(apiUrl, httpClient);

    var privateKeyHex =
        "0dea9b5e04ad7e4c4e3a7378c343eb0b9cece38229d42f2b021266e230293081";

    var credentials = EthPrivateKey.fromHex(privateKeyHex);
    log(credentials.address.toString());
    var address = credentials.address;

    EtherAmount balance = await polyClient.getBalance(address);
    print(balance.toString());

    await polyClient.sendTransaction(
      credentials,
      Transaction(
        to: EthereumAddress.fromHex(
            '0xeC2265da865A947647CE6175a4a2646318f6DCEb'),
        gasPrice: EtherAmount.inWei(BigInt.one),
        maxGas: 100,
        value: EtherAmount.inWei(BigInt.one),
      ),
    );
  }
}
