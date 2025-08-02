import type { CurrencyResponse } from '@/models/invoice';
import { HttpService } from './http';
import type { SupportedCurrenciesCodesEnum } from '@/enums/supportedCurrenciesCodes';
import { DefaultCurrency, FallbackRates } from './staticLookups';

export class CurrencyService {
  private static instance: CurrencyService;
  private httpService: HttpService;
  private cachedRates: Map<string, { rates: Record<string, number>; timestamp: number }> = new Map();
  private readonly cacheTimeout = import.meta.env.VITE_RATE_CACHE_TIMEOUT || 300000; // 5 minutes

  private constructor() {
    this.httpService = new HttpService(import.meta.env.VITE_RATE_EXCHANGE);
  }

  public static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService();
    }

    return CurrencyService.instance;
  }

  public async getExchangeRates(baseCurrency = DefaultCurrency): Promise<Record<string, number>> {
    try {
      const cached = this.cachedRates.get(baseCurrency);
      const now = Date.now();
      
      if (cached && (now - cached.timestamp) < this.cacheTimeout) {
        return cached.rates;
      }

      const { data, status } = await this.httpService.httpInstance.get<CurrencyResponse>(`/${baseCurrency}`);

      if (status === 200) {
        const rates = data.rates || {};
        
        this.cachedRates.set(baseCurrency, {
          rates,
          timestamp: now,
        });
        
        return rates;
      } else {
        throw new Error('Failed to fetch exchange rates');
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      
      return FallbackRates[baseCurrency] || FallbackRates.SAR;
    }
  }

  public convertAmount(
    amount: number, 
    fromCurrency: SupportedCurrenciesCodesEnum, 
    toCurrency: SupportedCurrenciesCodesEnum, 
    rates: Record<string, number>
  ): number {
    if (fromCurrency === toCurrency) return amount;
    
    if (fromCurrency === DefaultCurrency) {
      console.log('Direct conversion from SAR to target currency');
      // Direct conversion from SAR to target currency
      const rate = rates[toCurrency];
      return rate ? amount * rate : amount;
    } else if (toCurrency === DefaultCurrency) {
      console.log('Conversion from foreign currency to SAR');
      // Conversion from foreign currency to SAR
      const rate = rates[fromCurrency];
      return rate ? amount / rate : amount;
    } else {
      console.log('Conversion between two foreign currencies via SAR');
      // Conversion between two foreign currencies via SAR
      const fromRate = rates[fromCurrency];
      const toRate = rates[toCurrency];
      if (fromRate && toRate) {
        const sarAmount = amount / fromRate;
        return sarAmount * toRate;
      }
      return amount;
    }
  }

  public formatAmount(amount: number, currency: SupportedCurrenciesCodesEnum): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
}