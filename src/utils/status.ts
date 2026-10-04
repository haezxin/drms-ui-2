import type { DroneTelemetry, ModuleTelemetry, StatusRow, Tone } from '../types/mission';

const NORMAL = new Set(['ACTIVE', 'CONNECTED', 'GOOD', 'FIXED', 'STREAMING', 'READY', 'NOMINAL', 'AIRBORNE', 'LIVE', 'ONLINE']);
const WARNING = new Set([
'WEAK',
'ELEVATED',
'RISING',
'INCREASING',
'SEARCHING',
'ACQUIRING',
'RETURNING',
'NO DATA',
'DEGRADED',
'DELAYED']
);
const CRITICAL = new Set([
'LOST',
'FAULT',
'DISCONNECTED',
'OFFLINE',
'TRIGGERED',
'CRITICAL',
'NO SIGNAL',
'NO RECENT DATA',
'LINK LOST']
);

export function toneFor(value: string): Tone {
  const v = value.trim().toUpperCase();
  if (NORMAL.has(v)) return 'normal';
  if (WARNING.has(v)) return 'warning';
  if (CRITICAL.has(v)) return 'critical';
  return 'neutral';
}

export function batteryTone(pct: number): Tone {
  if (pct < 20) return 'critical';
  if (pct < 40) return 'warning';
  return 'neutral';
}

export function batteryRow(label: string, pct: number | null | undefined): StatusRow {
  if (pct === null || pct === undefined) return { label, value: 'NO DATA' };
  return { label, value: `${pct}%`, tone: batteryTone(pct) };
}

export const toneDotClass: Record<Tone, string> = {
  normal: 'bg-accent-normal',
  warning: 'bg-accent-warning',
  critical: 'bg-accent-critical',
  info: 'bg-accent-info',
  neutral: 'bg-ink-tertiary'
};

export const toneTextClass: Record<Tone, string> = {
  normal: 'text-ink-primary',
  warning: 'text-ink-primary',
  critical: 'text-accent-critical',
  info: 'text-ink-primary',
  neutral: 'text-ink-primary'
};

export function droneStatusRows(d: DroneTelemetry): StatusRow[] {
  return [
  batteryRow('BATTERY', d.battery),
  { label: 'GPS', value: d.gps },
  { label: 'LINK', value: d.signal },
  { label: 'STATUS', value: d.connection },
  { label: 'FLIGHT', value: d.flightStatus }];

}

export function moduleStatusRows(m: ModuleTelemetry, extra: StatusRow[] = []): StatusRow[] {
  return [
  { label: 'CONNECTION', value: m.connection },
  { label: 'ESP32', value: m.esp32 },
  { label: 'LORA', value: m.lora },
  batteryRow('BATTERY', m.battery),
  ...extra];

}

/** Plain operational health for roles that don't need engineering diagnostics. */
export function essentialStatusRows(d: DroneTelemetry, m: ModuleTelemetry): StatusRow[] {
  return [
  { label: 'DRONE', value: d.connection },
  batteryRow('BATTERY', d.battery),
  { label: 'SIGNAL', value: d.signal },
  { label: 'GPS', value: d.gps },
  { label: 'MODULE', value: m.connection }];

}