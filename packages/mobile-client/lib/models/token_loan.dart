// ignore_for_file: public_member_api_docs, sort_constructors_first
import 'dart:convert';

class TokenLoanApiResponse {
  bool success;
  Evaluation evaluation;

  TokenLoanApiResponse({
    required this.success,
    required this.evaluation,
  });

  factory TokenLoanApiResponse.fromJson(Map<String, dynamic> json) {
    return TokenLoanApiResponse(
      success: json['success'],
      evaluation: Evaluation.fromJson(json['evaluation']),
    );
  }
}
// Evaluation({
//     required this.id,
//     required this.interest,
//     required this.exchangeRate,
//     required this.outputAmount,
//     required this.principal,
//     required this.outputTicker,
//     required this.period,
//     required this.periodUnit,
//   });

//   factory Evaluation.fromJson(Map<String, dynamic> json) {
//     return Evaluation(
//       id: json['id'],
//       interest: json['interest'],
//       exchangeRate: json['exchange_rate'],
//       outputAmount: json['output_amount'],
//       principal: json['principal'],
//       outputTicker: json['output_ticker'],
//       period: json['period'],
//       periodUnit: json['period_unit'],
//     );
//   }
// }

class Evaluation {
  String id;
  String interest;
  int exchange_rate;
  double output_amount;
  double principal;
  String outputTicker;
  int period;
  String period_unit;
  Evaluation({
    required this.id,
    required this.interest,
    required this.exchange_rate,
    required this.output_amount,
    required this.principal,
    required this.outputTicker,
    required this.period,
    required this.period_unit, 
  });


  factory Evaluation.fromJson(Map<String, dynamic> json) {
    return Evaluation(
      id: json['id'],
      interest: json['interest'],
      exchange_rate: json['exchange_rate'],
      output_amount: json['output_amount'],
      principal: json['principal'],
      outputTicker: json['output_ticker'],
      period: json['period'],
      period_unit: json['period_unit'], 
    );
  }



}
