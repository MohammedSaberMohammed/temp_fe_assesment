import React from 'react';
import { Badge } from '@/components/ui/badge';
import { useCurrency } from '@/hooks/useCurrency';

export const Sidebar: React.FC = () => {
  const { selectedCurrency } = useCurrency();

  return (
    <div className="flex flex-col h-full w-full lg:w-72 bg-white border-0 lg:border-r shadow-none lg:shadow-sm rounded-none lg:rounded-lg drawer-content">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
            {selectedCurrency}
          </div>
          <div className="min-w-0 flex-1">
            <h2 className="text-lg lg:text-xl font-bold text-gray-900 truncate">InvoiceHub</h2>
            <p className="text-xs lg:text-sm text-gray-600 truncate">Financial Analytics</p>
          </div>
        </div>
      </div>
      
      {/* Todo: To be dynamic */}
      <div className="flex-1 p-3 lg:p-4 space-y-4 lg:space-y-6 overflow-y-auto">
        <div className="p-3 lg:p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg transition-all duration-200 hover:shadow-md">
          <div className="text-center space-y-1 lg:space-y-2">
            <div className="text-xl lg:text-2xl font-bold text-green-700">94.2%</div>
            <div className="text-xs lg:text-sm text-green-600">Collection Rate</div>
            <Badge variant="secondary" className="bg-green-100 text-green-800 text-xs">
              +2.1% this month
            </Badge>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 lg:p-4 border-t bg-gray-50 transition-colors duration-200">
        <div className="flex items-center space-x-3">
          <div className="w-8 lg:w-10 h-8 lg:h-10 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-xs lg:text-sm font-semibold text-white">MS</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs lg:text-sm font-semibold text-gray-900 truncate">Mohammed Saber</p>
            <p className="text-xs text-gray-500 truncate">Senior Software Engineer</p>
          </div>
        </div>
      </div>
    </div>
  );
};