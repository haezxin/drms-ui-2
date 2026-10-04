import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRightIcon } from 'lucide-react';
import { Annotation } from '../Annotation';
import { StatusLabel } from '../StatusLabel';
import { StatusReadout } from '../StatusReadout';
import { useOperations } from '../../contexts/OperationsContext';
import { useSession } from '../../hooks/useSession';
import { droneId, moduleConfigs } from '../../data/missionData';
import { droneStatusRows, moduleStatusRows } from '../../utils/status';
import type { ModuleType } from '../../types/mission';

const deployableModules: Array<Extract<ModuleType, 'fire' | 'flood'>> = ['fire', 'flood'];

const modulePurpose: Record<Extract<ModuleType, 'fire' | 'flood'>, {purpose: string;hardware: string;}> = {
  fire: { purpose: 'Machine learning fire and smoke detection', hardware: 'Camera, ESP32, LoRa, AI detection' },
  flood: { purpose: 'Pressure-based flood assessment', hardware: 'Pressure sensor, ESP32, LoRa' }
};

export function MissionSetup() {
  const ops = useOperations();
  const { can } = useSession();
  const authorized = can('mission.create') || can('module.deploy');
  const selected = ops.selectedModule;
  const selectedConfig = selected ? moduleConfigs[selected] : null;
  const ready = ops.moduleStatus === 'deployment-ready';
  const deploying = ops.moduleStatus === 'deploying';
  const active = ops.moduleStatus === 'active';

  if (!authorized) {
    return (
      <section className="border-b border-line px-5 py-12 md:px-10 md:py-16">
        <Annotation>MISSION CONTROL</Annotation>
        <h1 className="mt-8 font-display text-[44px] font-semibold leading-[0.95] tracking-[-0.035em] text-tonal md:text-[60px]">
          Current module unavailable
        </h1>
        <p className="mt-5 max-w-md text-[15px] text-ink-secondary">
          Module preparation is restricted to dispatch and field operations roles.
        </p>
      </section>);

  }

  return (
    <section className="grid border-b border-line lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,0.95fr)]">
      <div className="px-5 py-10 md:px-10 md:py-14">
        <Annotation>NEW MISSION</Annotation>
        <h1 className="mt-8 font-display text-[44px] font-semibold leading-[0.95] tracking-[-0.035em] text-tonal md:text-[60px]">
          Select mission module
        </h1>
        <p className="mt-5 max-w-lg text-[15px] leading-relaxed text-ink-secondary">
          Choose the payload required for this flight. One drone can carry one module per mission.
        </p>

        <div className="mt-10 grid gap-3 md:grid-cols-2">
          {deployableModules.map((module) => {
            const config = moduleConfigs[module];
            const isSelected = selected === module;
            return (
              <button
                key={module}
                type="button"
                onClick={() => ops.actions.selectModule(module)}
                disabled={deploying || active}
                className={`min-h-[190px] border p-5 text-left transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-60 ${
                  isSelected ? 'border-ink-primary bg-surface-3/50' : 'border-line bg-surface-1/40 hover:border-line-strong hover:bg-surface-2/50'
                }`}>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[10px] tracking-widest2 text-ink-tertiary">PAYLOAD</span>
                  <StatusLabel value={isSelected ? 'SELECTED' : 'AVAILABLE'} tone={isSelected ? 'normal' : 'neutral'} className="text-[10px]" />
                </div>
                <div className="mt-8 font-display text-[28px] font-semibold leading-none tracking-[-0.02em] text-ink-primary">
                  {config.label}
                </div>
                <p className="mt-3 text-[13px] leading-snug text-ink-secondary">{modulePurpose[module].purpose}</p>
                <p className="mt-5 font-mono text-[9px] tracking-widest2 text-ink-tertiary">{modulePurpose[module].hardware}</p>
              </button>);

          })}
        </div>

        {selectedConfig &&
        <div className="mt-9 border-t border-line pt-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <Annotation>MISSION SETUP</Annotation>
                <p className="mt-3 font-display text-[28px] font-semibold tracking-[-0.02em] text-ink-primary">
                  {selectedConfig.label}
                </p>
              </div>
              <StatusLabel value={labelForStatus(ops.moduleStatus)} tone={ready || active ? 'normal' : deploying ? 'warning' : 'neutral'} className="text-[10px] tracking-widest2" />
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StepButton label="Attach Module" enabled={ops.moduleStatus === 'selected'} onClick={ops.actions.attachModule} />
              <StepButton label="Detect Module" enabled={ops.moduleStatus === 'attached'} onClick={ops.actions.detectModule} />
              <StepButton label="Pre-flight Check" enabled={ops.moduleStatus === 'detected'} onClick={ops.actions.runPreflight} />
              <StepButton label={`Deploy ${selectedConfig.shortLabel}`} enabled={ready} onClick={ops.actions.deployModule} emphasis />
            </div>

            {deploying &&
            <div className="mt-5 border border-accent-warning/50 bg-accent-warning/10 p-4">
                <div className="font-mono text-[10px] tracking-widest2 text-ink-primary">DEPLOYING MODULE</div>
                <p className="mt-2 text-[13px] text-ink-secondary">Mission Dock reports payload release in progress.</p>
                <button
                type="button"
                onClick={ops.actions.completeDeployment}
                className="mt-4 inline-flex h-10 items-center gap-3 border border-line-strong px-4 font-mono text-[10px] tracking-widest2 text-ink-primary hover:bg-surface-3">
                  CONFIRM ACTIVE
                  <ArrowRightIcon size={13} strokeWidth={1.5} />
                </button>
              </div>
            }

            {active &&
            <Link
              to="/live"
              className="mt-5 inline-flex h-10 items-center gap-3 border border-line-strong px-4 font-mono text-[10px] tracking-widest2 text-ink-primary hover:bg-surface-3">
                OPEN LIVE
                <ArrowRightIcon size={13} strokeWidth={1.5} />
              </Link>
            }
          </div>
        }
      </div>

      <aside className="border-t border-line bg-surface-1/35 px-5 py-10 md:px-10 lg:border-l lg:border-t-0">
        <Annotation>PRE-FLIGHT STATUS</Annotation>
        <div className="mt-7 grid gap-10">
          <StatusReadout title="DRONE" meta={droneId} rows={droneStatusRows(ops.drone)} />
          {selectedConfig ?
          <StatusReadout title="MODULE" meta={selectedConfig.shortLabel} rows={moduleStatusRows(ops.module, ops.devices)} /> :
          <StatusReadout title="MODULE" meta="NO ACTIVE MODULE" rows={[{ label: 'STATUS', value: 'WAITING FOR SELECTION' }]} />
          }
        </div>
      </aside>
    </section>);

}

function StepButton({ label, enabled, onClick, emphasis = false }: {label: string;enabled: boolean;onClick: () => void;emphasis?: boolean;}) {
  return (
    <button
      type="button"
      disabled={!enabled}
      onClick={onClick}
      className={`h-11 border px-3 font-mono text-[10px] tracking-widest2 transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-40 ${
        emphasis ? 'border-ink-primary bg-ink-primary text-surface-0 hover:opacity-90' : 'border-line-strong text-ink-primary hover:bg-surface-3'
      }`}>
      {label}
    </button>);

}

function labelForStatus(status: string) {
  switch (status) {
    case 'selected':
      return 'MODULE SELECTED';
    case 'attached':
      return 'MODULE ATTACHED';
    case 'detected':
      return 'MODULE DETECTED';
    case 'deployment-ready':
      return 'READY FOR DEPLOYMENT';
    case 'deploying':
      return 'DEPLOYING';
    case 'active':
      return 'ACTIVE';
    default:
      return 'WAITING FOR MODULE';
  }
}
