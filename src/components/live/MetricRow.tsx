import React from 'react';
import { StatusLabel } from '../StatusLabel';
import { toneFor } from '../../utils/status';
import type { Tone } from '../../types/mission';

export interface Metric {
  label: string;
  value: string;
  unit?: string;
  tone?: Tone;
}

interface MetricRowProps {
  metrics: Metric[];
  size?: 'lg' | 'md';
  className?: string;
}

/** Embedded metrics separated by hairline rules. Stacks into technical rows on mobile. */
export function MetricRow({ metrics, size = 'lg', className = '' }: MetricRowProps) {
  const valueSize = size === 'lg' ? 'text-[15px] md:text-[22px] xl:text-[26px]' : 'text-[15px] md:text-[18px]';

  return (
    <dl className={`grid w-full border-y border-line md:grid-cols-5 ${className}`}>
      {metrics.map((m, i) =>
      <div
        key={m.label}
        className={`flex min-w-0 items-end justify-between gap-3 py-3.5 md:min-h-[104px] md:flex-col md:items-start md:justify-between md:py-5 ${
        i > 0 ? 'border-t border-line md:border-l md:border-t-0 md:pl-6' : ''} ${
        i < metrics.length - 1 ? 'md:pr-6' : ''}`}>
        
          <dt className="min-w-0 whitespace-nowrap font-mono text-[10px] tracking-widest2 text-ink-tertiary">{m.label}</dt>
          <dd className="flex shrink-0 justify-end md:mt-3 md:w-full">
            <StatusLabel
            variant="display"
            tone={m.tone ?? toneFor(m.value)}
            className={`${valueSize} tracking-[-0.01em]`}
            value={
            <>
                  {m.value}
                  {m.unit && <span className="ml-1 text-[0.6em] text-ink-tertiary">{m.unit}</span>}
                </>
            } />
          
          </dd>
        </div>
      )}
    </dl>);

}