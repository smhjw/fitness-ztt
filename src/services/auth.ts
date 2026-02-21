import type { User, LoginCredentials, RegisterCredentials, UserPreferences } from '@/types';
import { userStorage, tokenStorage } from './storage';

const LEGACY_GUEST_NAMES = new Set(['游客用户', 'Guest User']);
const LEGACY_DEMO_NAMES = new Set(['Demo 用户', 'Demo User']);

const AUTH_ERROR_MESSAGES = {
  invalidCredentials: '账号或密码错误',
  emailExists: '邮箱已注册',
  passwordMismatch: '两次密码不一致',
  invalidOldPassword: '原密码错误',
} as const;

const AUTH_FALLBACK_MESSAGES = {
  notLoggedIn: '请先登录',
};

function getPhoneUserName(phone: string): string {
  return `用户${phone.slice(-4)}`;
}

function getGuestUserName(): string {
  return '游客用户';
}

function getDemoUserName(): string {
  return '演示用户';
}

function isDemoUser(user: User): boolean {
  return user.id === 'demo-user-001' || user.email === 'demo@fittrack.com';
}

function isLegacyPhoneGeneratedName(user: User): boolean {
  if (user.loginType !== 'phone' || !user.phone) {
    return false;
  }

  const suffix = user.phone.slice(-4);
  const expectedNames = new Set([
    `User${suffix}`,
    `用户${suffix}`,
    getPhoneUserName(user.phone),
  ]);

  return !user.name || expectedNames.has(user.name);
}

function normalizeLocalizedName(user: User): User {
  const normalizedLanguage: UserPreferences['language'] = 'zh-CN';
  let nextName = user.name;

  if (user.loginType === 'guest') {
    if (!user.name || LEGACY_GUEST_NAMES.has(user.name) || user.id.startsWith('guest-')) {
      nextName = getGuestUserName();
    }
  } else if (isDemoUser(user)) {
    if (!user.name || LEGACY_DEMO_NAMES.has(user.name)) {
      nextName = getDemoUserName();
    }
  } else if (isLegacyPhoneGeneratedName(user)) {
    nextName = getPhoneUserName(user.phone!);
  }

  const shouldUpdateLanguage = user.preferences?.language !== normalizedLanguage;
  if (nextName === user.name && !shouldUpdateLanguage) {
    return user;
  }

  return {
    ...user,
    name: nextName,
    preferences: {
      ...user.preferences,
      language: normalizedLanguage,
    },
  };
}

function persistUserIfChanged(previous: User, next: User): void {
  if (previous.name === next.name && previous.preferences?.language === next.preferences?.language) {
    return;
  }

  userStorage.setUser(next);
  if (previous.email) {
    localStorage.setItem(`user_${previous.email}`, JSON.stringify(next));
  }
}

// Mock authentication service (simulating backend)
export const authService = {
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    if (credentials.phone) {
      const phoneUser: User = {
        id: `phone-${credentials.phone}`,
        phone: credentials.phone,
        email: `phone_${credentials.phone}@fittrack.com`,
        name: getPhoneUserName(credentials.phone),
        preferences: {
          dateFormat: 'YYYY-MM-DD',
          unitSystem: 'metric',
          defaultView: 'dashboard',
          language: 'zh-CN',
        },
        loginType: 'phone',
        createdAt: new Date().toISOString(),
      };

      const token = generateToken(phoneUser.id);
      tokenStorage.setToken(token);
      userStorage.setUser(phoneUser);

      return { user: phoneUser, token };
    }

    const storedUser = localStorage.getItem(`user_${credentials.email}`);
    if (!storedUser) {
      throw new Error(AUTH_ERROR_MESSAGES.invalidCredentials);
    }

    const parsedUser: User = JSON.parse(storedUser);
    const user = normalizeLocalizedName(parsedUser);
    persistUserIfChanged(parsedUser, user);

    const storedPassword = localStorage.getItem(`pwd_${credentials.email}`);
    if (storedPassword !== hashPassword(credentials.password || '')) {
      throw new Error(AUTH_ERROR_MESSAGES.invalidCredentials);
    }

    const token = generateToken(user.id);
    tokenStorage.setToken(token);
    userStorage.setUser(user);

    return { user, token };
  },

  register: async (credentials: RegisterCredentials): Promise<{ user: User; token: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));

    const email = credentials.email || `phone_${credentials.phone}@fittrack.com`;

    const existingUser = localStorage.getItem(`user_${email}`);
    if (existingUser) {
      throw new Error(AUTH_ERROR_MESSAGES.emailExists);
    }

    if (credentials.password && credentials.password !== credentials.confirmPassword) {
      throw new Error(AUTH_ERROR_MESSAGES.passwordMismatch);
    }

    const newUser: User = {
      id: generateId(),
      email,
      phone: credentials.phone,
      name: credentials.name,
      preferences: {
        dateFormat: 'YYYY-MM-DD',
        unitSystem: 'metric',
        defaultView: 'dashboard',
        language: 'zh-CN',
      },
      loginType: credentials.phone ? 'phone' : 'email',
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(`user_${email}`, JSON.stringify(newUser));
    if (credentials.password) {
      localStorage.setItem(`pwd_${email}`, hashPassword(credentials.password));
    }

    const token = generateToken(newUser.id);
    tokenStorage.setToken(token);
    userStorage.setUser(newUser);

    return { user: newUser, token };
  },

  guestLogin: async (): Promise<{ user: User; token: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const guestId = `guest-${Date.now()}`;
    const guestUser: User = {
      id: guestId,
      email: `${guestId}@fittrack.com`,
      name: getGuestUserName(),
      preferences: {
        dateFormat: 'YYYY-MM-DD',
        unitSystem: 'metric',
        defaultView: 'dashboard',
        language: 'zh-CN',
      },
      loginType: 'guest',
      createdAt: new Date().toISOString(),
    };

    const token = generateToken(guestUser.id);
    tokenStorage.setToken(token);
    userStorage.setUser(guestUser);

    return { user: guestUser, token };
  },

  logout: (): void => {
    tokenStorage.removeToken();
    userStorage.removeUser();
  },

  checkAuth: (): User | null => {
    const token = tokenStorage.getToken();
    const storedUser = userStorage.getUser();

    if (!token || !storedUser) {
      return null;
    }

    const normalizedUser = normalizeLocalizedName(storedUser);
    persistUserIfChanged(storedUser, normalizedUser);

    return normalizedUser;
  },

  updateProfile: async (updates: Partial<User>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const user = userStorage.getUser();
    if (!user) {
      throw new Error(AUTH_FALLBACK_MESSAGES.notLoggedIn);
    }

    const updatedUser = { ...user, ...updates };
    userStorage.setUser(updatedUser);
    localStorage.setItem(`user_${user.email}`, JSON.stringify(updatedUser));

    return updatedUser;
  },

  updateAvatar: async (avatarDataUrl: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 600));

    const user = userStorage.getUser();
    if (!user) {
      throw new Error(AUTH_FALLBACK_MESSAGES.notLoggedIn);
    }

    const updatedUser = { ...user, avatar: avatarDataUrl };
    userStorage.setUser(updatedUser);
    localStorage.setItem(`user_${user.email}`, JSON.stringify(updatedUser));

    return updatedUser;
  },

  updatePreferences: async (preferences: Partial<UserPreferences>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 400));

    const user = userStorage.getUser();
    if (!user) {
      throw new Error(AUTH_FALLBACK_MESSAGES.notLoggedIn);
    }

    const updatedUser = {
      ...user,
      preferences: {
        ...user.preferences,
        ...preferences,
        language: 'zh-CN' as const,
      },
    };
    userStorage.setUser(updatedUser);
    localStorage.setItem(`user_${user.email}`, JSON.stringify(updatedUser));

    return updatedUser;
  },

  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 800));

    const user = userStorage.getUser();
    if (!user) {
      throw new Error(AUTH_FALLBACK_MESSAGES.notLoggedIn);
    }

    const storedPassword = localStorage.getItem(`pwd_${user.email}`);
    if (storedPassword !== hashPassword(oldPassword)) {
      throw new Error(AUTH_ERROR_MESSAGES.invalidOldPassword);
    }

    localStorage.setItem(`pwd_${user.email}`, hashPassword(newPassword));
  },

  demoLogin: async (): Promise<{ user: User; token: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500));

    const demoUser: User = {
      id: 'demo-user-001',
      email: 'demo@fittrack.com',
      name: getDemoUserName(),
      preferences: {
        dateFormat: 'YYYY-MM-DD',
        unitSystem: 'metric',
        defaultView: 'dashboard',
        language: 'zh-CN',
      },
      loginType: 'email',
      createdAt: new Date().toISOString(),
    };

    localStorage.setItem(`user_${demoUser.email}`, JSON.stringify(demoUser));
    localStorage.setItem(`pwd_${demoUser.email}`, hashPassword('demo123'));

    const token = generateToken(demoUser.id);
    tokenStorage.setToken(token);
    userStorage.setUser(demoUser);

    return { user: demoUser, token };
  },
};

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

function generateToken(userId: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({
    sub: userId,
    iat: Date.now(),
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000,
  }));
  const signature = btoa(`${header}.${payload}-secret`);
  return `${header}.${payload}.${signature}`;
}

function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i += 1) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash &= hash;
  }
  return hash.toString(16);
}

export default authService;
