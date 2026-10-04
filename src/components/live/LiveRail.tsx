import React from 'react';
import { Annotation } from '../Annotation';
import { AlertNotice } from '../AlertNotice';
import { CommunicationPanel } from './CommunicationPanel';
import { Disclosure } from '../Disclosure';
import { StatusLabel } from '../StatusLabel';
import { StatusReadout } from '../StatusReadout';
import { useOperations } from '../../contexts/OperationsContext';
import { useSession } from '../../hooks/useSession';
import { droneId, moduleConfigs } from '../../data/missionData';
import { droneStatusRows, essentialStatusRows, moduleStatusRows } from '../../utils/status';

const sectionPad = 'px-5 md:px-8';

interface LiveRailProps {
  alertProps?: {acknowledgeable?: boolean;acknowledged?: boolean;onAcknowledge?: () => void;};
}

export function LiveRail({ alertProps }: LiveRailProps) {
  const ops = useOperations();
  const { permissions } = useSession();
  const config = moduleConfigs[ops.activeModule];
  const collapsed = permissions.technicalDetail === 'collapsed';
  const isBeacon = ops.activeModule === 'beacon';

  const droneReadout = <StatusReadout title="DRONE" meta={droneId} rows={droneStatusRows(ops.drone)} />;
  const moduleReadout =
  <StatusReadout title="MODULE" meta={config.shortLabel} rows={moduleStatusRows(ops.module, ops.devices)} />;


  const hardwareDetail =
  <>
      {droneReadout}
      {moduleReadout}
    </>;


  return (
    <aside aria-label="Live system status" className="border-t border-line bg-surface-1/50 lg:border-l lg:border-t-0">
      {ops.alert &&
      <section className={`hidden border-b border-line py-6 lg:block ${sectionPad}`}>
          <Annotation>CURRENT ALERT</Annotation>
          <AlertNotice alert={ops.alert} className="mt-4" {...alertProps} />
        </section>
      }

      {isBeacon &&
      <section className={`border-b border-line py-6 ${sectionPad}`}>
          <CommunicationPanel />
        </section>
      }

      {isBeacon ?
      <div className={`border-b border-line ${sectionPad}`}>
          <Disclosure label="HARDWARE STATUS">
            <div className="space-y-8 pb-6 pt-2">{hardwareDetail}</div>
          </Disclosure>
        </div> :
      collapsed ?
      <>
          <section className={`border-b border-line py-6 ${sectionPad}`}>
            <StatusReadout title="ESSENTIAL STATUS" rows={essentialStatusRows(ops.drone, ops.module)} />
          </section>
          <div className={`border-b border-line ${sectionPad}`}>
            <Disclosure label="TECHNICAL DETAILS">
              <div className="space-y-8 pb-6 pt-2">{hardwareDetail}</div>
            </Disclosure>
          </div>
        </> :

      <>
          <section className={`border-b border-line py-6 ${sectionPad}`}>{droneReadout}</section>
          <section className={`border-b border-line py-6 ${sectionPad}`}>{moduleReadout}</section>
        </>
      }

      <div className={`flex items-center justify-between gap-4 py-5 ${sectionPad}`}>
        <Annotation as="span">LAST TELEMETRY</Annotation>
        <StatusLabel
          value={ops.telemetry.label}
          tone={ops.telemetry.tone}
          pulse={ops.telemetry.live}
          className="text-[10px] tracking-widest2" />
        
      </div>
    </aside>);

}