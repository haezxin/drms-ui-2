import React from 'react';
import { StatusLabel } from './StatusLabel';
import type { Alert, Tone } from '../types/mission';

const levelTone: Record<Alert['level'], Tone> = { critical: 'critical', warning: 'warning', info: 'info' };
const levelRule: Record<Alert['level'], string> = {
  critical: 'border-accent-critical',
  warning: 'border-accent-warning',
  info: 'border-line-strong'
};

interface AlertNoticeProps {
  alert: Alert;
  /** Larger message for roles where the alert is the most important element. */
  emphasis?: boolean;
  /** Whether this role may acknowledge the alert (Dispatcher / Field Operator only). */
  acknowledgeable?: boolean;
  acknowledged?: boolean;
  onAcknowledge?: () => void;
  className?: string;
}

/** Contextual alert — a hairline-ruled annotation, never a bright panel. */
export function AlertNotice({
  alert,
  emphasis = false,
  acknowledgeable = false,
  acknowledged = false,
  onAcknowledge,
  className = ''
}: AlertNoticeProps) {
  return (
    <div
      role={alert.level === 'critical' ? 'alert' : 'status'}
      className={`border-l-2 py-0.5 pl-4 transition-opacity duration-200 ${levelRule[alert.level]} ${
      acknowledged ? 'opacity-60' : ''} ${
      className}`}>
      
      <div className="flex items-center justify-between gap-4">
        <StatusLabel
          value={alert.level.toUpperCase()}
          tone={levelTone[alert.level]}
          pulse={alert.level === 'critical' && !acknowledged}
          className="text-[10px] tracking-widest2" />
        
        <span className="font-mono text-[10px] tracking-widest2 text-ink-tertiary">
          {alert.timestamp.toUpperCase()}
        </span>
      </div>
      <p
        className={
        emphasis ?
        'mt-3 max-w-xl font-display text-[19px] font-semibold leading-snug tracking-[-0.01em] text-ink-primary md:text-[22px]' :
        'mt-2 max-w-md text-[14px] leading-snug text-ink-primary'
        }>
        
        {alert.message}
      </p>
      {acknowledgeable &&
      <div className="mt-3">
          {acknowledged ?
        <span className="font-mono text-[9px] tracking-widest2 text-ink-tertiary">ACKNOWLEDGED</span> :

        <button
          type="button"
          onClick={onAcknowledge}
          className="font-mono text-[9px] tracking-widest2 text-ink-secondary underline decoration-line-strong underline-offset-4 transition-colors duration-150 hover:text-ink-primary">
          
              ACKNOWLEDGE
            </button>
        }
        </div>
      }
    </div>);

}