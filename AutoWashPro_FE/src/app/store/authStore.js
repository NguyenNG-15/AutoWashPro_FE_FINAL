import { create } from 'zustand';
import { loginInternal } from '../../features/auth/services/authService';

const TOKEN_KEY = 'accessToken';

const getInitialAuth = () => {
  const accessToken = localStorage.getItem(TOKEN_KEY);
  return {
    isAuthenticated: Boolean(accessToken),
    accessToken,
    roles: [],
    permissions: [],
    forceChangePassword: false,
    user: null,
  };
};

const useAuthStore = create((set) => ({
  ...getInitialAuth(),

  login: async ({ username, password }) => {
    const data = await loginInternal({ username, password });
    const accessToken = data.accessToken;

    if (!accessToken) {
      throw new Error('Không nhận được token từ server.');
    }

    localStorage.setItem(TOKEN_KEY, accessToken);

    set({
      isAuthenticated: true,
      accessToken,
      roles: data.roles ?? [],
      permissions: data.permissions ?? [],
      forceChangePassword: Boolean(data.forceChangePassword),
      user: {
        username,
        fullName: data.fullName ?? data.name ?? username,
        email: data.email ?? null,
      },
    });

    return data;
  },

  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    set({
      isAuthenticated: false,
      accessToken: null,
      roles: [],
      permissions: [],
      forceChangePassword: false,
      user: null,
    });
  },
}));

export default useAuthStore;
