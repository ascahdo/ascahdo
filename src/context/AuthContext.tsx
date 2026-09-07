import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isSuperAdmin: boolean;
  login: (credentials: any) => Promise<void>;
  sendOtp: (phone: string, channel?: 'sms' | 'whatsapp') => Promise<any>;
  loginWithOtp: (phone: string, otp: string) => Promise<void>;
  register: (userData: any) => Promise<void>;
  logout: () => void;
  updatePassword: (passwords: any) => Promise<void>;
  openPasswordChangeModal: () => void;
  hasRole: (roles: UserRole[]) => boolean;
  hasPermission: (permission: string) => boolean;
  showAuthModal: boolean;
  setShowAuthModal: (show: boolean) => void;
  authModalMode: 'login' | 'register' | 'forgot';
  setAuthModalMode: (mode: 'login' | 'register' | 'forgot') => void;
  showPasswordChangeModal: boolean;
  setShowPasswordChangeModal: (show: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('ascado_token'));
  const [loading, setLoading] = useState(true);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);

  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          const res = await api.getMe();
          setUser(res.user);
          // Removed forced password change modal on session restoration
        } catch (err) {
          console.error('Session restoration failed:', err);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, [token]);

  const login = async (credentials: any) => {
    const res = await api.login(credentials);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('ascado_token', res.token);
    setShowAuthModal(false);
    // Removed automatic forced password change modal
  };

  const sendOtp = async (phone: string, channel: 'sms' | 'whatsapp' = 'sms') => {
    return await api.sendOtp(phone, channel);
  };

  const loginWithOtp = async (phone: string, otp: string) => {
    const res = await api.verifyOtp(phone, otp);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('ascado_token', res.token);
    setShowAuthModal(false);
    // Direct login without forced password change
  };

  const register = async (userData: any) => {
    const res = await api.register(userData);
    setToken(res.token);
    setUser(res.user);
    localStorage.setItem('ascado_token', res.token);
    setShowAuthModal(false);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ascado_token');
  };

  const openPasswordChangeModal = () => {
    setShowPasswordChangeModal(true);
  };

  const updatePassword = async (passwords: any) => {
    await api.changePassword(passwords);
    if (user) {
      setUser({ ...user, mustChangePassword: false });
    }
    setShowPasswordChangeModal(false);
  };

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  const hasRole = (roles: UserRole[]) => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true;
    return roles.includes(user.role);
  };

  const hasPermission = (permission: string) => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN' || user.permissions.includes('all')) return true;
    return user.permissions.includes(permission);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isSuperAdmin,
        login,
        sendOtp,
        loginWithOtp,
        register,
        logout,
        updatePassword,
        openPasswordChangeModal,
        hasRole,
        hasPermission,
        showAuthModal,
        setShowAuthModal,
        authModalMode,
        setAuthModalMode,
        showPasswordChangeModal,
        setShowPasswordChangeModal
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
