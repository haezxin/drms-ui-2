import React, { useState } from 'react';
import { PageHeader } from '../components/layout/PageHeader';
import { TelemetryNotice } from '../components/TelemetryNotice';
import { MissionBriefing } from '../components/dashboard/MissionBriefing';
import { StandbyBriefing } from '../components/dashboard/StandbyBriefing';
import { DashboardStatus } from '../components/dashboard/DashboardStatus';
import { MissionSetup } from '../components/dashboard/MissionSetup';
import { useOperations } from '../contexts/OperationsContext';
import { useSession } from '../hooks/useSession';

export function Dashboard() {
  const ops = useOperations();
  const { can } = useSession();
  const [acknowledgedId, setAcknowledgedId] = useState<string | null>(null);

  return (
    <div className="w-full">
      <PageHeader section="OVERVIEW" />
      <TelemetryNotice condition={ops.signalCondition} className="mx-5 mt-8 md:mx-10" />
      {ops.mission ?
      <MissionBriefing
        mission={ops.mission}
        acknowledgeable={can('alerts.acknowledge')}
        acknowledged={ops.alert?.id === acknowledgedId}
        onAcknowledge={() => ops.alert && setAcknowledgedId(ops.alert.id)} /> :
      ops.missionStatus !== 'none' && ops.missionStatus !== 'completed' ?
      <MissionSetup /> :


      <StandbyBriefing />
      }
      <DashboardStatus />
    </div>);

}
