import {
  droneTelemetry,
  getCurrentMission,
  getMapEntities,
  getMissionHistory,
  getPrimaryAlert,
  lastTelemetryUpdate,
  moduleDevices,
  moduleTelemetry } from
'../data/missionData';
import type {
  DroneTelemetry,
  MissionCommandActions,
  MissionStatus,
  ModuleTelemetry,
  ModuleLifecycleStatus,
  ModuleType,
  OperationsSnapshot,
  SignalCondition,
  StatusRow,
  TelemetryState } from
'../types/mission';

interface BuildOperationsArgs {
  activeModule: ModuleType | null;
  selectedModule: Extract<ModuleType, 'fire' | 'flood'> | null;
  moduleStatus: ModuleLifecycleStatus;
  missionStatus: MissionStatus;
  signalCondition: SignalCondition;
  lastModule: Extract<ModuleType, 'fire' | 'flood'>;
  actions: MissionCommandActions;
}

/** Derives the full operational state for the one drone + one module from mission and link condition. */
export function buildOperations({
  activeModule,
  selectedModule,
  moduleStatus,
  missionStatus,
  signalCondition,
  lastModule,
  actions
}: BuildOperationsArgs): OperationsSnapshot {
  const missionActive = missionStatus === 'active';
  const confirmedMission = missionActive && Boolean(activeModule);
  const currentModule = activeModule ?? selectedModule;
  const mission = missionActive && activeModule ? getCurrentMission(activeModule) : null;
  const history = getMissionHistory(activeModule ?? selectedModule ?? lastModule, missionActive);

  let drone: DroneTelemetry = missionActive ?
  { ...droneTelemetry } :
  { ...droneTelemetry, battery: 96, flightStatus: 'LANDED', altitude: 0, speed: 0 };
  let module: ModuleTelemetry = currentModule ?
  { ...moduleTelemetry[currentModule], sensor: moduleStatus === 'active' ? 'ACTIVE' : moduleStatus === 'ready' || moduleStatus === 'deployment-ready' ? 'READY' : 'IDLE' } :
  { connection: 'NO DATA', esp32: 'NO DATA', lora: 'NO SIGNAL', sensor: 'IDLE' };
  let devices: StatusRow[] = currentModule ?
  moduleDevices[currentModule].map((d) => ({ ...d, value: missionActive ? d.value : moduleStatus === 'ready' || moduleStatus === 'deployment-ready' ? 'READY' : moduleStatus === 'detected' || moduleStatus === 'connected' ? 'DETECTED' : 'NOT TESTED', tone: 'neutral' as const })) :
  [];
  let telemetry: TelemetryState = missionActive ?
  { label: lastTelemetryUpdate, tone: 'normal', live: true } :
  { label: 'NO ACTIVE TELEMETRY', tone: 'neutral', live: false };

  if (signalCondition === 'degraded') {
    drone = { ...drone, signal: 'WEAK', gps: 'SEARCHING' };
    module = { ...module, lora: 'WEAK' };
    telemetry = { label: '18 SEC AGO', tone: 'warning', live: true };
  }

  if (signalCondition === 'offline') {
    // Never present stale values as live: unknown readings become NO DATA.
    drone = { ...drone, battery: null, signal: 'LOST', gps: 'ACQUIRING', connection: 'DISCONNECTED' };
    module = { ...module, connection: 'NO DATA', esp32: 'NO DATA', lora: 'NO SIGNAL', battery: undefined, sensor: 'NO DATA' };
    devices = devices.map((d) => ({ label: d.label, value: 'UNAVAILABLE' }));
    telemetry = { label: 'NO RECENT DATA', tone: 'critical', live: false };
  }

  return {
    activeModule,
    selectedModule,
    moduleStatus,
    missionStatus,
    missionActive,
    signalCondition,
    mission,
    lastMission: mission ?? history[0],
    history,
    drone,
    module,
    devices,
    telemetry,
    alert: mission && activeModule ? getPrimaryAlert(activeModule) : undefined,
    mapEntities: confirmedMission && activeModule ? getMapEntities(activeModule) : [],
    actions
  };
}
