import React from 'react';
import { StatusLabel } from './StatusLabel';
import { useSession } from '../hooks/useSession';
import { lastKnownTelemetryTime } from '../data/missionData';
import type { SignalCondition } from '../types/mission';

// Field Operator / Dispatcher get the diagnostic reading. Responder gets plain operational language —
// per role, "the message should explain the operational state" without exposing engineering detail.
const technicalCopy = {
  degraded: { label: 'LORA — WEAK', detail: 'GPS is re-acquiring. Telemetry — delayed, last update 18 sec ago.' },
  offline: {
    label: 'LORA — NO SIGNAL',
    detail: 'Telemetry — No Recent Data. Last known values shown below are not live.'
  }
};

const plainCopy = {
  degraded: { label: 'CONNECTION DEGRADED', detail: 'Signal is weak. Information below may be delayed.' },
  offline: {
    label: 'CONNECTION UNAVAILABLE',
    detail: `Latest telemetry received: ${lastKnownTelemetryTime}.`
  }
};

/** Explains the communication state so stale data is never mistaken for live data. */
export function TelemetryNotice({ condition, className = '' }: {condition: SignalCondition;className?: string;}) {
  const { role } = useSession();
  if (condition === 'nominal') return null;

  const offline = condition === 'offline';
  const c = (role === 'responder' ? plainCopy : technicalCopy)[condition];

  return (
    <div
      role="status"
      className={`border-l-2 py-0.5 pl-4 ${offline ? 'border-accent-critical' : 'border-accent-warning'} ${className}`}>
      
      <StatusLabel value={c.label} tone={offline ? 'critical' : 'warning'} className="text-[10px] tracking-widest2" />
      <p className="mt-1.5 max-w-xl text-[13px] leading-snug text-ink-secondary">{c.detail}</p>
    </div>);

}