import React, { useMemo } from 'react';
import { BarChart } from './charts/BarChart';
import { MetricCard } from './MetricCard';
import { formatPercentage } from '../utils/formatters';
import { 
  TrendingUp, 
  DollarSign, 
  FileText, 
  AlertTriangle
} from 'lucide-react';
import type { DashboardStats } from '@/models/invoice';



interface EnhancedDashboardContentProps {
  stats: DashboardStats;
  formatValue: (amount: number) => string;
}

export const EnhancedDashboardContent: React.FC<EnhancedDashboardContentProps> = ({ 
  stats, 
  formatValue 
}) => {
  const chartData = useMemo(() => {
    if (!stats) return null;

    const projectData = stats.projectSummaries.map(p => ({
      name: p.projectName,
      invoiced: p.totalInvoiced,
      paid: p.totalPaid,
    })).slice(0, 8);

    const budgetData = stats.budgetCodeSummaries.map(b => ({
      name: b.budgetCode,
      invoiced: b.totalInvoiced,
      paid: b.totalPaid,
    })).slice(0, 8);

    return {
      projectData,
      budgetData,
    };
  }, [stats]);

  // Todo: Add a suitable placeholder instead of null
  if (!chartData) return null;

  const paymentRate = (stats.totalPaidAmount / stats.totalInvoiceAmount) * 100;

  return (
    <div className="space-y-8">
      {/* Dashboard Overview */}
       <div className="space-y-6">

          <div className="grid gap-6 lg:grid-cols-4">
            <MetricCard
              value={stats.totalInvoices.toLocaleString()}
              description="Total Invoices"
              icon={FileText}
              iconBgColor="bg-gradient-to-r from-blue-500 to-indigo-600"
              badgeColor="border-blue-300 bg-blue-50 text-blue-700 text-xs"
              badgeText="Total Invoices"
              bgGradient="bg-gradient-to-br from-white to-blue-50"
              accentGradient="bg-gradient-to-br from-blue-100 to-transparent"
              customBadges={[
                {
                  text: `Paid: ${stats.paidInvoices.toLocaleString()}`,
                  color: "text-green-700",
                  bgColor: "bg-green-50",
                  borderColor: "border-green-300"
                },
                {
                  text: `Unpaid: ${(stats.totalInvoices - stats.paidInvoices).toLocaleString()}`,
                  color: "text-red-700",
                  bgColor: "bg-red-50",
                  borderColor: "border-red-300"
                }
              ]}
            />

            <MetricCard
              value={formatValue(stats.totalInvoiceAmount)}
              description="All invoiced amounts"
              icon={DollarSign}
              iconBgColor="bg-gradient-to-r from-emerald-500 to-green-600"
              badgeColor="border-emerald-300 bg-emerald-50 text-emerald-700 text-xs"
              badgeText="Total Revenue"
              bgGradient="bg-gradient-to-br from-white to-emerald-50"
              accentGradient="bg-gradient-to-br from-emerald-100 to-transparent"
            />

            <MetricCard
              value={formatValue(stats.totalPaidAmount)}
              description={`${formatPercentage(paymentRate)} of total`}
              icon={TrendingUp}
              iconBgColor="bg-gradient-to-r from-green-500 to-emerald-600"
              badgeColor="border-green-300 bg-green-50 text-green-700 text-xs"
              badgeText="Collected"
              bgGradient="bg-gradient-to-br from-white to-green-50"
              accentGradient="bg-gradient-to-br from-green-100 to-transparent"
            />

            <MetricCard
              value={formatValue(stats.totalOwed)}
              description="Pending collection"
              icon={AlertTriangle}
              iconBgColor="bg-gradient-to-r from-orange-500 to-amber-600"
              badgeColor="border-orange-300 bg-orange-50 text-orange-700 text-xs"
              badgeText="Outstanding"
              bgGradient="bg-gradient-to-br from-white to-orange-50"
              accentGradient="bg-gradient-to-br from-orange-100 to-transparent"
            />
          </div>
       </div>

      {/* Detailed Analytics */}
      <div className="space-y-6">
        {/* Project Performance */}
        <BarChart
          title="🏢 Project Performance Analysis"
          data={chartData.projectData}
          formatValue={formatValue}
        />

        {/* Budget Code Analysis */}
        <BarChart
          title="📋 Budget Code Performance"
          data={chartData.budgetData}
          formatValue={formatValue}
        />
      </div>
    </div>
  );
};