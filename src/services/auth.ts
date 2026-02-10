import type { User, LoginCredentials, RegisterCredentials, UserPreferences } from '@/types';
import { userStorage, tokenStorage } from './storage';

// Mock authentication service (simulating backend)
export const authService = {
  // Login user
  login: async (credentials: LoginCredentials): Promise<{ user: User; token: string }> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Phone login
    if (credentials.phone) {
      const phoneUser: User = {
        id: `phone-${credentials.phone}`,
        phone: credentials.phone,
        email: `phone_${credentials.phone}@fittrack.com`,
        name: `用户${credentials.phone.slice(-4)}`,
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
    
    // Email login
    const storedUser = localStorage.getItem(`user_${credentials.email}`);
    
    if (!storedUser) {
      throw new Error('用户不存在或密码错误');
    }
    
    const user: User = JSON.parse(storedUser);
    
    const storedPassword = localStorage.getItem(`pwd_${credentials.email}`);
    if (storedPassword !== hashPassword(credentials.password || '')) {
      throw new Error('用户不存在或密码错误');
    }
    
    const token = generateToken(user.id);
    tokenStorage.setToken(token);
    userStorage.setUser(user);
    
    return { user, token };
  },

  // Register new user
  register: async (credentials: RegisterCredentials): Promise<{ user: User; token: string }> => {
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const email = credentials.email || `phone_${credentials.phone}@fittrack.com`;
    
    const existingUser = localStorage.getItem(`user_${email}`);
    if (existingUser) {
      throw new Error('该邮箱已被注册');
    }
    
    if (credentials.password && credentials.password !== credentials.confirmPassword) {
      throw new Error('两次输入的密码不一致');
    }
    
    const newUser: User = {
      id: generateId(),
      email: email,
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

  // Guest login
  guestLogin: async (): Promise<{ user: User; token: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const guestId = `guest-${Date.now()}`;
    const guestUser: User = {
      id: guestId,
      email: `${guestId}@fittrack.com`,
      name: '游客用户',
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

  // Logout user
  logout: (): void => {
    tokenStorage.removeToken();
    userStorage.removeUser();
  },

  // Check if user is authenticated
  checkAuth: (): User | null => {
    const token = tokenStorage.getToken();
    const user = userStorage.getUser();
    
    if (!token || !user) {
      return null;
    }
    
    return user;
  },

  // Update user profile
  updateProfile: async (updates: Partial<User>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const user = userStorage.getUser();
    if (!user) {
      throw new Error('用户未登录');
    }
    
    const updatedUser = { ...user, ...updates };
    userStorage.setUser(updatedUser);
    localStorage.setItem(`user_${user.email}`, JSON.stringify(updatedUser));
    
    return updatedUser;
  },

  // Update avatar
  updateAvatar: async (avatarDataUrl: string): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const user = userStorage.getUser();
    if (!user) {
      throw new Error('用户未登录');
    }
    
    const updatedUser = { ...user, avatar: avatarDataUrl };
    userStorage.setUser(updatedUser);
    localStorage.setItem(`user_${user.email}`, JSON.stringify(updatedUser));
    
    return updatedUser;
  },

  // Update preferences
  updatePreferences: async (preferences: Partial<UserPreferences>): Promise<User> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const user = userStorage.getUser();
    if (!user) {
      throw new Error('用户未登录');
    }
    
    const updatedUser = {
      ...user,
      preferences: { ...user.preferences, ...preferences },
    };
    userStorage.setUser(updatedUser);
    localStorage.setItem(`user_${user.email}`, JSON.stringify(updatedUser));
    
    return updatedUser;
  },

  // Change password
  changePassword: async (oldPassword: string, newPassword: string): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const user = userStorage.getUser();
    if (!user) {
      throw new Error('用户未登录');
    }
    
    const storedPassword = localStorage.getItem(`pwd_${user.email}`);
    if (storedPassword !== hashPassword(oldPassword)) {
      throw new Error('原密码错误');
    }
    
    localStorage.setItem(`pwd_${user.email}`, hashPassword(newPassword));
  },

  // Demo login (for quick testing)
  demoLogin: async (): Promise<{ user: User; token: string }> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const demoUser: User = {
      id: 'demo-user-001',
      email: 'demo@fittrack.com',
      name: 'Demo 用户',
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

// Helper functions
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateToken(userId: string): string {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(JSON.stringify({ 
    sub: userId, 
    iat: Date.now(), 
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000
  }));
  const signature = btoa(`${header}.${payload}-secret`);
  return `${header}.${payload}.${signature}`;
}

function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
}

export default authService;
