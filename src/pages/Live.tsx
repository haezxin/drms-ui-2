import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { StatusLabel } from '../components/StatusLabel';
import { AlertNotice } from '../components/AlertNotice';
import { TelemetryNotice } from '../components/TelemetryNotice';
import { LiveFocal } from '../components/live/LiveFocal';
import { LiveRail } from '../components/live/LiveRail';
import { LiveStandby } from '../components/live/LiveStandby';
import { useOperations } from '../contexts/OperationsContext';
import { useSession } from '../hooks/useSession';
import { moduleConfigs } from '../data/missionData';
import { batteryRow } from '../utils/status';
import type { StatusRow } from '../types/mission';

export function Live() {
  const ops = useOperations();
  const { can } = useSession();
  const [acknowledgedId, setAcknowledgedId] = useState<string | null>(null);
  if (!ops.mission) return <LiveStandby />;

  const mission = ops.mission;
  const config = moduleConfigs[mission.module];
  const alertProps = {
    acknowledgeable: can('alerts.acknowledge'),
    acknowledged: ops.alert?.id === acknowledgedId,
    onAcknowledge: () => ops.alert && setAcknowledgedId(ops.alert.id)
  };

  const strip: StatusRow[] = [
  batteryRow('BATTERY', ops.drone.battery),
  { label: 'GPS', value: ops.drone.gps },
  { label: 'LORA', value: ops.module.lora },
  { label: 'LINK', value: ops.drone.signal }];


  const meta = [
  { label: 'MODULE', value: config.shortLabel },
  { label: 'ELAPSED', value: `T+${mission.elapsed}` },
  { label: 'STARTED', value: mission.startedAt }];


  return (
    <div className="w-full">
      <PageHeader section="LIVE" live />

      <section
        aria-labelledby="live-mission"
        className="flex flex-col gap-7 border-b border-line px-5 py-7 md:flex-row md:items-end md:justify-between md:px-10 md:py-9">
        
        <div className="min-w-0">
          <div className="flex items-center gap-4">
            <span className="font-mono text-[12px] tracking-wide text-ink-secondary">{mission.id}</span>
            <StatusLabel value="ACTIVE" className="text-[10px] tracking-widest2" />
          </div>
          <h1
            id="live-mission"
            className="mt-3 font-display text-[34px] font-semibold leading-[0.95] tracking-[-0.03em] text-tonal md:text-[48px]">
            
            {mission.title}
          </h1>
          <p className="mt-3 font-mono text-[10px] tracking-widest2 text-ink-tertiary">
            {mission.barangay.toUpperCase()} · {mission.city.toUpperCase()}, {mission.province.toUpperCase()}
          </p>
        </div>
        <dl className="grid shrink-0 grid-cols-3 gap-6 md:flex md:gap-10 md:text-right">
          {meta.map((m) =>
          <div key={m.label}>
              <dt className="font-mono text-[10px] tracking-widest2 text-ink-tertiary">{m.label}</dt>
              <dd className="mt-1.5 whitespace-nowrap font-mono text-[13px] tabular-nums text-ink-primary">{m.value}</dd>
            </div>
          )}
        </dl>
      </section>

      {ops.alert &&
      <div className="border-b border-line px-5 py-5 md:px-10 lg:hidden">
          <AlertNotice alert={ops.alert} {...alertProps} />
        </div>
      }

      <dl className="grid grid-cols-4 border-b border-line lg:hidden">
        {strip.map((s, i) =>
        <div key={s.label} className={`py-3.5 pr-2 ${i === 0 ? 'pl-5 md:pl-10' : 'border-l border-line pl-3 md:pl-6'}`}>
            <dt className="font-mono text-[9px] tracking-widest2 text-ink-tertiary">{s.label}</dt>
            <dd className="mt-1.5">
              <StatusLabel value={s.value} tone={s.tone} className="text-[11px]" />
            </dd>
          </div>
        )}
      </dl>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_360px] xl:grid-cols-[minmax(0,1fr)_400px]">
        <div className="min-w-0 pb-12 md:px-10 md:pt-8">
          <TelemetryNotice condition={ops.signalCondition} className="mx-5 my-6 md:mx-0 md:mt-0" />
          <LiveFocal module={mission.module} />
        </div>
        <LiveRail alertProps={alertProps} />
      </div>
    </div>);

}
