import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { IMetricCardProps } from '@/models/metricCard';

export const MetricCard: React.FC<IMetricCardProps> = ({
  value,
  description,
  icon: Icon,
  iconBgColor,
  badgeColor,
  badgeText,
  bgGradient,
  accentGradient,
  customBadges
}) => {
  return (
    <Card className={`relative overflow-hidden hover:shadow-xl transition-all duration-500 border-0 shadow-lg ${bgGradient} group`}>
      <div className={`absolute top-0 right-0 w-24 h-24 ${accentGradient} rounded-full -translate-y-12 translate-x-12 opacity-60 group-hover:opacity-80 transition-opacity duration-500`}></div>
      
      <CardContent className="relative p-6">
        <div className="flex items-center justify-between mb-4">
          <div className={`h-10 w-10 rounded-xl ${iconBgColor} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
            <Icon className="h-5 w-5 text-white" />
          </div>

          {customBadges?.length ? (
            <div className="flex flex-col gap-1">
              {customBadges.map((badge, index) => (
                <Badge 
                  key={index}
                  variant="outline" 
                  className={`${badge.borderColor} ${badge.bgColor} ${badge.color} text-xs`}
                >
                  {badge.text}
                </Badge>
              ))}
            </div>
          ) : (
            <Badge variant="outline" className={badgeColor}>
              {badgeText}
            </Badge>
          )}
        </div>

        <div className="space-y-2">
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-sm text-gray-600">{description}</div>
        </div>
      </CardContent>
    </Card>
  );
}; 