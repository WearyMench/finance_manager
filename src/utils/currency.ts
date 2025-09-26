export const getCurrencySymbol = (currency: string): string => {
  switch (currency) {
    case 'USD':
      return '$';
    case 'EUR':
      return '€';
    case 'MXN':
      return '$';
    case 'COP':
      return '$';
    case 'DOP':
      return '$';
    default:
      return '$';
  }
};

export const formatCurrency = (amount: number, currency: string): string => {
  const symbol = getCurrencySymbol(currency);
  return `${symbol}${amount.toLocaleString()}`;
};

export const getCurrencyName = (currency: string): string => {
  switch (currency) {
    case 'USD':
      return 'Dólar Americano';
    case 'EUR':
      return 'Euro';
    case 'MXN':
      return 'Peso Mexicano';
    case 'COP':
      return 'Peso Colombiano';
    case 'DOP':
      return 'Peso Dominicano';
    default:
      return 'Dólar Americano';
  }
};
