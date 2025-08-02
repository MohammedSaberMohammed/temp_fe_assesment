import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useCurrency } from '@/hooks/useCurrency';


export const CurrencySelector: React.FC = () => {
  const { selectedCurrency, supportedCurrencies, changeCurrency, loading } = useCurrency();

  return (
    <div className="flex items-center gap-3">
      <label className="text-sm font-medium whitespace-nowrap">
        💱 Currency:
      </label>

      <Select
        value={selectedCurrency}
        onValueChange={changeCurrency}
      >
        <SelectTrigger className="w-40 bg-white border-gray-300 hover:border-gray-400 focus:border-blue-500">
          <SelectValue placeholder="Select currency" />
        </SelectTrigger>

        <SelectContent className="bg-white border-gray-200 shadow-lg max-h-60 overflow-auto z-[9999] min-w-[200px]">
          {supportedCurrencies.map((currency) => (
            <SelectItem 
              key={currency.code} 
              value={currency.code}
              className="hover:bg-gray-50 focus:bg-blue-50 cursor-pointer py-2"
            >
              <div className="flex items-center gap-2 w-full">
                <span className="font-mono font-semibold text-gray-900">{currency.code}</span>
                <span className="text-gray-400">•</span>
                <span className="text-gray-600 text-sm truncate">{currency.name}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {loading && (
        <LoadingSpinner size="sm" />
      )}
    </div>
  );
};