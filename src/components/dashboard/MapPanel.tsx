import React from 'react';
import { Annotation } from '../Annotation';
import { LiveMapPanel } from '../map/LiveMapPanel';
import type { MapEntity } from '../../types/mission';

interface MapPanelProps {
  entities: MapEntity[];
  leftCaption: string;
  rightCaption?: string;
  trackingLabel?: string;
  className?: string;
  active?: boolean;
}

/** The integrated map surface occupying the right of the Dashboard briefing. */
export function MapPanel({ entities, leftCaption, rightCaption, trackingLabel = 'MISSION TRACKING', className = '', active = true }: MapPanelProps) {
  return (
    <aside className={`flex min-h-[360px] flex-col border-t border-line bg-surface-1/35 lg:min-h-[620px] lg:border-l lg:border-t-0 ${className}`}>
      <div className="flex items-baseline justify-between gap-4 px-5 pb-4 pt-7 md:px-6 lg:pt-10">
        <Annotation>{active ? 'LIVE MAP' : 'MAP STATUS'}</Annotation>
        {rightCaption && (
          <span className="shrink-0 font-mono text-[10px] tracking-widest2 tabular-nums text-ink-tertiary">
            {active ? rightCaption : 'NO SIGNAL'}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col px-4 pb-4 md:px-6 md:pb-6 lg:min-h-0">
        <LiveMapPanel
          entities={entities}
          trackingLabel={trackingLabel}
          className="min-h-[260px] flex-1 max-lg:aspect-[16/10]"
          mapClassName="min-h-[220px] flex-1"
          active={active} />

        <div className="flex items-center justify-between gap-4 border-x border-b border-line px-4 py-3 font-mono text-[10px] tracking-wide tabular-nums text-ink-tertiary">
          <span className="min-w-0 truncate">{leftCaption}</span>
          {rightCaption && <span className="shrink-0 tracking-widest2">{active ? rightCaption : 'STANDBY'}</span>}
        </div>
      </div>
    </aside>);

}
