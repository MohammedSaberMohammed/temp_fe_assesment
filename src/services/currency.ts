import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import type { CurrencyResponse, CurrencyRate } from '@/models/invoice';

export class CurrencyService {
  private static instance: CurrencyService;
  private axiosInstance: AxiosInstance;
  private readonly baseUrl = 'https://api.exchangerate-api.com/v4/latest';
  private cachedRates: Map<string, { rates: Record<string, number>; timestamp: number }> = new Map();
  private readonly cacheTimeout = 300000; // 5 minutes





  
  private constructor() {
    this.axiosInstance = axios.create({
      baseURL: this.baseUrl,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    // Request interceptor for logging
    this.axiosInstance.interceptors.request.use(
      (config) => {
        console.log(`Making currency API request: ${config.url}`);
        return config;
      },
      (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
      }
    );

    // Response interceptor for error handling
    this.axiosInstance.interceptors.response.use(
      (response: AxiosResponse) => response,
      (error) => {
        console.error('Currency API error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  public static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService();
    }
    return CurrencyService.instance;
  }

  public async getExchangeRates(baseCurrency = 'SAR'): Promise<Record<string, number>> {
    try {
      // Check cache first
      const cached = this.cachedRates.get(baseCurrency);
      const now = Date.now();
      
      if (cached && (now - cached.timestamp) < this.cacheTimeout) {
        console.log('Using cached rates for', baseCurrency);
        return cached.rates;
      }

      const response = await this.axiosInstance.get<CurrencyResponse>(`/${baseCurrency}`);
      
      if (response.data.success !== false) {
        const rates = response.data.rates || {};
        
        // Cache the rates
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
      
      // Return fallback rates if API fails
      return this.getFallbackRates(baseCurrency);
    }
  }

  private getFallbackRates(baseCurrency: string): Record<string, number> {
    // Fallback static rates for development/offline mode
    const fallbackRates: Record<string, Record<string, number>> = {
      SAR: {
        USD: 0.27,
        EUR: 0.25,
        GBP: 0.21,
        AED: 0.98,
        SAR: 1.0,
      },
      USD: {
        SAR: 3.75,
        EUR: 0.93,
        GBP: 0.79,
        AED: 3.67,
        USD: 1.0,
      },
    };

    console.warn(`Using fallback rates for ${baseCurrency}`);
    return fallbackRates[baseCurrency] || fallbackRates.SAR;
  }

  public convertAmount(amount: number, fromCurrency: string, toCurrency: string, rates: Record<string, number>): number {
    if (fromCurrency === toCurrency) return amount;
    
    if (fromCurrency === 'SAR') {
      // Direct conversion from SAR to target currency
      const rate = rates[toCurrency];
      return rate ? amount * rate : amount;
    } else if (toCurrency === 'SAR') {
      // Conversion from foreign currency to SAR
      const rate = rates[fromCurrency];
      return rate ? amount / rate : amount;
    } else {
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

  public getSupportedCurrencies(): CurrencyRate[] {
    return [
      { code: 'SAR', name: 'Saudi Riyal', rate: 1 },
      { code: 'USD', name: 'US Dollar', rate: 0.27 },
      { code: 'EUR', name: 'Euro', rate: 0.25 },
      { code: 'GBP', name: 'British Pound', rate: 0.21 },
      { code: 'AED', name: 'UAE Dirham', rate: 0.98 },
    ];
  }

  public formatAmount(amount: number, currency: string): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
}