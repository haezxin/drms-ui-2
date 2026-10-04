export type ModuleType = 'fire' | 'flood' | 'beacon';
export type MissionState = 'active' | 'completed';
export type MissionStatus = 'none' | 'draft' | 'preparing' | 'ready' | 'deploying' | 'active' | 'completed' | 'cancelled' | 'fault';
export type ModuleLifecycleStatus =
'none' |
'available' |
'selected' |
'waiting' |
'attaching' |
'attached' |
'detected' |
'connected' |
'ready' |
'deployment-ready' |
'deploying' |
'deployed' |
'active' |
'inactive' |
'disconnected' |
'fault';
export type LinkState = 'GOOD' | 'WEAK' | 'LOST' | 'NO SIGNAL';
export type ConnectionState = 'CONNECTED' | 'DISCONNECTED' | 'NO DATA';
export type GpsState = 'FIXED' | 'SEARCHING' | 'ACQUIRING' | 'LOST';
export type SignalCondition = 'nominal' | 'degraded' | 'offline';
export type AlertLevel = 'critical' | 'warning' | 'info';
export type Tone = 'normal' | 'warning' | 'critical' | 'info' | 'neutral';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface Mission {
  id: string;
  module: ModuleType;
  title: string;
  barangay: string;
  city: string;
  province: string;
  region: string;
  state: MissionState;
  date: string;
  startedAt: string;
  elapsed: string;
  summary: string;
  coordinates: Coordinates;
}

export interface DroneTelemetry {
  /** null when no recent telemetry is available. */
  battery: number | null;
  gps: GpsState;
  signal: LinkState;
  connection: ConnectionState;
  flightStatus: 'AIRBORNE' | 'LANDED' | 'RETURNING';
  altitude: number;
  speed: number;
  heading: number;
}

export interface ModuleTelemetry {
  connection: ConnectionState;
  esp32: ConnectionState;
  lora: LinkState;
  battery?: number;
  sensor: 'ACTIVE' | 'READY' | 'DETECTED' | 'IDLE' | 'FAULT' | 'NO DATA';
}

export interface StatusRow {
  label: string;
  value: string;
  tone?: Tone;
}

export interface Detection {
  id: string;
  code: string;
  label: string;
  sector: string;
  confidence: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Alert {
  id: string;
  level: AlertLevel;
  message: string;
  timestamp: string;
}

export interface MapEntity {
  id: string;
  kind: 'drone' | 'module';
  x: number;
  y: number;
  label?: string;
  sublabel?: string;
  heading?: number;
}

export interface ModuleConfig {
  type: ModuleType;
  label: string;
  shortLabel: string;
  tagline: string;
}

export interface TelemetryState {
  label: string;
  tone: Tone;
  live: boolean;
}

export interface MissionCommandActions {
  startMission: () => void;
  selectModule: (module: Extract<ModuleType, 'fire' | 'flood'>) => void;
  attachModule: () => void;
  detectModule: () => void;
  runPreflight: () => void;
  deployModule: () => void;
  completeDeployment: () => void;
  endMission: () => void;
  cancelMission: () => void;
}

/** Everything the UI needs about the one drone and its one module, right now. */
export interface OperationsSnapshot {
  activeModule: ModuleType | null;
  selectedModule: Extract<ModuleType, 'fire' | 'flood'> | null;
  moduleStatus: ModuleLifecycleStatus;
  missionStatus: MissionStatus;
  missionActive: boolean;
  signalCondition: SignalCondition;
  mission: Mission | null;
  lastMission: Mission;
  history: Mission[];
  drone: DroneTelemetry;
  module: ModuleTelemetry;
  devices: StatusRow[];
  telemetry: TelemetryState;
  alert: Alert | undefined;
  mapEntities: MapEntity[];
  actions: MissionCommandActions;
}
