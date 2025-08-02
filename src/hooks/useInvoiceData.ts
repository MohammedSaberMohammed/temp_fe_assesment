import { useState, useEffect, useCallback } from 'react';
import type { IInvoice, IDashboardStats } from '@/models/invoice';
import { InvoiceDataService } from '@/services/invoiceData';

export interface UseInvoiceDataReturn {
  invoices: IInvoice[];
  stats: IDashboardStats | null;
  loading: boolean;
  error: string | null;
  refetchData: () => Promise<void>;
}

export const useInvoiceData = (): UseInvoiceDataReturn => {
  const [invoices, setInvoices] = useState<IInvoice[]>([]);
  const [stats, setStats] = useState<IDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dataService] = useState(() => new InvoiceDataService());

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const invoiceData = await dataService.loadInvoiceData();
      const calculatedStats = dataService.calculateDashboardStats(invoiceData);
      
      setInvoices(invoiceData);
      setStats(calculatedStats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load invoice data';
     
      setError(errorMessage);
      console.error('Error fetching invoice data:', err);
    } finally {
      setLoading(false);
    }
  }, [dataService]);

  const refetchData = useCallback(async () => {
    await fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    invoices,
    stats,
    loading,
    error,
    refetchData,
  };
};