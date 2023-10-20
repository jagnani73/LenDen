import 'dart:convert';
import 'dart:developer';

import 'package:web3dart/web3dart.dart';
import 'package:web3modal_flutter/web3modal_flutter.dart';

import 'package:unfold/models/eth/ethereum_transaction.dart';
import 'package:unfold/utils/crypto/contract.dart';
import 'package:unfold/utils/crypto/test_data.dart';
import 'package:unfold/utils/crypto/web3dart_extension.dart';

enum EIP155UIMethods {
  personalSign,
  ethSendTransaction,
}

extension EIP155MethodsX on EIP155UIMethods {
  String? get value => EIP155.methods[this];
}

extension EIP155MethodsStringX on String {
  EIP155UIMethods? toEip155Method() {
    final entries = EIP155.methods.entries.where(
      (element) => element.value == this,
    );
    return (entries.isNotEmpty) ? entries.first.key : null;
  }
}

class EIP155 {
  static const ethRequiredMethods = [
    'personal_sign',
    'eth_sendTransaction',
  ];
  static const walletSwitchEthChain = 'wallet_switchEthereumChain';
  static const walletAddEthChain = 'wallet_addEthereumChain';
  static const ethOptionalMethods = [
    walletSwitchEthChain,
    walletAddEthChain,
  ];
  static const allMethods = [
    ...ethRequiredMethods,
    ...ethOptionalMethods,
  ];
  static const ethEvents = [
    'chainChanged',
    'accountsChanged',
  ];

  static final Map<EIP155UIMethods, String> methods = {
    EIP155UIMethods.personalSign: 'personal_sign',
    EIP155UIMethods.ethSendTransaction: 'eth_sendTransaction',
    // EIP155Methods.ethSign: 'eth_sign',
    // EIP155Methods.ethSignTransaction: 'eth_signTransaction',
    // EIP155Methods.walletSwitchEthereumChain: 'wallet_switchEthereumChain',
    // EIP155Methods.walletAddEthereumChain: 'wallet_addEthereumChain'
  };

  static Future<dynamic> callMethod({
    required IWeb3App web3App,
    required String topic,
    required EIP155UIMethods method,
    required String chainId,
    required String address,
  }) {
    switch (method) {
      case EIP155UIMethods.personalSign:
        return personalSign(
          web3App: web3App,
          topic: topic,
          chainId: chainId,
          address: address,
          data: testSignData,
        );
      case EIP155UIMethods.ethSendTransaction:
        return ethSendTransaction(
          web3App: web3App,
          topic: topic,
          chainId: chainId,
          transaction: EthereumTransaction(
            from: address,
            to: "0xeC2265da865A947647CE6175a4a2646318f6DCEb",
            value: "1",
          ),
        );

      // case EIP155UIMethods.ethSign:
      //   return ethSign(
      //     web3App: web3App,
      //     topic: topic,
      //     chainId: chainId,
      //     address: address,
      //     data: testSignData,
      //   );
      // case EIP155UIMethods.ethSignTransaction:
      //   return ethSignTransaction(
      //     web3App: web3App,
      //     topic: topic,
      //     chainId: chainId,
      //     transaction: EthereumTransaction(
      //       from: address,
      //       to: address,
      //       value: '0x01',
      //     ),
      //   );
      // case EIP155UIMethods.walletAddEthereumChain:
      // case EIP155UIMethods.walletSwitchEthereumChain:
      //   return walletSwitchChain(
      //     web3App: web3App,
      //     topic: topic,
      //     chainId: chainId,
      //     chainInfo: ChainData.chains.firstWhere(
      //       (element) => element.chainId == chainId,
      //       orElse: () => ChainData.chains.first,
      //     ),
      //   );
    }
  }

  static Future<dynamic> personalSign({
    required IWeb3App web3App,
    required String topic,
    required String chainId,
    required String address,
    required String data,
  }) async {
    return await web3App.request(
      topic: topic,
      chainId: chainId,
      request: SessionRequestParams(
        method: methods[EIP155UIMethods.personalSign]!,
        params: [data, address],
      ),
    );
  }

  static Future<dynamic> ethSendTransaction({
    required IWeb3App web3App,
    required String topic,
    required String chainId,
    required EthereumTransaction transaction,
  }) async {
    return await web3App.request(
      topic: topic,
      chainId: chainId,
      request: SessionRequestParams(
        method: methods[EIP155UIMethods.ethSendTransaction]!,
        params: [transaction.toJson()],
      ),
    );
  }
  // static Future<dynamic> walletSwitchChain({
  //   required IWeb3App web3App,
  //   required String topic,
  //   required String chainId,
  //   required ChainMetadata chainInfo,
  // }) async {
  //   final int chainIdInt = int.parse(chainInfo.chainId);
  //   final String chainHex = chainIdInt.toRadixString(16);
  //   try {
  //     return await web3App.request(
  //       topic: topic,
  //       chainId: chainId,
  //       request: SessionRequestParams(
  //         method: methods[EIP155UIMethods.walletSwitchEthereumChain]!,
  //         params: [
  //           {
  //             'chainId': '0x$chainHex',
  //           },
  //         ],
  //       ),
  //     );
  //   } catch (e) {
  //     return await web3App.request(
  //       topic: topic,
  //       chainId: chainId,
  //       request: SessionRequestParams(
  //         method: 'wallet_addEthereumChain',
  //         params: [
  //           {
  //             'chainId': '0x$chainHex',
  //             'chainName': chainInfo.chainName,
  //             'nativeCurrency': {
  //               'name': chainInfo.tokenName,
  //               'symbol': chainInfo.tokenName,
  //               'decimals': 18,
  //             },
  //             'rpcUrls': [chainInfo.rpcUrl],
  //           },
  //         ],
  //       ),
  //     );
  //   }
  // }

  // static Future<dynamic> ethSign({
  //   required IWeb3App web3App,
  //   required String topic,
  //   required String chainId,
  //   required String address,
  //   required String data,
  // }) async {
  //   return await web3App.request(
  //     topic: topic,
  //     chainId: chainId,
  //     request: SessionRequestParams(
  //       method: methods[EIP155UIMethods.ethSign]!,
  //       params: [address, data],
  //     ),
  //   );
  // }

  // static Future<dynamic> ethSignTransaction({
  //   required IWeb3App web3App,
  //   required String topic,
  //   required String chainId,
  //   required EthereumTransaction transaction,
  // }) async {
  //   return await web3App.request(
  //     topic: topic,
  //     chainId: chainId,
  //     request: SessionRequestParams(
  //       method: methods[EIP155UIMethods.ethSignTransaction]!,
  //       params: [transaction.toJson()],
  //     ),
  //   );
  // }
}
