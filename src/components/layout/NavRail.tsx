import React from 'react';
import { NavLink } from 'react-router-dom';
import { SunIcon, MoonIcon } from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { navItems } from './navItems';

export function NavRail() {
  const { theme, toggleTheme } = useTheme();
  const iconClassName = 'h-[18px] w-[18px] shrink-0';

  return (
    <nav
      aria-label="Primary"
      className="hidden border-r border-line bg-surface-1 md:sticky md:top-0 md:flex md:h-screen md:w-[84px] md:shrink-0 md:flex-col">

      <div className="flex h-16 items-center justify-center border-b border-line">
        <span className="font-mono text-[11px] tracking-widest2 text-ink-primary">DRMS</span>
      </div>
      <ul className="flex flex-1 flex-col pt-3">
        {navItems.map((item) =>
        <li key={item.to}>
            <NavLink
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
            `relative flex flex-col items-center gap-2 py-4 transition-colors duration-150 ${
            isActive ? 'text-ink-primary' : 'text-ink-tertiary hover:text-ink-secondary'}`

            }>

              {({ isActive }) =>
            <>
                  {isActive && <span aria-hidden className="absolute bottom-3 left-0 top-3 w-px bg-ink-primary" />}
                  <span className="flex h-[18px] w-[18px] items-center justify-center">
                    <item.icon className={iconClassName} size={18} strokeWidth={1.5} />
                  </span>
                  <span className="font-mono text-[9px] tracking-widest2">{item.label}</span>
                </>
            }
            </NavLink>
          </li>
        )}
      </ul>
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        className="flex h-16 flex-col items-center justify-center gap-1.5 border-t border-line text-ink-tertiary transition-colors duration-150 hover:text-ink-primary">

        <span className="flex h-[18px] w-[18px] items-center justify-center">
          {theme === 'dark' ? <SunIcon className={iconClassName} size={18} strokeWidth={1.5} /> : <MoonIcon className={iconClassName} size={18} strokeWidth={1.5} />}
        </span>
        <span className="font-mono text-[9px] tracking-widest2">{theme === 'dark' ? 'LIGHT' : 'DARK'}</span>
      </button>
    </nav>);

}