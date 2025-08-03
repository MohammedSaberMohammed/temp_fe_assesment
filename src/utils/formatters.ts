export const formatCurrency = (amount: number, currency = 'SAR'): string => {
  // Format large numbers with K, M, B abbreviations
  const formatLargeNumber = (num: number): string => {
    if (num >= 1000000000) {
      return (num / 1000000000).toFixed(1) + 'B';
    } else if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    } else {
      return num.toFixed(0);
    }
  };

  const formattedNumber = formatLargeNumber(Math.abs(amount));
  
  // Currency symbols
  const currencySymbols: Record<string, string> = {
    SAR: 'SAR',
    USD: '$',
    EUR: '€',
    GBP: '£',
    AED: 'AED'
  };

  const symbol = currencySymbols[currency] || currency;
  return `${symbol} ${formattedNumber}`;
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};