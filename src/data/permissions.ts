import type { Capability, CapabilityMatrix, Role } from '../types/auth';

/**
 * The DRMS role/permission matrix. Every role can reach every screen (Dashboard, Live, Map,
 * Hardware) — access control here is about what a role can DO, not which pages exist. The UI
 * enforces this by checking `can()` before rendering or running a restricted action, never by
 * silently hiding a control that would otherwise still work.
 */
const matrix: CapabilityMatrix = {
  dispatcher: {
    'dashboard.view': true,
    'live.view': true,
    'map.view': true,
    'hardware.view': true,
    'mission.create': true,
    'mission.assign': true,
    'missionLogs.full': true,
    'alerts.acknowledge': true,
    'alerts.manage': true,
    'module.deploy': true, // authorize deployment
    'drone.operate': false, // not assumed — dispatcher manages, does not pilot
    'beacon.communicate': true, // view / control where implemented
    export: true,
    'users.manage': true,
    'roles.manage': true,
    'telemetry.edit': false,
    'ml.edit': false,
    'records.delete': false // restricted — not implemented
  },
  operator: {
    'dashboard.view': true,
    'live.view': true,
    'map.view': true,
    'hardware.view': true,
    'mission.create': false,
    'mission.assign': false,
    'missionLogs.full': false, // assigned / current mission only
    'alerts.acknowledge': true,
    'alerts.manage': false,
    'module.deploy': true, // operate where implemented
    'drone.operate': true,
    'beacon.communicate': true,
    export: false, // assigned mission / authorized data only — not implemented
    'users.manage': false,
    'roles.manage': false,
    'telemetry.edit': false,
    'ml.edit': false,
    'records.delete': false
  },
  responder: {
    'dashboard.view': true,
    'live.view': true,
    'map.view': true,
    'hardware.view': true,
    'mission.create': false,
    'mission.assign': false,
    'missionLogs.full': false, // relevant view only
    'alerts.acknowledge': false,
    'alerts.manage': false,
    'module.deploy': false,
    'drone.operate': false,
    'beacon.communicate': true, // when applicable and authorized
    export: false,
    'users.manage': false,
    'roles.manage': false,
    'telemetry.edit': false,
    'ml.edit': false,
    'records.delete': false
  }
};

export function can(role: Role, capability: Capability): boolean {
  return matrix[role][capability];
}