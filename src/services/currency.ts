import type { ICurrencyResponse } from '@/models/invoice';
import { HttpService } from './http';
import { SupportedCurrenciesCodesEnum } from '@/enums/supportedCurrenciesCodes';
import { DefaultCurrency, FallbackRates } from './staticLookups';

export class CurrencyService {
  private static instance: CurrencyService;
  private httpService: HttpService;
  private cachedRates = new Map<string, { rates: Record<string, number>; timestamp: number }>();
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

      const { data, status } = await this.httpService.httpInstance.get<ICurrencyResponse>(`/${baseCurrency}`);

      if (status === 200 && data) {
        let rates: Record<string, number> = {};
        
        if (data.rates) {
          rates = data.rates;
        } else if ((data as unknown as Record<string, unknown>).conversion_rates) {
          rates = (data as unknown as Record<string, unknown>).conversion_rates as Record<string, number>;
        } else if (typeof data === 'object') {
          rates = data as unknown as Record<string, number>;
        }
        
        this.cachedRates.set(baseCurrency, {
          rates,
          timestamp: now,
        });
        
        return rates;
      } else {
        throw new Error(`Failed to fetch exchange rates. Status: ${status}`);
      }
    } catch (error) {
      
      return FallbackRates[baseCurrency] || FallbackRates.SAR;
    }
  }

  public convertAmount(
    amount: number, 
    toCurrency: SupportedCurrenciesCodesEnum, 
    rates: Record<string, number>
  ): number {
    const rate = rates[toCurrency];

    return rate ? amount * rate : amount;
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