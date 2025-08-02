import React, { createContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { CurrencyService } from '../services/currency';
import type { ICurrencyRate } from '@/models/invoice';
import { DefaultCurrency, SupportedCurrencies } from '@/services/staticLookups';
import type { SupportedCurrenciesCodesEnum } from '@/enums/supportedCurrenciesCodes';

export interface CurrencyContextReturn {
  selectedCurrency: SupportedCurrenciesCodesEnum;
  exchangeRates: Record<string, number>;
  supportedCurrencies: ICurrencyRate[];
  loading: boolean;
  error: string | null;
  changeCurrency: (currency: SupportedCurrenciesCodesEnum) => void;
  convertAmount: (amount: number, fromCurrency?: SupportedCurrenciesCodesEnum) => number;
  formatAmount: (amount: number) => string;
}

export const CurrencyContext = createContext<CurrencyContextReturn | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
  defaultCurrency?: SupportedCurrenciesCodesEnum;
}

export const CurrencyProvider: React.FC<CurrencyProviderProps> = ({ 
  children, 
  defaultCurrency = DefaultCurrency 
}) => {
  const [selectedCurrency, setSelectedCurrency] = useState(defaultCurrency);
  const [exchangeRates, setExchangeRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const currencyService = CurrencyService.getInstance();

  const fetchExchangeRates = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const rates = await currencyService.getExchangeRates(selectedCurrency);
      setExchangeRates(rates);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch exchange rates';
      setError(errorMessage);
      console.error('Error fetching exchange rates:', err);
    } finally {
      setLoading(false);
    }
  }, [currencyService, selectedCurrency]);

  const changeCurrency = useCallback((currency: SupportedCurrenciesCodesEnum) => {
    setSelectedCurrency(currency);
  }, []);

  const convertAmount = useCallback(
    (amount: number, fromCurrency = DefaultCurrency): number => {
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

  useEffect(() => {
    fetchExchangeRates();
  }, [fetchExchangeRates, selectedCurrency]);

  const value: CurrencyContextReturn = {
    selectedCurrency,
    exchangeRates,
    supportedCurrencies: SupportedCurrencies,
    loading,
    error,
    changeCurrency,
    convertAmount,
    formatAmount,
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
};

