import React from 'react';
import { Annotation } from '../Annotation';
import { StatusLabel } from '../StatusLabel';
import { MetricRow } from './MetricRow';
import { WaterGauge } from './WaterGauge';
import { floodReading } from '../../data/missionData';

export function FloodFocal() {
  const r = floodReading;
  const belowCritical = Math.max(r.criticalLevel - r.waterLevel, 0);

  return (
    <div className="w-full px-5 pt-8 md:px-0 md:pt-0">
      <div className="grid gap-6 md:grid-cols-[minmax(0,1fr)_150px] md:gap-12">
        <div className="flex flex-col">
          <Annotation>CURRENT WATER LEVEL</Annotation>
          <div className="mt-6 font-display text-[104px] font-semibold leading-[0.85] tracking-[-0.05em] tabular-nums text-tonal md:text-[136px] lg:text-[112px] xl:text-[150px]">
            {r.waterLevel.toFixed(2)}
            <span className="ml-2 text-[0.32em] tracking-normal text-ink-tertiary">m</span>
          </div>
          <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
            <StatusLabel value={r.trend} className="text-[11px] tracking-widest2" />
            <span className="font-mono text-[11px] tracking-widest2 tabular-nums text-ink-secondary">
              +{r.rateCmPerHr} CM/HR
            </span>
            <span className="font-mono text-[11px] tracking-widest2 tabular-nums text-ink-tertiary">
              {belowCritical.toFixed(2)} M BELOW CRITICAL
            </span>
          </div>
        </div>
        <WaterGauge level={r.waterLevel} advisory={r.advisoryLevel} critical={r.criticalLevel} max={r.gaugeMax} />
      </div>

      <MetricRow
        className="mt-10"
        metrics={[
        { label: 'WATER CONDITION', value: r.condition, tone: 'warning' },
        { label: 'ADVISORY LEVEL', value: r.advisoryLevel.toFixed(2), unit: 'm', tone: 'neutral' },
        { label: 'CRITICAL LEVEL', value: r.criticalLevel.toFixed(2), unit: 'm', tone: 'neutral' }]
        } />
      
      <p className="mt-4 font-mono text-[10px] tracking-wide text-ink-tertiary">
        Depth measured by submerged pressure sensor at the module position.
      </p>
    </div>);

}