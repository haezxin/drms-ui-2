import type {
  Mission,
  DroneTelemetry,
  ModuleTelemetry,
  StatusRow,
  Detection,
  Alert,
  MapEntity,
  ModuleConfig,
  ModuleType } from
'../types/mission';

// Simulated demo data — these missions do not represent real or ongoing incidents.

export const fireFeedImage = "/00264d42-6bc2-45b3-8b77-0f366e538d93.jpg";

export const beaconFeedImage = "/545c2d6f-9651-494e-a1de-eeefc97fdb63.jpg";


export const moduleConfigs: Record<ModuleType, ModuleConfig> = {
  fire: { type: 'fire', label: 'FIRE', shortLabel: 'FIRE', tagline: 'Machine learning · fire & smoke detection' },
  flood: { type: 'flood', label: 'FLOOD', shortLabel: 'FLOOD', tagline: 'Pressure sensor · water level' },
  beacon: { type: 'beacon', label: 'EMERGENCY BEACON', shortLabel: 'BEACON', tagline: 'Live video · two-way audio' }
};

type MissionSite = Omit<Mission, 'id' | 'state' | 'date'>;

const missionSites: Record<ModuleType, MissionSite> = {
  fire: {
    module: 'fire',
    title: 'FIRE ASSESSMENT',
    barangay: 'Barangay Bagong Silang',
    city: 'Caloocan City',
    province: 'Metro Manila',
    region: 'NCR',
    startedAt: '14:22 PHT',
    elapsed: '00:46:12',
    summary:
    'Residential fire reported near Package 6. Thermal sweep confirms two active flame sources; ground teams deployed to the adjacent block.',
    coordinates: { lat: 14.7392, lng: 121.0198 }
  },
  flood: {
    module: 'flood',
    title: 'FLOOD ASSESSMENT',
    barangay: 'Barangay Tumana',
    city: 'Marikina City',
    province: 'Metro Manila',
    region: 'NCR',
    startedAt: '06:42 PHT',
    elapsed: '01:18:36',
    summary:
    'Water along the Marikina River tributary continues to rise after sustained rainfall. Monitoring street-level depth near residential blocks.',
    coordinates: { lat: 14.6449, lng: 121.1029 }
  },
  beacon: {
    module: 'beacon',
    title: 'EMERGENCY BEACON',
    barangay: 'Barangay Minuyan',
    city: 'San Jose del Monte',
    province: 'Bulacan',
    region: 'Central Luzon',
    startedAt: '16:05 PHT',
    elapsed: '00:22:08',
    summary:
    'Beacon activated by an isolated resident after flash flooding. Drone on station to hold visual and voice contact until ground teams arrive.',
    coordinates: { lat: 14.8136, lng: 121.0453 }
  }
};

const historyOrder: ModuleType[] = ['fire', 'flood', 'beacon'];
const historyDates = ['29 SEP 2026', '21 SEP 2026'];

/** The single mission that owns the drone's current module. */
export function getCurrentMission(activeModule: ModuleType): Mission {
  return { ...missionSites[activeModule], id: 'DR-024', state: 'active', date: '02 OCT 2026' };
}

/**
 * Completed missions, newest first — never simultaneously active.
 * With no active mission, the module's own mission becomes the most recent completed one.
 */
export function getMissionHistory(activeModule: ModuleType, missionActive: boolean): Mission[] {
  const previous: Mission[] = historyOrder.
  filter((m) => m !== activeModule).
  map((m, i) => ({
    ...missionSites[m],
    id: `DR-0${23 - i}`,
    state: 'completed' as const,
    date: historyDates[i]
  }));
  if (missionActive) return previous;
  return [{ ...missionSites[activeModule], id: 'DR-024', state: 'completed', date: '02 OCT 2026' }, ...previous];
}

/** Drone parked at base with no mission — the only entity on the map. */
export const standbyMapEntities: MapEntity[] = [
{ id: 'drone', kind: 'drone', x: 50, y: 50, heading: 0, label: 'DRONE', sublabel: 'STANDBY · BASE' }];


export const droneTelemetry: DroneTelemetry = {
  battery: 74,
  gps: 'FIXED',
  signal: 'GOOD',
  connection: 'CONNECTED',
  flightStatus: 'AIRBORNE',
  altitude: 142,
  speed: 8.4,
  heading: 36
};

export const droneId = 'DRMS-01';
export const lastTelemetryUpdate = '2 SEC AGO';
/** Absolute time of the last known reading — used for plain-language offline copy. */
export const lastKnownTelemetryTime = '22:41:07 PHT';
export const droneToModuleDistance = 180;

export const moduleTelemetry: Record<ModuleType, ModuleTelemetry> = {
  fire: { connection: 'CONNECTED', esp32: 'CONNECTED', lora: 'GOOD', battery: 61, sensor: 'ACTIVE' },
  flood: { connection: 'CONNECTED', esp32: 'CONNECTED', lora: 'GOOD', battery: 58, sensor: 'ACTIVE' },
  beacon: { connection: 'CONNECTED', esp32: 'CONNECTED', lora: 'GOOD', battery: 67, sensor: 'ACTIVE' }
};

/** Module-specific devices — only what is needed to operate the current mission. */
export const moduleDevices: Record<ModuleType, StatusRow[]> = {
  fire: [
  { label: 'CAMERA', value: 'STREAMING' },
  { label: 'ML MODEL', value: 'ACTIVE' }],

  flood: [{ label: 'PRESSURE SENSOR', value: 'ACTIVE' }],
  beacon: [
  { label: 'CAMERA', value: 'CONNECTED' },
  { label: 'MICROPHONE', value: 'READY' },
  { label: 'SPEAKER', value: 'CONNECTED' },
  { label: 'SOS', value: 'ARMED', tone: 'critical' }]

};

export const fireReading = { fireDetected: true, smokeDetected: true, confidence: 94 };

export const detections: Detection[] = [
{ id: 'd1', code: 'D-01', label: 'Active flame', sector: 'NE · 40 M FROM ROAD', confidence: 0.94, x: 42, y: 36, w: 14, h: 10 },
{ id: 'd2', code: 'D-02', label: 'Active flame', sector: 'E · ROOFLINE', confidence: 0.87, x: 61, y: 50, w: 10, h: 8 },
{ id: 'd3', code: 'D-03', label: 'Smoke plume', sector: 'SW · DRIFTING NE', confidence: 0.72, x: 23, y: 62, w: 18, h: 12 }];


export const floodReading = {
  waterLevel: 1.42,
  trend: 'RISING',
  rateCmPerHr: 3.2,
  condition: 'CHEST-DEEP',
  advisoryLevel: 0.8,
  criticalLevel: 1.5,
  gaugeMax: 2.5
};

/** State for the Emergency Beacon communication panel — connection state itself derives from module telemetry. */
export const beaconState = { lastTransmission: '22:41:07 PHT', latencyMs: 220 };

export const beaconMessages = [
{ id: 'm1', from: 'FIELD', text: 'Two residents on the roof, requesting rescue boat.', time: '16:09' },
{ id: 'm2', from: 'BASE', text: 'Copy. Ground team dispatched, ETA 11 minutes.', time: '16:11' },
{ id: 'm3', from: 'FIELD', text: 'Holding position at the beacon. Water still rising.', time: '16:14' }];


const alertsByModule: Record<ModuleType, Alert[]> = {
  fire: [
  {
    id: 'fire-a1',
    level: 'critical',
    message: 'Flame front spreading toward the Package 6 access road — 2 confirmed detections.',
    timestamp: '2 min ago'
  }],

  flood: [
  {
    id: 'flood-a1',
    level: 'critical',
    message: 'Water level above advisory threshold near the Brgy. Tumana evacuation route.',
    timestamp: '4 min ago'
  }],

  beacon: [
  {
    id: 'beacon-a1',
    level: 'critical',
    message: 'SOS armed — awaiting ground team confirmation at Brgy. Minuyan.',
    timestamp: '1 min ago'
  }]

};

export function getPrimaryAlert(module: ModuleType): Alert | undefined {
  const alerts = alertsByModule[module];
  return alerts.find((a) => a.level === 'critical') ?? alerts[0];
}

/** Only the drone and the active module are ever placed on the map. */
export function getMapEntities(activeModule: ModuleType): MapEntity[] {
  const site = missionSites[activeModule];
  return [
  {
    id: 'drone',
    kind: 'drone',
    x: 42,
    y: 38,
    heading: droneTelemetry.heading,
    label: 'DRONE',
    sublabel: `ALT ${droneTelemetry.altitude} M`
  },
  {
    id: 'module',
    kind: 'module',
    x: 60,
    y: 60,
    label: `${moduleConfigs[activeModule].shortLabel} MODULE`,
    sublabel: site.barangay.replace('Barangay ', 'BRGY. ').toUpperCase()
  }];

}