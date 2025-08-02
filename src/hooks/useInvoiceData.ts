import { useState, useEffect, useCallback } from 'react';
import type { Invoice, DashboardStats } from '@/models/invoice';
import { DataService } from '@/services/dataService';

export interface UseInvoiceDataReturn {
  invoices: Invoice[];
  stats: DashboardStats | null;
  loading: boolean;
  error: string | null;
  refetchData: () => Promise<void>;
}

export const useInvoiceData = (): UseInvoiceDataReturn => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const invoiceData = await DataService.loadInvoiceData();
      const calculatedStats = DataService.calculateDashboardStats(invoiceData);
      
      setInvoices(invoiceData);
      setStats(calculatedStats);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load invoice data';
      setError(errorMessage);
      console.error('Error fetching invoice data:', err);
    } finally {
      setLoading(false);
    }
  }, []);

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