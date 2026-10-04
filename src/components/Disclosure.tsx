import React, { useId, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDownIcon } from 'lucide-react';

interface DisclosureProps {
  label: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

/** Progressive disclosure for secondary technical information. */
export function Disclosure({ label, children, defaultOpen = false }: DisclosureProps) {
  const [open, setOpen] = useState(defaultOpen);
  const panelId = useId();

  return (
    <div>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-4 font-mono text-[10px] tracking-widest2 text-ink-secondary transition-colors duration-150 hover:text-ink-primary">
        
        <span className="flex items-center gap-2.5">
          <span aria-hidden className="h-px w-3 bg-ink-tertiary/60" />
          {label}
        </span>
        <span className="flex items-center gap-2 text-ink-tertiary">
          {open ? 'HIDE' : 'SHOW'}
          <ChevronDownIcon
            size={13}
            strokeWidth={1.5}
            className={`transition-transform duration-200 ease-out ${open ? 'rotate-180' : ''}`} />
          
        </span>
      </button>
      <AnimatePresence initial={false}>
        {open &&
        <motion.div
          id={panelId}
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}
          className="overflow-hidden">
          
            {children}
          </motion.div>
        }
      </AnimatePresence>
    </div>);

}