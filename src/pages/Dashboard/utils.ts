import type { IDashboardStats } from '@/models/invoice';
import type { IMetricCardProps } from '@/models/metricCard';
import { formatPercentage } from '@/utils/formatters';
import { AlertTriangle, DollarSign, FileText, TrendingUp } from 'lucide-react';

export const metricCardsData = (
  stats: IDashboardStats, 
  formatValue: (amount: number) => string
): IMetricCardProps[] => {
  const paymentRate = (stats.totalPaidAmount / stats.totalInvoiceAmount) * 100;

  return [
    {
      value: stats.totalInvoices,
      description: 'Total Invoices',
      icon: FileText,
      iconBgColor: 'bg-gradient-to-r from-blue-500 to-indigo-600',
      badgeColor: 'border-blue-300 bg-blue-50 text-blue-700 text-xs',
      badgeText: 'Total Invoices',
      bgGradient: 'bg-gradient-to-br from-white to-blue-50',
      accentGradient: 'bg-gradient-to-br from-blue-100 to-transparent',
      customBadges: [
        {
          text: `Paid: ${stats.paidInvoices}`,
          color: 'text-green-700',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-300'
        },
        {
          text: `Unpaid: ${(stats.totalInvoices - stats.paidInvoices)}`,
          color: 'text-red-700',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-300'
        }
      ]
    },
    {
      value: formatValue(stats.totalInvoiceAmount),
      description: 'All invoiced amounts',
      icon: DollarSign,
      iconBgColor: 'bg-gradient-to-r from-emerald-500 to-green-600',
      badgeColor: 'border-emerald-300 bg-emerald-50 text-emerald-700 text-xs',
      badgeText: 'Total Revenue',
      bgGradient: 'bg-gradient-to-br from-white to-emerald-50',
      accentGradient: 'bg-gradient-to-br from-emerald-100 to-transparent',
    },
    {
      value: formatValue(stats.totalPaidAmount),
      description: `${formatPercentage(paymentRate)} of total`,
      icon: TrendingUp,
      iconBgColor: 'bg-gradient-to-r from-green-500 to-emerald-600', 
      badgeColor: 'border-green-300 bg-green-50 text-green-700 text-xs',
      badgeText: 'Collected',
      bgGradient: 'bg-gradient-to-br from-white to-green-50',
      accentGradient: 'bg-gradient-to-br from-green-100 to-transparent',
    },
    {
      value: formatValue(stats.totalOwed),
      description: 'Pending collection',
      icon: AlertTriangle,
      iconBgColor: 'bg-gradient-to-r from-orange-500 to-amber-600',
      badgeColor: 'border-orange-300 bg-orange-50 text-orange-700 text-xs',
      badgeText: 'Outstanding',
      bgGradient: 'bg-gradient-to-br from-white to-orange-50',
      accentGradient: 'bg-gradient-to-br from-orange-100 to-transparent',
    }
  ];
};