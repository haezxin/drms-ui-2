export type Role = 'dispatcher' | 'operator' | 'responder';

export interface User {
  username: string;
  name: string;
  role: Role;
  /** True for development demo accounts — never production credentials. */
  demo: boolean;
}

export interface DemoAccount {
  username: string;
  password: string;
  name: string;
  role: Role;
}

export interface RoleConfig {
  role: Role;
  label: string;
  shortLabel: string;
  purpose: string;
  emptyState: {title: string;detail: string;};
}

export interface RolePermissions {
  /** Mission records on the Dashboard. */
  missionHistory: boolean;
  /** Whether engineering readouts (ESP32, LoRa diagnostics) are open or tucked behind a disclosure. */
  technicalDetail: 'expanded' | 'collapsed';
  /** Module device column on the Dashboard. */
  deviceSummary: boolean;
}

export type LoginResult = {ok: true;} | {ok: false;error: string;};

/**
 * Capabilities that gate an actual action in this prototype. Many rows of the full role/permission
 * matrix (user management, mission creation, exports, editing telemetry or ML results, deleting
 * records) have no corresponding UI yet — per the product rule, we do not build screens for
 * capabilities the system doesn't implement, but the matrix below still records the intended
 * authorization for when those screens exist.
 */
export type Capability =
'dashboard.view' |
'live.view' |
'map.view' |
'hardware.view' |
'mission.create' |
'mission.assign' |
'missionLogs.full' |
'alerts.acknowledge' |
'alerts.manage' |
'module.deploy' |
'drone.operate' |
'beacon.communicate' |
'export' |
'users.manage' |
'roles.manage' |
'telemetry.edit' |
'ml.edit' |
'records.delete';

export type CapabilityMatrix = Record<Role, Record<Capability, boolean>>;