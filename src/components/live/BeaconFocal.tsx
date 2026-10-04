import React from 'react';
import { PulseDot } from '../PulseDot';
import { Annotation } from '../Annotation';
import { Viewfinder } from './Viewfinder';
import { SosControl } from './SosControl';
import { beaconFeedImage, beaconMessages, getCurrentMission, lastKnownTelemetryTime } from '../../data/missionData';
import { useOperations } from '../../contexts/OperationsContext';
import { formatCoordinates } from '../../utils/format';

/** Center column for an active Beacon mission: the live video is the focal point; SOS sits right beneath it. */
export function BeaconFocal() {
  const ops = useOperations();
  const { coordinates } = getCurrentMission('beacon');
  const overlay = 'absolute font-mono text-[10px] tracking-widest2 text-white/85';
  const offline = ops.signalCondition === 'offline';

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
            src={beaconFeedImage}
            alt="Live video from the drone of a resident signaling with an emergency beacon"
            className="absolute inset-0 h-full w-full object-cover" />
          
            <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/50" />
            <Viewfinder />
            <div className={`${overlay} left-6 top-6 flex items-center gap-2 md:left-8 md:top-8`}>
              <PulseDot tone="normal" />
              LIVE · BEACON
            </div>
            <div className={`${overlay} bottom-6 left-6 hidden sm:block md:bottom-8 md:left-8`}>
              {formatCoordinates(coordinates)}
            </div>
            <div className={`${overlay} bottom-6 right-6 md:bottom-8 md:right-8`}>GPS {ops.drone.gps}</div>
          </>
        }
      </figure>

      <div className="px-5 md:px-0">
        <div className="mt-6 md:mt-8">
          <SosControl />
        </div>

        <section className="mt-10">
          <Annotation>COMMUNICATION LOG</Annotation>
          <ol className="mt-4 divide-y divide-line border-b border-line">
            {beaconMessages.map((m) =>
            <li key={m.id} className="grid grid-cols-[52px_minmax(0,1fr)] gap-4 py-3.5">
                <span className="font-mono text-[11px] tabular-nums text-ink-tertiary">{m.time}</span>
                <div>
                  <div className="font-mono text-[9px] tracking-widest2 text-ink-secondary">{m.from}</div>
                  <p className="mt-1 text-[14px] leading-snug text-ink-primary">{m.text}</p>
                </div>
              </li>
            )}
          </ol>
        </section>
      </div>
    </div>);

}