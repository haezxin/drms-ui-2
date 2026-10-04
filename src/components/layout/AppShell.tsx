import React from 'react';
import { NavRail } from './NavRail';
import { MobileNav } from './MobileNav';

export function AppShell({ children }: {children: React.ReactNode;}) {
  return (
    <div className="flex min-h-screen w-full bg-surface-0 text-ink-primary">
      <NavRail />
      <main className="atmosphere min-w-0 flex-1 pb-16 md:pb-0">{children}</main>
      <MobileNav />
    </div>);

}