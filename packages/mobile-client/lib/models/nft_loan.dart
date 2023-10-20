class NftLoanApiResponse {
  bool success;
  Evaluation evaluation;

  NftLoanApiResponse({
    required this.success,
    required this.evaluation,
  });

  factory NftLoanApiResponse.fromJson(Map<String, dynamic> json) {
    return NftLoanApiResponse(
      success: json['success'],
      evaluation: Evaluation.fromJson(json['evaluation']),
    );
  }
}

class Evaluation {
  String id;
  int interest;
  int exchangeRate;
  double outputAmount;
  double principal;
  String outputTicker;
  String period;
  String periodUnit;

  Evaluation({
    required this.id,
    required this.interest,
    required this.exchangeRate,
    required this.outputAmount,
    required this.principal,
    required this.outputTicker,
    required this.period,
    required this.periodUnit,
  });

  factory Evaluation.fromJson(Map<String, dynamic> json) {
    return Evaluation(
      id: json['id'],
      interest: json['interest'],
      exchangeRate: json['exchange_rate'],
      outputAmount: json['output_amount'],
      principal: json['principal'],
      outputTicker: json['output_ticker'],
      period: json['period'],
      periodUnit: json['period_unit'],
    );
  }
}
