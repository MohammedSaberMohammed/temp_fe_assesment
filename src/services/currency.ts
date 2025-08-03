import type { ICurrencyResponse } from '@/models/invoice';
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
        console.log('Using cached rates for', baseCurrency);
        return cached.rates;
      }

      console.log('Fetching exchange rates for', baseCurrency);
      const { data, status } = await this.httpService.httpInstance.get<ICurrencyResponse>(`/${baseCurrency}`);

      console.log('API Response:', { data, status });

      if (status === 200 && data) {
        // Handle different possible response structures
        let rates: Record<string, number> = {};
        
        if (data.rates) {
          rates = data.rates;
        } else if ((data as Record<string, unknown>).conversion_rates) {
          rates = (data as Record<string, unknown>).conversion_rates as Record<string, number>;
        } else if (typeof data === 'object') {
          // If data is directly the rates object
          rates = data as Record<string, number>;
        }
        
        console.log('Extracted rates:', rates);
        
        this.cachedRates.set(baseCurrency, {
          rates,
          timestamp: now,
        });
        
        return rates;
      } else {
        throw new Error(`Failed to fetch exchange rates. Status: ${status}`);
      }
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      console.log('Using fallback rates for', baseCurrency);
      
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