import 'dart:convert';
import 'dart:developer';

import 'package:fl_toast/fl_toast.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:unfold/utils/constants.dart';

class MethodHandler {
  static Future<void> handle(
    BuildContext context,
    String method,
    Future<dynamic> response,
  ) async {
    try {
      var result = await response;
      final String resultString = jsonEncode(result);
      log(resultString);
      WalletConstants.setSignatures(resultString);
      log(WalletConstants.signatures.toString());
      // Optional: Show a toast message upon successful setting of wallet constants
      showPlatformToast(
        child: const Text(
          "Signature Done", // You can customize this message
        ),
        context: context,
      );
    } catch (e) {
      // Handle error
      print("Error occurred: $e");
    }
  }

  static void showPlatformToast(
      {required Widget child, required BuildContext context}) {
    // Implement the toast display as per your requirements
  }
}
