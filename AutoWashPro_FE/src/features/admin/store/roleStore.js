import { create } from 'zustand';
import {
  fetchPermissions,
  fetchRoles,
  updateRolePermissions as updateRolePermissionsApi,
  getApiErrorMessage,
} from '../services/roleService';

const useRoleStore = create((set, get) => ({
  roles: [],
  permissions: [],
  isLoading: false,
  isSaving: false,
  error: null,
  lastAction: null,

  fetchRolesAndPermissions: async () => {
    set({ isLoading: true, error: null });
    try {
      const [permissions, roles] = await Promise.all([fetchPermissions(), fetchRoles()]);

      const rolesWithMappedPermissions = roles.map((role) => ({
        ...role,
        permissions: role.permissions.map((permValue) => {
          const matched = permissions.find(
            (perm) => perm.id === permValue || perm.code === permValue,
          );
          return matched?.id ?? permValue;
        }),
      }));

      set({ permissions, roles: rolesWithMappedPermissions, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: getApiErrorMessage(error, 'Không thể tải danh sách role.'),
      });
    }
  },

  updateRolePermissions: async (roleId, permissionIds) => {
    set({ isSaving: true, error: null });
    try {
      await updateRolePermissionsApi(roleId, permissionIds);

      const role = get().roles.find((item) => item.id === roleId);

      set((state) => ({
        isSaving: false,
        roles: state.roles.map((item) =>
          item.id === roleId ? { ...item, permissions: permissionIds } : item,
        ),
        lastAction: {
          type: 'update',
          roleName: role?.name ?? 'Role',
        },
      }));

      return true;
    } catch (error) {
      set({
        isSaving: false,
        error: getApiErrorMessage(error, 'Không thể cập nhật permissions.'),
      });
      throw error;
    }
  },

  clearLastAction: () => set({ lastAction: null }),
  clearError: () => set({ error: null }),
}));

export default useRoleStore;
