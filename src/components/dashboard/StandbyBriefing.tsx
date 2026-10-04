import React from 'react';
import { Annotation } from '../Annotation';
import { StatusLabel } from '../StatusLabel';
import { MapPanel } from './MapPanel';
import { useOperations } from '../../contexts/OperationsContext';
import { useSession } from '../../hooks/useSession';
import { moduleConfigs } from '../../data/missionData';

/** Dashboard briefing when no mission is active — role-worded, with the last module used. */
export function StandbyBriefing() {
  const ops = useOperations();
  const { can, config } = useSession();
  const last = ops.lastMission;
  const lastModule = moduleConfigs[last.module];
  const canPrepare = can('mission.create') || can('module.deploy');

  return (
    <section aria-labelledby="standby-title" className="grid lg:grid-cols-12">
      <div className="flex flex-col px-5 pb-10 pt-10 md:px-10 md:pt-14 lg:col-span-7 lg:pb-14">
        <Annotation>MISSION STATUS</Annotation>
        <h1
          id="standby-title"
          className="mt-8 font-display text-[44px] font-semibold leading-[0.95] tracking-[-0.035em] text-tonal md:text-[60px] xl:text-[72px]">
          
          {config.emptyState.title}
        </h1>
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
          <StatusLabel value="STANDBY" dot className="text-[11px] tracking-widest2" />
          <StatusLabel value="NO ACTIVE MODULE" tone="neutral" className="text-[11px] tracking-widest2" />
          <span className="text-[15px] text-ink-secondary">{config.emptyState.detail}</span>
        </div>

        {canPrepare &&
        <button
          type="button"
          onClick={ops.actions.startMission}
          className="mt-10 inline-flex h-11 w-fit items-center border border-line-strong px-5 font-mono text-[10px] tracking-widest2 text-ink-primary transition-colors duration-150 hover:bg-surface-3">
            START NEW MISSION
          </button>
        }

        <div className="mt-14">
          <Annotation>LAST MISSION</Annotation>
          <div className="mt-5 grid items-baseline gap-x-10 gap-y-3 border-t border-line pt-5 sm:grid-cols-[auto_minmax(0,1fr)]">
            <div className="font-display text-[32px] font-semibold leading-none tracking-[-0.02em] text-ink-primary">
              {lastModule.label}
            </div>
            <div className="min-w-0">
              <div className="font-mono text-[11px] tracking-wide text-ink-secondary">
                {last.id} · {last.title}
              </div>
              <div className="mt-1 font-mono text-[10px] tracking-wide text-ink-tertiary">
                {last.barangay}, {last.city} · COMPLETED {last.date}
              </div>
            </div>
          </div>
        </div>
      </div>

      <MapPanel
        entities={ops.mapEntities}
        leftCaption="DRONE AT BASE"
        rightCaption="STANDBY"
        trackingLabel="BASE - STANDBY"
        className="lg:col-span-5"
        active={false} />
    </section>);

}
