export const PrettyNumber = (num: number, decimals: number = 4): string =>
  (+num.toFixed(decimals)).toLocaleString("en", {
    minimumFractionDigits: decimals,
  });
