import React from 'react';
import { StatusLabel } from './StatusLabel';
import type { StatusRow } from '../types/mission';

interface StatusReadoutProps {
  title: string;
  meta?: string;
  rows: StatusRow[];
  className?: string;
}

export function StatusReadout({ title, meta, rows, className = '' }: StatusReadoutProps) {
  return (
    <div className={className}>
      <div className="flex items-baseline justify-between gap-4 border-b border-line-strong pb-2.5">
        <h3 className="font-mono text-[10px] tracking-widest2 text-ink-primary">{title}</h3>
        {meta && <span className="font-mono text-[10px] tracking-widest2 text-ink-tertiary">{meta}</span>}
      </div>
      <dl className="space-y-2.5 pt-2.5">
        {rows.map((row) =>
        <div key={row.label} className="flex items-baseline justify-between gap-6">
            <dt className="font-mono text-[10px] tracking-widest2 text-ink-tertiary">{row.label}</dt>
            <dd>
              <StatusLabel value={row.value} tone={row.tone} className="text-[12px]" />
            </dd>
          </div>
        )}
      </dl>
    </div>);

}