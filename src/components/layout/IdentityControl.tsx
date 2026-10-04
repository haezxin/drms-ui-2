import React, { useEffect, useId, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDownIcon, LogOutIcon } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

/** Signed-in user menu with a single sign-out action. */
export function IdentityControl() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('pointerdown', onPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('pointerdown', onPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (!user) return null;

  const displayName = user.name || 'placeholder';

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`${displayName} account menu`}
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 items-center gap-2.5 rounded-[2px] border border-line bg-surface-1 px-1.5 transition-colors duration-150 hover:border-line-strong hover:bg-surface-3 lg:pl-3 lg:pr-2">

        <span className="hidden text-left leading-tight lg:block">
          <span className="flex items-center gap-1.5 whitespace-nowrap text-[12px] font-medium text-ink-primary">
            <span aria-hidden className="h-[5px] w-[5px] rounded-full bg-accent-normal" />
            {displayName}
          </span>
        </span>
        <span className="flex h-6 min-w-[60px] items-center justify-center bg-surface-3 px-2 font-mono text-[9px] tracking-widest2 text-ink-primary lg:hidden">
          PLACEHOLDER
        </span>
        <ChevronDownIcon
          size={12}
          strokeWidth={1.5}
          className={`text-ink-tertiary transition-transform duration-150 ease-out ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open &&
        <motion.div
          id={panelId}
          initial={{ opacity: 0, y: -4, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -4, scale: 0.98 }}
          transition={{ duration: 0.16, ease: [0.23, 1, 0.32, 1] }}
          style={{ transformOrigin: 'top right', backgroundColor: 'rgb(var(--surface-1))' }}
          className="absolute right-0 top-full z-40 mt-2 w-[220px] max-w-[calc(100vw-40px)] rounded-[3px] border border-line-strong bg-surface-1 shadow-[0_18px_40px_-24px_rgb(0_0_0/0.6)]">
          <div className="px-4 py-4">
            <div className="font-display text-[17px] font-semibold tracking-[-0.01em] text-ink-primary">{displayName}</div>
            <div className="mt-2 font-mono text-[10px] tracking-widest2 text-ink-tertiary">{user.username}</div>
          </div>

          <button
            type="button"
            onClick={logout}
            className="flex w-full items-center gap-3 border-t border-line px-4 py-3 font-mono text-[10px] tracking-widest2 text-ink-secondary transition-colors duration-150 hover:bg-surface-3/40 hover:text-ink-primary">
            <LogOutIcon size={13} strokeWidth={1.5} />
            SIGN OUT
          </button>
        </motion.div>
        }
      </AnimatePresence>
    </div>);

}