import React from 'react';
import { Annotation } from '../Annotation';
import { StatusLabel } from '../StatusLabel';
import type { Mission } from '../../types/mission';

export function MissionHistory({ missions }: {missions: Mission[];}) {
  return (
    <div className="border-t border-line px-5 py-10 md:px-10 md:py-12 lg:col-span-5 lg:border-l lg:border-t-0 lg:px-8">
      <Annotation>RECENT MISSIONS</Annotation>
      <ol className="mt-6 divide-y divide-line border-y border-line">
        {missions.map((m) =>
        <li key={m.id} className="grid grid-cols-[56px_minmax(0,1fr)_auto] items-baseline gap-4 py-4">
            <span className="font-mono text-[11px] text-ink-tertiary">{m.id}</span>
            <div className="min-w-0">
              <div className="truncate text-[14px] font-medium text-ink-primary">{m.title}</div>
              <div className="mt-0.5 truncate font-mono text-[10px] tracking-wide text-ink-tertiary">
                {m.city}, {m.province}
              </div>
            </div>
            <div className="text-right">
              <StatusLabel value="COMPLETED" dot muted className="text-[9px] tracking-widest2" />
              <div className="mt-1 font-mono text-[10px] tabular-nums text-ink-tertiary">{m.date}</div>
            </div>
          </li>
        )}
      </ol>
    </div>);

}