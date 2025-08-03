import React, { useMemo } from 'react';
import { useInvoiceData } from '@/hooks/useInvoiceData';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { BarChart } from '@/components/charts/BarChart';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardLayout } from '@/layouts/Dashboard';
import { MetricCard } from '@/components/MetricCard';
import { metricCardsData } from './utils';
import { useCurrency } from '@/hooks/useCurrency';
import { formatCurrency } from '@/utils/formatters';

export const Dashboard: React.FC = () => {
  const { stats, loading, error, refetchData } = useInvoiceData();

  const {
    selectedCurrency,
    convertAmount,
  } = useCurrency();

  const formatValue = (amount: number) => formatCurrency(convertAmount(amount), selectedCurrency);


  const chartData = useMemo(() => {
    if (!stats) return null;

    const projectData = stats.projectSummaries.map(p => ({
      name: p.projectName,
      invoiced: convertAmount(p.totalInvoiced),
      paid: convertAmount(p.totalPaid),
    })).slice(0, 8);

    const budgetData = stats.budgetCodeSummaries.map(b => ({
      name: b.budgetCode,
      invoiced: convertAmount(b.totalInvoiced),
      paid: convertAmount(b.totalPaid),
    })).slice(0, 8);

    return {
      projectData,
      budgetData,
    };
  }, [stats, convertAmount]);
  
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8">
          <CardContent className="flex flex-col items-center space-y-4">
            <LoadingSpinner size="lg" />
            <div className="text-center">
              <CardTitle className="mb-2">Loading Dashboard</CardTitle>
              <p className="text-muted-foreground">
                Fetching invoice data and preparing analytics...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Dashboard</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>
                {error}
              </AlertDescription>
            </Alert>
            <Button onClick={refetchData} className="w-full">
              🔄 Retry Loading Data
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 max-w-md">
          <CardHeader>
            <CardTitle>No Data Available</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              No invoice data found. Please check your data source and try again.
            </p>
            <Button onClick={refetchData} className="w-full">
              🔄 Refresh Data
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="grid gap-6 lg:grid-cols-4">
          {metricCardsData(stats, formatValue).map((card, index) => (
            <MetricCard
              key={`card_${index + 1}`}
              value={card.value}
              description={card.description}
              icon={card.icon}
              iconBgColor={card.iconBgColor}
              badgeColor={card.badgeColor}
              badgeText={card.badgeText}
              bgGradient={card.bgGradient}
              accentGradient={card.accentGradient}
              customBadges={card.customBadges}
            />
          ))}
        </div>

        {chartData && (
          <div className="space-y-6">
            <BarChart
              title="🏢 Project Performance Analysis"
              data={chartData.projectData}
              formatValue={formatValue}
            />

            <BarChart
              title="📋 Budget Code Performance"
              data={chartData.budgetData}
              formatValue={formatValue}
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};