import React from 'react';
import { TacticalMap } from './TacticalMap';
import type { MapEntity } from '../../types/mission';

interface LiveMapPanelProps {
  entities: MapEntity[];
  trackingLabel: string;
  className?: string;
  mapClassName?: string;
  active?: boolean;
}

export function LiveMapPanel({ entities, trackingLabel, className = '', mapClassName = 'h-56 md:h-64', active = true }: LiveMapPanelProps) {
  return (
    <div className={`flex flex-col overflow-hidden border border-line bg-surface-1 shadow-[inset_0_0_24px_rgba(255,255,255,0.02)] ${className}`}>
      <div className="flex items-center justify-between border-b border-line bg-surface-2/80 px-4 py-2.5 font-mono text-[9px] tracking-widest2 text-ink-tertiary">
        <span className="flex items-center gap-2">
          <span className={`inline-block h-1.5 w-1.5 rounded-full ${active ? 'bg-accent-normal shadow-[0_0_12px_rgba(110,163,124,0.9)]' : 'bg-ink-tertiary'}`} />
          {active ? 'MISSION OVERLAY' : 'NO SIGNAL'}
        </span>
        <span>{active ? trackingLabel : 'STANDBY'}</span>
      </div>
      <TacticalMap entities={entities} className={`border-0 ${mapClassName}`} annotations active={active} />
    </div>);

}
