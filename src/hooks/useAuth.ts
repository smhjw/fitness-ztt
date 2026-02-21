import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import type { User, LoginCredentials, RegisterCredentials, UserPreferences } from '@/types';
import { authService } from '@/services/auth';
import type { ReactNode } from 'react';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  demoLogin: () => Promise<void>;
  guestLogin: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  updateAvatar: (avatarDataUrl: string) => Promise<void>;
  updatePreferences: (preferences: Partial<UserPreferences>) => Promise<void>;
  changePassword: (oldPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth 必须在 AuthProvider 内使用');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initAuth = (): void => {
      const authenticatedUser = authService.checkAuth();
      setUser(authenticatedUser);
      setIsLoading(false);
    };
    initAuth();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    try {
      const { user } = await authService.login(credentials);
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials): Promise<void> => {
    setIsLoading(true);
    try {
      const { user } = await authService.register(credentials);
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback((): void => {
    authService.logout();
    setUser(null);
  }, []);

  const demoLogin = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const { user } = await authService.demoLogin();
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const guestLogin = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    try {
      const { user } = await authService.guestLogin();
      setUser(user);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (updates: Partial<User>): Promise<void> => {
    const updatedUser = await authService.updateProfile(updates);
    setUser(updatedUser);
  }, []);

  const updateAvatar = useCallback(async (avatarDataUrl: string): Promise<void> => {
    const updatedUser = await authService.updateAvatar(avatarDataUrl);
    setUser(updatedUser);
  }, []);

  const updatePreferences = useCallback(async (preferences: Partial<UserPreferences>): Promise<void> => {
    const updatedUser = await authService.updatePreferences(preferences);
    setUser(updatedUser);
  }, []);

  const changePassword = useCallback(async (oldPassword: string, newPassword: string): Promise<void> => {
    await authService.changePassword(oldPassword, newPassword);
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    demoLogin,
    guestLogin,
    updateProfile,
    updateAvatar,
    updatePreferences,
    changePassword,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
}

export default useAuth;
