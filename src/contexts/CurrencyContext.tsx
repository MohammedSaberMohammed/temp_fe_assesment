import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { CurrencyService } from '../services/currencyService';
import type { CurrencyRate } from '../types/invoice.types';

export interface CurrencyContextReturn {
  selectedCurrency: string;
  exchangeRates: Record<string, number>;
  supportedCurrencies: CurrencyRate[];
  loading: boolean;
  error: string | null;
  changeCurrency: (currency: string) => void;
  convertAmount: (amount: number, fromCurrency?: string) => number;
  formatAmount: (amount: number) => string;
  refreshRates: () => Promise<void>;
}

export const CurrencyContext = createContext<CurrencyContextReturn | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
  defaultCurrency?: string;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ 
  children, 
  defaultCurrency = 'SAR' 
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const currencyService = CurrencyService.getInstance();
  const supportedCurrencies = currencyService.getSupportedCurrencies();

  const fetchExchangeRates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const rates = await currencyService.getExchangeRates('SAR');
      setExchangeRates(rates);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch exchange rates';
      setError(errorMessage);
      console.error('Error fetching exchange rates:', err);
    } finally {
      setLoading(false);
    }
  }, [currencyService]);

  const changeCurrency = useCallback((currency: string) => {
    setSelectedCurrency(currency);
  }, []);

  const convertAmount = useCallback(
    (amount: number, fromCurrency = 'SAR'): number => {
      return currencyService.convertAmount(amount, fromCurrency, selectedCurrency, exchangeRates);
    },
    [currencyService, selectedCurrency, exchangeRates]
  );

  const formatAmount = useCallback(
    (amount: number): string => {
      return currencyService.formatAmount(amount, selectedCurrency);
    },
    [currencyService, selectedCurrency]
  );

  const refreshRates = useCallback(async () => {
    await fetchExchangeRates();
  }, [fetchExchangeRates]);

  useEffect(() => {
    fetchExchangeRates();
  }, [fetchExchangeRates]);

  const value: CurrencyContextReturn = {
    selectedCurrency,
    exchangeRates,
    supportedCurrencies,
    loading,
    error,
    changeCurrency,
    convertAmount,
    formatAmount,
    refreshRates,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

