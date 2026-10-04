import React from 'react';
import { StatusLabel } from '../StatusLabel';
import { IdentityControl } from './IdentityControl';
import { usePhtClock } from '../../hooks/usePhtClock';
import { useOperations } from '../../contexts/OperationsContext';
import type { OperationsSnapshot, Tone } from '../../types/mission';

interface PageHeaderProps {
  section: string;
  live?: boolean;
}

interface Indicator {
  value: React.ReactNode;
  tone: Tone;
  pulse?: boolean;
  dot?: boolean;
}

function systemIndicator(ops: OperationsSnapshot): Indicator {
  if (ops.signalCondition === 'offline') return { value: 'LINK LOST', tone: 'critical' };
  const word = ops.signalCondition === 'degraded' ? 'DEGRADED' : 'NOMINAL';
  return {
    value:
    <>
        <span className="hidden md:inline">SYSTEM&nbsp;</span>
        {word}
      </>,

    tone: ops.signalCondition === 'degraded' ? 'warning' : 'normal'
  };
}

function liveIndicator(ops: OperationsSnapshot): Indicator {
  if (!ops.mission) return { value: 'STANDBY', tone: 'neutral', dot: true };
  if (ops.signalCondition === 'offline') return { value: 'OFFLINE', tone: 'critical' };
  if (ops.signalCondition === 'degraded') return { value: 'DELAYED', tone: 'warning', pulse: true };
  return { value: 'LIVE', tone: 'normal', pulse: true };
}

export function PageHeader({ section, live = false }: PageHeaderProps) {
  const time = usePhtClock();
  const ops = useOperations();
  const status = live ? liveIndicator(ops) : systemIndicator(ops);

  return (
    <header className="relative z-30 flex h-14 items-center justify-between gap-4 border-b border-line bg-surface-1 px-5 md:h-16 md:px-10">
      <div className="flex min-w-0 items-center gap-3">
        <span className="font-mono text-[11px] tracking-widest2 text-ink-primary md:hidden">DRMS</span>
        <span className="hidden truncate font-mono text-[10px] tracking-widest2 text-ink-tertiary lg:inline">
          DISASTER RESPONSE MANAGEMENT SYSTEM
        </span>
        <span aria-hidden className="h-3 w-px shrink-0 bg-line-strong md:hidden lg:inline-block" />
        <span className="font-mono text-[10px] tracking-widest2 text-ink-secondary">{section}</span>
      </div>
      <div className="flex shrink-0 items-center gap-4 md:gap-6">
        <StatusLabel
          value={status.value}
          tone={status.tone}
          pulse={status.pulse}
          dot={status.dot}
          className="text-[10px] tracking-widest2" />
        
        <time className="hidden font-mono text-[10px] tracking-widest2 tabular-nums text-ink-tertiary sm:inline">
          {time} PHT
        </time>
        <IdentityControl />
      </div>
    </header>);

}