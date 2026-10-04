import React, { useState } from 'react';
import { Annotation } from '../Annotation';
import { StatusLabel } from '../StatusLabel';
import { AudioActivity } from './AudioActivity';
import { PushToTalk } from './PushToTalk';
import { useOperations } from '../../contexts/OperationsContext';
import { useSession } from '../../hooks/useSession';
import { beaconState } from '../../data/missionData';
import type { Tone } from '../../types/mission';

/** Live connection state for the Beacon link — derived from the one module's telemetry, never invented. */
function linkState(connection: string, lora: string, offline: boolean): {label: string;tone: Tone;} {
  if (offline) return { label: 'DISCONNECTED', tone: 'critical' };
  if (connection !== 'CONNECTED') return { label: 'CONNECTING', tone: 'warning' };
  if (lora === 'WEAK') return { label: 'CONNECTING', tone: 'warning' };
  return { label: 'CONNECTED', tone: 'normal' };
}

/** The dedicated DRMS ↔ Beacon communication console — Push-to-Talk is the strongest control on Live. */
export function CommunicationPanel() {
  const ops = useOperations();
  const { config, permissions } = useSession();
  const [transmitting, setTransmitting] = useState(false);
  const offline = ops.signalCondition === 'offline';
  const link = linkState(ops.module.connection, ops.module.lora, offline);
  const detailed = permissions.technicalDetail === 'expanded';

  return (
    <div>
      <div className="flex items-center justify-between gap-4">
        <Annotation>COMMUNICATION</Annotation>
        <StatusLabel value={link.label} tone={link.tone} pulse={link.tone === 'normal'} className="text-[10px] tracking-widest2" />
      </div>

      <div className="mt-5">
        <AudioActivity active={transmitting} />
        <div className="mt-2 text-center font-mono text-[9px] tracking-widest2 text-ink-tertiary">
          {transmitting ? 'OUTGOING AUDIO' : 'NO ACTIVE TRANSMISSION'}
        </div>
      </div>

      {detailed &&
      <div className="mt-5 grid grid-cols-2 gap-x-6 gap-y-3">
          <div>
            <div className="mb-1 font-mono text-[9px] tracking-widest2 text-ink-tertiary">MICROPHONE</div>
            <StatusLabel value={offline ? 'UNAVAILABLE' : 'READY'} className="text-[12px]" />
          </div>
          <div>
            <div className="mb-1 font-mono text-[9px] tracking-widest2 text-ink-tertiary">SPEAKER</div>
            <StatusLabel value={offline ? 'UNAVAILABLE' : 'CONNECTED'} className="text-[12px]" />
          </div>
        </div>
      }

      <div className="mt-6">
        <PushToTalk disabled={offline} onActiveChange={setTransmitting} />
        <div className="mt-3 h-[14px]">
          {transmitting &&
          <StatusLabel value={`${config.shortLabel} · TRANSMITTING`} tone="critical" pulse className="text-[10px] tracking-widest2" />
          }
        </div>
      </div>

      <div className="mt-2 flex items-center justify-between border-t border-line pt-4">
        <span className="font-mono text-[10px] tracking-widest2 text-ink-tertiary">COMMUNICATION LINK</span>
        <StatusLabel value={offline ? 'NO SIGNAL' : ops.module.lora} className="text-[11px]" />
      </div>
      <div className="mt-2.5 flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-widest2 text-ink-tertiary">LAST TRANSMISSION</span>
        <span className="font-mono text-[11px] tabular-nums text-ink-primary">{beaconState.lastTransmission}</span>
      </div>
    </div>);

}