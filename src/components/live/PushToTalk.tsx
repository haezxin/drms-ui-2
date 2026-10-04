import React, { useState } from 'react';
import { MicIcon } from 'lucide-react';
import { PulseDot } from '../PulseDot';

interface PushToTalkProps {
  onActiveChange?: (transmitting: boolean) => void;
  disabled?: boolean;
}

export function PushToTalk({ onActiveChange, disabled = false }: PushToTalkProps) {
  const [talking, setTalking] = useState(false);
  const isTalkKey = (key: string) => key === ' ' || key === 'Enter';

  const setState = (next: boolean) => {
    setTalking(next);
    onActiveChange?.(next);
  };

  return (
    <button
      type="button"
      aria-pressed={talking}
      aria-label={disabled ? 'Push to talk unavailable' : 'Push to talk — hold to transmit'}
      disabled={disabled}
      onPointerDown={(e) => {
        if (disabled) return;
        e.currentTarget.setPointerCapture(e.pointerId);
        setState(true);
      }}
      onPointerUp={() => setState(false)}
      onPointerCancel={() => setState(false)}
      onKeyDown={(e) => {
        if (!disabled && isTalkKey(e.key) && !e.repeat) {
          e.preventDefault();
          setState(true);
        }
      }}
      onKeyUp={(e) => {
        if (isTalkKey(e.key)) setState(false);
      }}
      onBlur={() => setState(false)}
      className={`flex h-20 w-full touch-none select-none items-center justify-between gap-4 rounded-[2px] border px-5 transition-[background-color,border-color,transform] duration-150 ease-out active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 md:px-6 ${
      talking ?
      'border-accent-critical bg-accent-critical/10' :
      'border-line-strong bg-surface-2/60 hover:bg-surface-3/60'}`
      }>
      
      <span className="flex items-center gap-4">
        <MicIcon size={18} strokeWidth={1.5} className={talking ? 'text-accent-critical' : 'text-ink-secondary'} />
        <span className="text-left">
          <span className="block font-display text-[20px] font-semibold tracking-[-0.01em] text-ink-primary">
            {disabled ? 'Unavailable' : talking ? 'Transmitting' : 'Hold to talk'}
          </span>
          <span className="mt-0.5 block font-mono text-[9px] tracking-widest2 text-ink-tertiary">PUSH-TO-TALK</span>
        </span>
      </span>
      <span className="flex items-center gap-2 font-mono text-[10px] tracking-widest2 text-ink-secondary">
        {talking ?
        <>
            <PulseDot tone="critical" />
            <span className="text-accent-critical">ON AIR</span>
          </> :
        disabled ?
        'NO LINK' :

        'READY'
        }
      </span>
    </button>);

}