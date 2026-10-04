import { GaugeIcon, RadioIcon, CompassIcon, LucideIcon } from 'lucide-react';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
}

export const navItems: NavItem[] = [
{ to: '/', label: 'DASHBOARD', icon: GaugeIcon },
{ to: '/live', label: 'LIVE', icon: RadioIcon },
{ to: '/map', label: 'MAP', icon: CompassIcon }];