

export const convertCurrency = (
  amount: number,
  fromCurrency: 'INR' | 'USD',
  toCurrency: 'INR' | 'USD',
  exchangeRate: number
): number => {
  if (fromCurrency === toCurrency) return amount;
  
  if (fromCurrency === 'USD' && toCurrency === 'INR') {
    return amount * exchangeRate;
  } else if (fromCurrency === 'INR' && toCurrency === 'USD') {
    return amount / exchangeRate;
  }
  
  return amount;
};

export const formatCurrency = (amount: number, currency: 'INR' | 'USD'): string => {
  if (currency === 'INR') {
    return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  } else {
    return `$${amount.toLocaleString('en-US', { maximumFractionDigits: 2 })}`;
  }
};
