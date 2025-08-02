import type { LucideIcon } from 'lucide-react';

export interface IMetricCardProps {
  value: string | number;
  description: string;
  icon: LucideIcon;
  iconBgColor: string;
  badgeColor: string;
  badgeText: string;
  bgGradient: string;
  accentGradient: string;
  customBadges?: Array<{
    text: string;
    color: string;
    bgColor: string;
    borderColor: string;
  }>;
}