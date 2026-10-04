import type { DemoAccount, Role, RoleConfig, RolePermissions } from '../types/auth';

// Development-only mock accounts. These are not production credentials.
export const DEMO_PASSWORD = 'demo123';

export const roleConfigs: Record<Role, RoleConfig> = {
  dispatcher: {
    role: 'dispatcher',
    label: 'DISPATCHER / ADMIN',
    shortLabel: 'DISPATCHER',
    purpose: 'Manage and oversee the system.',
    emptyState: { title: 'No active missions', detail: 'All missions are closed. The drone is on standby at base.' }
  },
  operator: {
    role: 'operator',
    label: 'FIELD OPERATOR',
    shortLabel: 'OPERATOR',
    purpose: 'Operate and monitor the current mission.',
    emptyState: { title: 'No active mission', detail: 'Drone is ready for deployment.' }
  },
  responder: {
    role: 'responder',
    label: 'RESPONDER',
    shortLabel: 'RESPONDER',
    purpose: 'Understand the situation and respond.',
    emptyState: { title: 'No active incident', detail: 'Waiting for assigned mission information.' }
  }
};

export const rolePermissions: Record<Role, RolePermissions> = {
  dispatcher: { missionHistory: true, technicalDetail: 'expanded', deviceSummary: false },
  operator: { missionHistory: false, technicalDetail: 'expanded', deviceSummary: true },
  responder: { missionHistory: false, technicalDetail: 'collapsed', deviceSummary: false }
};

export const demoAccounts: DemoAccount[] = [
{ username: 'dispatcher', password: DEMO_PASSWORD, name: 'placeholder', role: 'dispatcher' },
{ username: 'operator', password: DEMO_PASSWORD, name: 'placeholder', role: 'operator' },
{ username: 'responder', password: DEMO_PASSWORD, name: 'placeholder', role: 'responder' }];