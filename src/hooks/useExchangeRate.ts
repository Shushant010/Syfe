
import { useState, useEffect } from 'react';
import { ExchangeRate } from '../types';

export const useExchangeRate = () => {
  const [exchangeRate, setExchangeRate] = useState<ExchangeRate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchExchangeRate = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('https://api.exchangerate-api.com/v4/latest/USD');
      if (!response.ok) {
        throw new Error('Failed to fetch exchange rate');
      }
      
      const data = await response.json();
      const rate = data.rates?.INR;
      
      if (!rate) {
        throw new Error('Invalid exchange rate data');
      }
      
      setExchangeRate({
        rate,
        lastUpdated: new Date().toLocaleString()
      });
    } catch (err) {
      console.error('Exchange rate fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch exchange rate');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExchangeRate();
  }, []);

  return { exchangeRate, loading, error, refetch: fetchExchangeRate };
};
