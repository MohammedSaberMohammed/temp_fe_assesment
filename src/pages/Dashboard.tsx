import React from 'react';
import { useInvoiceData } from '../hooks/useInvoiceData';
import { useCurrency } from '../hooks/useCurrency';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '../utils/formatters';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedDashboardContent } from '@/components/EnhancedDashboardContent';
import { DashboardLayout } from '@/layouts/Dashboard';

export const Dashboard: React.FC = () => {
  const { stats, loading, error, refetchData } = useInvoiceData();
  
  const {
    selectedCurrency,
    convertAmount,
  } = useCurrency();

  const formatValue = (amount: number) => formatCurrency(convertAmount(amount), selectedCurrency);

  // Loading state
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

  // Error state
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

  // No data state
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
      <EnhancedDashboardContent 
        stats={stats} 
        formatValue={formatValue} 
      />
    </DashboardLayout>
  );
};