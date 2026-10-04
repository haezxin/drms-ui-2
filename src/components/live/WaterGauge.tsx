import React from 'react';

interface WaterGaugeProps {
  level: number;
  advisory: number;
  critical: number;
  max: number;
}

export function WaterGauge({ level, advisory, critical, max }: WaterGaugeProps) {
  const pct = (v: number) => `${Math.min(v / max, 1) * 100}%`;
  const ticks = Array.from({ length: Math.floor(max / 0.5) + 1 }, (_, i) => i * 0.5);
  const label = `Water level ${level.toFixed(2)} m, advisory ${advisory.toFixed(2)} m, critical ${critical.toFixed(2)} m`;

  return (
    <>
      {/* Vertical gauge — tablet & desktop */}
      <div role="img" aria-label={label} className="relative hidden h-full min-h-[300px] md:block">
        <div className="absolute inset-y-0 left-10 w-px bg-line-strong" />
        {ticks.map((t) =>
        <div key={t} className="absolute left-0 flex items-center" style={{ bottom: pct(t), transform: 'translateY(50%)' }}>
            <span className="w-8 text-right font-mono text-[9px] tabular-nums text-ink-tertiary">{t.toFixed(1)}</span>
            <span className="ml-2 h-px w-2 bg-ink-tertiary/60" />
          </div>
        )}
        <div
          className="absolute bottom-0 left-10 right-0 border-t border-ink-primary bg-ink-primary/[0.07]"
          style={{ height: pct(level) }} />
        
        <div className="absolute left-10 right-0 border-t border-dashed border-accent-critical" style={{ bottom: pct(critical) }}>
          <span className="absolute -top-4 right-0 font-mono text-[9px] tracking-widest2 text-accent-critical">CRITICAL</span>
        </div>
        <div className="absolute left-10 right-0 border-t border-dashed border-accent-warning" style={{ bottom: pct(advisory) }}>
          <span className="absolute -top-4 right-0 font-mono text-[9px] tracking-widest2 text-ink-secondary">ADVISORY</span>
        </div>
      </div>

      {/* Horizontal gauge — mobile */}
      <div role="img" aria-label={label} className="relative mt-2 h-12 md:hidden">
        <div className="absolute inset-x-0 top-3 h-px bg-line-strong" />
        <div className="absolute left-0 top-1.5 h-3 border-r border-ink-primary bg-ink-primary/[0.08]" style={{ width: pct(level) }} />
        <div className="absolute top-0 h-6 border-l border-dashed border-accent-warning" style={{ left: pct(advisory) }}>
          <span className="absolute left-1 top-6 font-mono text-[9px] tracking-widest2 text-ink-secondary">ADV</span>
        </div>
        <div className="absolute top-0 h-6 border-l border-dashed border-accent-critical" style={{ left: pct(critical) }}>
          <span className="absolute left-1 top-6 font-mono text-[9px] tracking-widest2 text-accent-critical">CRIT</span>
        </div>
      </div>
    </>);

}