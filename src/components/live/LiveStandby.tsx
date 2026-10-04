import React from 'react';
import { PageHeader } from '../layout/PageHeader';
import { Annotation } from '../Annotation';
import { TelemetryNotice } from '../TelemetryNotice';
import { MetricRow } from './MetricRow';
import { useOperations } from '../../contexts/OperationsContext';
import { useSession } from '../../hooks/useSession';
import { droneStatusRows } from '../../utils/status';

/** Live with no mission deployed — nothing is presented as a live feed. */
export function LiveStandby() {
  const ops = useOperations();
  const { config } = useSession();

  return (
    <div className="w-full">
      <PageHeader section="LIVE" live />
      <TelemetryNotice condition={ops.signalCondition} className="mx-5 mt-8 md:mx-10" />
      <section aria-labelledby="live-standby" className="px-5 py-12 md:px-10 md:py-16">
        <Annotation>LIVE FEED</Annotation>
        <h1
          id="live-standby"
          className="mt-8 font-display text-[40px] font-semibold leading-[0.95] tracking-[-0.035em] text-tonal md:text-[60px]">
          
          {config.emptyState.title}
        </h1>
        <p className="mt-5 max-w-md text-[15px] text-ink-secondary">{config.emptyState.detail}</p>
        <p className="mt-2 font-mono text-[10px] tracking-widest2 text-ink-tertiary">
          LIVE DATA BEGINS WHEN A MISSION IS DEPLOYED
        </p>

        <div className="mt-14 max-w-4xl">
          <Annotation>DRONE</Annotation>
          <MetricRow size="md" className="mt-5" metrics={droneStatusRows(ops.drone)} />
        </div>
      </section>
    </div>);

}