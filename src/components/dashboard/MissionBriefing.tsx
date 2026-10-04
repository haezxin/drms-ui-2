import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRightIcon, XIcon } from 'lucide-react';
import { Annotation } from '../Annotation';
import { AlertNotice } from '../AlertNotice';
import { StatusLabel } from '../StatusLabel';
import { MapPanel } from './MapPanel';
import { useOperations } from '../../contexts/OperationsContext';
import { useSession } from '../../hooks/useSession';
import { droneToModuleDistance, moduleConfigs } from '../../data/missionData';
import { formatCoordinates } from '../../utils/format';
import type { Mission } from '../../types/mission';

interface MissionBriefingProps {
  mission: Mission;
  acknowledgeable?: boolean;
  acknowledged?: boolean;
  onAcknowledge?: () => void;
}

export function MissionBriefing({ mission, acknowledgeable = false, acknowledged = false, onAcknowledge }: MissionBriefingProps) {
  const ops = useOperations();
  const { role } = useSession();
  const [confirmEnd, setConfirmEnd] = useState(false);
  const config = moduleConfigs[mission.module];
  const responder = role === 'responder';
  const alertProps = { acknowledgeable, acknowledged, onAcknowledge };

  return (
    <section aria-labelledby="mission-title" className="grid lg:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.9fr)] lg:items-stretch lg:border-b lg:border-line">
      <div className="flex flex-col px-5 pb-10 pt-10 md:px-10 md:pt-14 lg:pb-14">
        <Annotation>CURRENT MISSION</Annotation>

        {/* Responders see the current condition before anything else. */}
        {responder && ops.alert && <AlertNotice alert={ops.alert} emphasis className="mt-8" {...alertProps} />}

        <div className={`font-mono text-[13px] tracking-wide text-ink-secondary ${responder ? 'mt-10' : 'mt-8'}`}>
          {mission.id}
        </div>
        <h1
          id="mission-title"
          className="mt-2 font-display text-[44px] font-semibold leading-[0.95] tracking-[-0.035em] text-tonal md:text-[60px] xl:text-[72px]">
          
          {mission.title}
        </h1>

        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2">
          <StatusLabel value="ACTIVE" className="text-[11px] tracking-widest2" />
          <span className="font-mono text-[11px] tracking-widest2 tabular-nums text-ink-secondary">T+{mission.elapsed}</span>
          <span className="font-mono text-[11px] tracking-widest2 text-ink-tertiary">{config.shortLabel} MODULE</span>
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.3fr)] sm:gap-10">
          <address className="not-italic">
            <div
              className={
              responder ?
              'font-display text-[20px] font-semibold tracking-[-0.01em] text-ink-primary' :
              'text-[15px] text-ink-primary'
              }>
              
              {mission.barangay}
            </div>
            <div className="text-[15px] text-ink-secondary">
              {mission.city}, {mission.province}
            </div>
            <div className="mt-2 font-mono text-[10px] tracking-widest2 text-ink-tertiary">
              {mission.region.toUpperCase()} · PHILIPPINES
            </div>
          </address>
          <p className="max-w-md text-[14px] leading-relaxed text-ink-secondary">{mission.summary}</p>
        </div>

        {!responder && ops.alert && <AlertNotice alert={ops.alert} className="mt-10" {...alertProps} />}

        <div className="mt-10">
          <div className="flex flex-wrap gap-3">
            <Link
              to="/live"
              className="inline-flex h-11 items-center gap-3 rounded-[2px] border border-line-strong px-5 font-mono text-[10px] tracking-widest2 text-ink-primary transition-colors duration-150 hover:bg-surface-3">
              
              OPEN LIVE
              <ArrowUpRightIcon size={13} strokeWidth={1.5} />
            </Link>
            <button
              type="button"
              onClick={() => setConfirmEnd(true)}
              className="inline-flex h-11 items-center gap-3 rounded-[2px] border border-accent-critical/60 px-5 font-mono text-[10px] tracking-widest2 text-accent-critical transition-colors duration-150 hover:bg-accent-critical/10">
              END MISSION
              <XIcon size={13} strokeWidth={1.5} />
            </button>
          </div>
          {confirmEnd &&
          <div className="mt-5 max-w-md border border-line-strong bg-surface-1/80 p-4">
              <div className="font-mono text-[10px] tracking-widest2 text-ink-primary">END {config.shortLabel} MISSION?</div>
              <p className="mt-2 text-[13px] leading-snug text-ink-secondary">
                This will stop live monitoring for the active module and return the drone to standby.
              </p>
              <div className="mt-4 flex gap-3">
                <button
                type="button"
                onClick={() => setConfirmEnd(false)}
                className="h-9 border border-line-strong px-4 font-mono text-[9px] tracking-widest2 text-ink-primary hover:bg-surface-3">
                  CANCEL
                </button>
                <button
                type="button"
                onClick={ops.actions.endMission}
                className="h-9 border border-accent-critical/70 px-4 font-mono text-[9px] tracking-widest2 text-accent-critical hover:bg-accent-critical/10">
                  END MISSION
                </button>
              </div>
            </div>
          }
        </div>
      </div>

      <MapPanel
        entities={ops.mapEntities}
        leftCaption={formatCoordinates(mission.coordinates)}
        rightCaption={`${droneToModuleDistance} M APART`}
        trackingLabel={`${config.shortLabel} · TRACKING`}
        active={ops.missionActive} />
      
    </section>);

}
