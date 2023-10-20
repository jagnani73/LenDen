class Evaluation {
  String id;
  int interest;
  int exchangeRate;
  double outputAmount;
  double principal;
  String outputTicker;
  int period;
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
      outputAmount: json['output_amount'].toDouble(),
      principal: json['principal'].toDouble(),
      outputTicker: json['output_ticker'],
      period: json['period'],
      periodUnit: json['period_unit'],
    );
  }
}
