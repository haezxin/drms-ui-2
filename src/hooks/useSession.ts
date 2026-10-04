import { useAuth } from '../contexts/AuthContext';
import { roleConfigs, rolePermissions } from '../data/roles';
import { can } from '../data/permissions';
import type { Capability } from '../types/auth';

/** The signed-in user with their role config, view permissions, and action capabilities. */
export function useSession() {
  const { user } = useAuth();
  if (!user) throw new Error('useSession requires an authenticated user');
  return {
    user,
    role: user.role,
    config: roleConfigs[user.role],
    permissions: rolePermissions[user.role],
    /** Checks an action capability against the role/permission matrix — the single source of truth. */
    can: (capability: Capability) => can(user.role, capability)
  };
}