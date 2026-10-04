import React from 'react';
import { PulseDot } from '../PulseDot';
import { Annotation } from '../Annotation';
import { MetricRow } from './MetricRow';
import { Viewfinder } from './Viewfinder';
import { fireFeedImage, fireReading, droneTelemetry, getCurrentMission, lastKnownTelemetryTime } from '../../data/missionData';
import { useOperations } from '../../contexts/OperationsContext';
import { formatCoordinates, formatHeading } from '../../utils/format';
import type { Detection } from '../../types/mission';

interface FireFocalProps {
  detections: Detection[];
  /** Dispatcher / Field Operator see detection confidence and ML state; Responder sees detection state only. */
  detailed: boolean;
}

export function FireFocal({ detections, detailed }: FireFocalProps) {
  const ops = useOperations();
  const { coordinates } = getCurrentMission('fire');
  const overlay = 'absolute font-mono text-[10px] tracking-widest2 text-white/85';
  const offline = ops.signalCondition === 'offline';
  const mlActive = ops.missionActive && ops.activeModule === 'fire' && !offline &&
    ops.devices.some((device) => device.label === 'ML MODEL' && device.value === 'ACTIVE');
  const detectionGroups = detections.reduce((groups, detection) => {
    groups.set(detection.label, (groups.get(detection.label) ?? 0) + 1);
    return groups;
  }, new Map<string, number>());
  const showDetectionAlert = mlActive && detections.length > 0;

  return (
    <div className="w-full">
      <figure className="relative aspect-video w-full overflow-hidden bg-surface-2 md:rounded-md md:border md:border-line">
        {offline ?
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 px-6 text-center">
            <span className="font-mono text-[11px] tracking-widest2 text-ink-secondary">CAMERA UNAVAILABLE</span>
            <span className="font-mono text-[10px] tracking-wide text-ink-tertiary">LAST SIGNAL {lastKnownTelemetryTime}</span>
          </div> :

        <>
            <img
            src={fireFeedImage}
            alt="Live thermal camera feed from the drone showing active flame sources and smoke"
            className="absolute inset-0 h-full w-full object-cover" />
          
            <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/35 via-transparent to-black/50" />
            <Viewfinder />

            {detections.map((d) =>
          <div
            key={d.id}
            className="absolute border border-accent-critical"
            style={{ left: `${d.x}%`, top: `${d.y}%`, width: `${d.w}%`, height: `${d.h}%` }}>
            
                <span className="absolute -left-px -top-[19px] whitespace-nowrap bg-surface-0/80 px-1.5 py-[2px] font-mono text-[9px] tracking-wide text-accent-critical">
                  {d.code} · {Math.round(d.confidence * 100)}%
                </span>
              </div>
          )}

            <div className={`${overlay} left-6 top-6 flex items-center gap-2 md:left-8 md:top-8`}>
              <PulseDot tone="critical" />
              REC · THERMAL
            </div>
            <div className={`${overlay} right-6 top-6 md:right-8 md:top-8`}>30 FPS · IR</div>
            <div className={`${overlay} bottom-6 left-6 hidden sm:block md:bottom-8 md:left-8`}>
              {formatCoordinates(coordinates)}
            </div>
            <div className={`${overlay} bottom-6 right-6 md:bottom-8 md:right-8`}>
              ALT {droneTelemetry.altitude} M · HDG {formatHeading(droneTelemetry.heading)}
            </div>
          </>
        }
        <figcaption className="sr-only">Live thermal feed with {detections.length} AI detections</figcaption>
      </figure>

      <div className="px-5 md:px-0">
        <MetricRow
          className="mt-6 md:mt-8"
          metrics={[
          { label: 'FIRE DETECTED', value: fireReading.fireDetected ? 'YES' : 'NO', tone: fireReading.fireDetected ? 'critical' : 'normal' },
          { label: 'SMOKE DETECTED', value: fireReading.smokeDetected ? 'YES' : 'NO', tone: fireReading.smokeDetected ? 'warning' : 'normal' },
          ...(detailed ?
          [
          { label: 'CONFIDENCE', value: String(fireReading.confidence), unit: '%', tone: 'neutral' as const },
          { label: 'ML STATUS', value: offline ? 'UNAVAILABLE' : 'ACTIVE', tone: offline ? 'critical' as const : 'normal' as const }] :

          []),
          { label: 'CAMERA STATUS', value: offline ? 'UNAVAILABLE' : 'STREAMING', tone: offline ? 'critical' : 'normal' }]
          } />

        {showDetectionAlert && (
          <div role="alert" className="mt-6 border border-accent-critical/40 border-l-2 bg-surface-1 px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <PulseDot tone="critical" />
                <span className="font-mono text-[10px] tracking-widest2 text-accent-critical">ML DETECTION ALERT</span>
              </div>
              <span className="font-mono text-[9px] tracking-widest2 text-ink-tertiary">
                {detections.length} {detections.length === 1 ? 'DETECTION' : 'DETECTIONS'}
              </span>
            </div>
            <p className="mt-2 pl-[21px] text-[13px] leading-snug text-ink-primary">
              Detecting:{' '}
              {Array.from(detectionGroups).map(([label, count], index) => (
                <React.Fragment key={label}>
                  {index > 0 && <span className="text-ink-tertiary"> · </span>}
                  {label}{count > 1 ? ` x${count}` : ''}
                </React.Fragment>
              ))}
            </p>
          </div>
        )}

        <section className="mt-8 md:mt-10" style={{ backgroundColor: 'transparent', boxShadow: 'none' }}>
          <Annotation>CURRENT DETECTIONS</Annotation>
          <ol className="mt-4 divide-y divide-line border-b border-line">
            {detections.map((d) =>
            <li key={d.id} className="grid grid-cols-[52px_minmax(0,1fr)_auto] items-baseline gap-4 py-3.5">
                <span className="font-mono text-[11px] text-ink-tertiary">{d.code}</span>
                <div className="min-w-0">
                  <div className="text-[14px] text-ink-primary">{d.label}</div>
                  <div className="mt-0.5 truncate font-mono text-[10px] tracking-wide text-ink-tertiary">{d.sector}</div>
                </div>
                <span className="font-display text-[20px] font-semibold tabular-nums tracking-[-0.01em] text-ink-primary">
                  {Math.round(d.confidence * 100)}
                  <span className="ml-0.5 text-[12px] text-ink-tertiary">%</span>
                </span>
              </li>
            )}
          </ol>
        </section>
      </div>
    </div>);

}
