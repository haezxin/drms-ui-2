import React from 'react';
import { NavLink } from 'react-router-dom';
import { navItems } from './navItems';

export function MobileNav() {
  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-0 left-0 right-0 z-30 flex items-stretch border-t border-line bg-surface-1 pb-[env(safe-area-inset-bottom)] md:hidden">
      
      {navItems.map((item) =>
      <NavLink
        key={item.to}
        to={item.to}
        end={item.to === '/'}
        className={({ isActive }) =>
        `relative flex flex-1 flex-col items-center gap-1.5 py-3 transition-colors duration-150 ${
        isActive ? 'text-ink-primary' : 'text-ink-tertiary'}`

        }>
        
          {({ isActive }) =>
        <>
              {isActive && <span aria-hidden className="absolute inset-x-6 top-0 h-px bg-ink-primary" />}
              <item.icon size={18} strokeWidth={1.5} />
              <span className="font-mono text-[8px] tracking-widest2">{item.label}</span>
            </>
        }
        </NavLink>
      )}
    </nav>);

}