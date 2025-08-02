import { SupportedCurrenciesCodesEnum } from "@/enums/supportedCurrenciesCodes";
import type { CurrencyRate } from "@/models/invoice";

export const DefaultCurrency = SupportedCurrenciesCodesEnum.SAR;

export const SupportedCurrencies: CurrencyRate[] = [
  { code: SupportedCurrenciesCodesEnum.SAR, name: 'Saudi Riyal', rate: 1 },
  { code: SupportedCurrenciesCodesEnum.USD, name: 'US Dollar', rate: 0.27 },
  { code: SupportedCurrenciesCodesEnum.EUR, name: 'Euro', rate: 0.25 },
  { code: SupportedCurrenciesCodesEnum.GBP, name: 'British Pound', rate: 0.21 },
  { code: SupportedCurrenciesCodesEnum.AED, name: 'UAE Dirham', rate: 0.98 },
]

// Todo: Check rates accuracy 
export const FallbackRates: Record<SupportedCurrenciesCodesEnum, Record<SupportedCurrenciesCodesEnum, number>> = {
  [SupportedCurrenciesCodesEnum.SAR]: {
    [SupportedCurrenciesCodesEnum.USD]: 0.27,
    [SupportedCurrenciesCodesEnum.EUR]: 0.25,
    [SupportedCurrenciesCodesEnum.GBP]: 0.21,
    [SupportedCurrenciesCodesEnum.AED]: 0.98,
    [SupportedCurrenciesCodesEnum.SAR]: 1.0,
  },
  [SupportedCurrenciesCodesEnum.USD]: {
    [SupportedCurrenciesCodesEnum.SAR]: 3.75,
    [SupportedCurrenciesCodesEnum.EUR]: 0.93,
    [SupportedCurrenciesCodesEnum.GBP]: 0.79,
    [SupportedCurrenciesCodesEnum.AED]: 3.67,
    [SupportedCurrenciesCodesEnum.USD]: 1.0,
  },
  [SupportedCurrenciesCodesEnum.EUR]: {
    [SupportedCurrenciesCodesEnum.SAR]: 4.32,
    [SupportedCurrenciesCodesEnum.USD]: 1.15,
    [SupportedCurrenciesCodesEnum.GBP]: 0.87,
    [SupportedCurrenciesCodesEnum.AED]: 4.11,
    [SupportedCurrenciesCodesEnum.EUR]: 1.0,
  },
  [SupportedCurrenciesCodesEnum.GBP]: {
    [SupportedCurrenciesCodesEnum.SAR]: 4.97,
    [SupportedCurrenciesCodesEnum.USD]: 1.15,
    [SupportedCurrenciesCodesEnum.EUR]: 1.15,
    [SupportedCurrenciesCodesEnum.AED]: 4.11,
    [SupportedCurrenciesCodesEnum.GBP]: 1.0,
  },
  [SupportedCurrenciesCodesEnum.AED]: {
    [SupportedCurrenciesCodesEnum.SAR]: 1.02,
    [SupportedCurrenciesCodesEnum.USD]: 0.27,
    [SupportedCurrenciesCodesEnum.EUR]: 0.25,
    [SupportedCurrenciesCodesEnum.GBP]: 0.21,
    [SupportedCurrenciesCodesEnum.AED]: 1.0,
  },
};