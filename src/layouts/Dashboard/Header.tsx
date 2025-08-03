import React from 'react';
import { Card } from '@/components/ui/card';
import { CurrencySelector } from '../../components/CurrencySelector';
import { Calendar } from 'lucide-react';

export const Header: React.FC = () => {
  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  return (
    <Card className="border-b rounded-none shadow-sm bg-white py-0">
      <div className="flex items-center justify-between p-4">
        {/* Left side - Title and Navigation */}
        <div className="flex items-center space-x-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
            <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
              <Calendar className="w-4 h-4" />
              <span>{getCurrentDate()}</span>
            </div>
          </div>
        </div>

        {/* Right side - Currency Selector */}
        <div className="flex items-center relative z-50">
          <CurrencySelector />
        </div>
      </div>
    </Card>
  );
};