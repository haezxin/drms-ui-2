import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { StatusLabel } from '../StatusLabel';

const HOLD_MS = 1100;

type SosState = 'idle' | 'holding' | 'active';

/**
 * Deliberately hard to trigger: the control only activates after a sustained press, with a visible
 * fill showing progress, so SOS can never be set off by an ordinary click, tap, or scroll.
 */
export function SosControl({ className = '' }: {className?: string;}) {
  const [state, setState] = useState<SosState>('idle');
  const timer = useRef<number | null>(null);

  const start = () => {
    if (state === 'active') return;
    setState('holding');
    timer.current = window.setTimeout(() => setState('active'), HOLD_MS);
  };

  const cancel = () => {
    if (state !== 'holding') return;
    if (timer.current !== null) window.clearTimeout(timer.current);
    setState('idle');
  };

  const isHoldKey = (key: string) => key === ' ' || key === 'Enter';

  return (
    <div className={className}>
      <button
        type="button"
        aria-pressed={state === 'active'}
        aria-label={state === 'active' ? 'SOS active' : 'Press and hold to activate SOS'}
        disabled={state === 'active'}
        onPointerDown={start}
        onPointerUp={cancel}
        onPointerLeave={cancel}
        onPointerCancel={cancel}
        onKeyDown={(e) => {
          if (isHoldKey(e.key) && !e.repeat) {
            e.preventDefault();
            start();
          }
        }}
        onKeyUp={(e) => {
          if (isHoldKey(e.key)) cancel();
        }}
        onBlur={cancel}
        className={`relative flex h-16 w-full touch-none select-none items-center justify-center overflow-hidden rounded-[2px] border transition-colors duration-150 ${
        state === 'active' ?
        'border-accent-critical bg-accent-critical/15' :
        'border-accent-critical/50 bg-surface-2/60 hover:bg-surface-3/60'}`
        }>
        
        {state === 'holding' &&
        <motion.span
          aria-hidden
          className="absolute inset-y-0 left-0 bg-accent-critical/25"
          initial={{ width: '0%' }}
          animate={{ width: '100%' }}
          transition={{ duration: HOLD_MS / 1000, ease: 'linear' }} />

        }
        <span className="relative font-mono text-[11px] tracking-widest2 text-ink-primary">
          {state === 'active' ? 'SOS ACTIVE' : state === 'holding' ? 'KEEP HOLDING…' : 'SOS — PRESS AND HOLD TO ACTIVATE'}
        </span>
      </button>
      <div className="mt-2.5 flex items-center justify-between">
        <StatusLabel
          value={state === 'active' ? 'SOS ACTIVE' : 'SOS ARMED'}
          tone={state === 'active' ? 'critical' : 'neutral'}
          pulse={state === 'active'}
          className="text-[10px] tracking-widest2" />
        
        {state === 'active' &&
        <button
          type="button"
          onClick={() => setState('idle')}
          className="font-mono text-[9px] tracking-widest2 text-ink-tertiary underline decoration-line-strong underline-offset-4 transition-colors duration-150 hover:text-ink-secondary">
          
            RESET (DEMO)
          </button>
        }
      </div>
    </div>);

}