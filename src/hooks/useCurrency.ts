import { CurrencyContext, type CurrencyContextReturn } from '@/contexts/CurrencyContext';
import { useContext } from 'react';

export const useCurrency = (): CurrencyContextReturn => {
  const context = useContext(CurrencyContext);

  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }

  return context;
}; 