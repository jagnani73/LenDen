import 'package:flutter/material.dart';

class Constants {
  static const smallScreen = 640;

  static const String aud = 'https://walletconnect.org/login';
  static const String domain = 'walletconnect.org';

  static const String signPageTypeKey = 'signPageType';
}

class StyleConstants {
  static const Color primaryColor = Color.fromARGB(255, 16, 165, 206);
  static const Color secondaryColor = Color(0xFF1A1A1A);
  static const Color grayColor = Color.fromARGB(255, 180, 180, 180);
  static const Color titleTextColor = Color(0xFFFFFFFF);

  // Linear
  static const double linear8 = 8;
  static const double linear16 = 16;
  static const double linear24 = 24;
  static const double linear32 = 32;
  static const double linear48 = 48;
  static const double linear40 = 40;
  static const double linear56 = 56;
  static const double linear72 = 72;
  static const double linear80 = 80;

  // Magic Number
  static const double magic10 = 10;
  static const double magic14 = 14;
  static const double magic20 = 20;
  static const double magic40 = 40;
  static const double magic64 = 64;

  // Width
  static const double maxWidth = 400;

  // Text styles
  static const TextStyle titleText = TextStyle(
    color: Colors.black,
    fontSize: linear32,
    fontWeight: FontWeight.w600,
  );
  static const TextStyle subtitleText = TextStyle(
    color: Colors.black,
    fontSize: linear24,
    fontWeight: FontWeight.w600,
  );
  static const TextStyle buttonText = TextStyle(
    color: Colors.black,
    fontSize: magic14,
    fontWeight: FontWeight.w600,
  );
}

class NoGlowScrollBehavior extends ScrollBehavior {
  Widget buildViewportChrome(
      BuildContext context, Widget child, AxisDirection axisDirection) {
    return child;
  }
}

class WalletConstants {
  static const int maxLimit = 2; // Limit for wallet addresses, chains, and signatures
  static List<String> walletAddresses = [];
  static List<String> chainIds = [];
  static List<String> signatures = [];
  static String? username;
  static String? password;

  static void setAddressAndChainId(String newWalletAddress, String newChainId) {
    // Check if the wallet address or chain ID already exists and if the limit is reached
    if (!walletAddresses.contains(newWalletAddress) &&
        !chainIds.contains(newChainId) &&
        walletAddresses.length < maxLimit &&
        chainIds.length < maxLimit) {
      
      walletAddresses.add(newWalletAddress);
      chainIds.add(newChainId);
    } else {
      print('Duplicate wallet address/chain ID or limit reached.');
    }
  }

  static void setSignature(String newSignature) {
    // Check if the signature already exists and if the limit is reached
    if (!signatures.contains(newSignature) && signatures.length < maxLimit) {
      signatures.add(newSignature);
    } else {
      print('Duplicate signature or limit reached.');
    }
  }

  // Function to print the current data - for debugging purposes
  static void printData() {
    print('Wallet Addresses: $walletAddresses');
    print('Chain IDs: $chainIds');
    print('Signatures: $signatures');
  }
}
