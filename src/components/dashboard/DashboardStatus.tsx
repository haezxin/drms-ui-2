import React from 'react';
import { Annotation } from '../Annotation';
import { StatusReadout } from '../StatusReadout';
import { MetricRow } from '../live/MetricRow';
import { MissionHistory } from './MissionHistory';
import { useOperations } from '../../contexts/OperationsContext';
import { useSession } from '../../hooks/useSession';
import { droneId, moduleConfigs } from '../../data/missionData';
import { droneStatusRows, essentialStatusRows, moduleStatusRows } from '../../utils/status';

/** Lower Dashboard band — scoped to what each role needs from drone & module status. */
export function DashboardStatus() {
  const ops = useOperations();
  const { role, permissions } = useSession();
  const visibleModule = ops.activeModule ?? ops.selectedModule;
  const moduleLabel = visibleModule ? moduleConfigs[visibleModule].shortLabel : 'NO ACTIVE MODULE';
  const moduleRows = visibleModule ?
  moduleStatusRows(ops.module, [{ label: 'SENSOR', value: ops.module.sensor }]) :
  [{ label: 'STATUS', value: 'NO ACTIVE MODULE' }];

  if (role === 'responder') {
    return (
      <section className="border-t border-line px-5 py-10 md:px-10 md:py-12">
        <Annotation>SYSTEM STATUS</Annotation>
        <MetricRow
          size="md"
          className="mt-6 max-w-4xl"
          metrics={visibleModule ? essentialStatusRows(ops.drone, ops.module) : [
          { label: 'DRONE', value: ops.drone.connection },
          { label: 'BATTERY', value: ops.drone.battery === null ? 'NO DATA' : `${ops.drone.battery}%` },
          { label: 'SIGNAL', value: ops.drone.signal },
          { label: 'MODULE', value: 'NO ACTIVE MODULE' }]
          } />
      </section>);

  }

  const header =
  <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
      <Annotation>DRONE &amp; MODULE STATUS</Annotation>
    </div>;


  const drone = <StatusReadout title="DRONE" meta={droneId} rows={droneStatusRows(ops.drone)} />;
  const module =
  <StatusReadout
    title="MODULE"
    meta={moduleLabel}
    rows={moduleRows} />;



  if (!permissions.missionHistory) {
    return (
      <section className="border-t border-line px-5 py-10 md:px-10 md:py-12">
        {header}
        <div className="mt-6 grid max-w-5xl gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          {drone}
          {module}
          {permissions.deviceSummary &&
          <StatusReadout
            title={`${moduleLabel} DEVICES`}
            meta={ops.mission ? 'IN USE' : visibleModule ? labelForSetup(ops.moduleStatus) : 'STANDBY'}
            rows={ops.devices} />

          }
        </div>
      </section>);

  }

  return (
    <section className="grid border-t border-line lg:grid-cols-12">
      <div className="px-5 py-10 md:px-10 md:py-12 lg:col-span-7">
        {header}
        <div className="mt-6 grid gap-x-12 gap-y-10 sm:grid-cols-2">
          {drone}
          {module}
        </div>
      </div>
      <MissionHistory missions={ops.history} />
    </section>);

}

function labelForSetup(status: string) {
  if (status === 'deployment-ready') return 'READY';
  return status === 'none' ? 'STANDBY' : status.toUpperCase();
}
