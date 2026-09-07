import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserAccount, AdminUser, AdminRole } from '../types/matrimonyTypes';
import { INITIAL_ADMINS } from '../data/mockDatabase';

interface AuthContextType {
  currentUser: UserAccount | null;
  currentAdmin: AdminUser | null;
  isAuthenticated: boolean;
  isAdminAuthenticated: boolean;
  loginUser: (emailOrMobile: string, password?: string) => Promise<boolean>;
  loginAsDemoUser: (profileId: string) => void;
  loginAdmin: (email: string, password?: string, role?: AdminRole) => Promise<boolean>;
  logoutUser: () => void;
  logoutAdmin: () => void;
  registerNewUserAccount: (account: Partial<UserAccount>) => UserAccount;
}

const DEFAULT_USER: UserAccount = {
  id: 'usr-102',
  email: 'tanvir.engr@gmail.com',
  mobile: '01712-345678',
  role: 'user',
  profileId: 'MM-100102',
  createdAt: '2025-09-10',
  twoFactorEnabled: false,
};

const MatrimonyAuthContext = createContext<AuthContextType>({
  currentUser: null,
  currentAdmin: null,
  isAuthenticated: false,
  isAdminAuthenticated: false,
  loginUser: async () => false,
  loginAsDemoUser: () => {},
  loginAdmin: async () => false,
  logoutUser: () => {},
  logoutAdmin: () => {},
  registerNewUserAccount: () => DEFAULT_USER,
});

export const MatrimonyAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<UserAccount | null>(() => {
    const saved = localStorage.getItem('bm_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_USER;
      }
    }
    return DEFAULT_USER; // Default logged in as Engr. Tanvir for seamless demo exploration
  });

  const [currentAdmin, setCurrentAdmin] = useState<AdminUser | null>(() => {
    const saved = localStorage.getItem('bm_admin');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('bm_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('bm_user');
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentAdmin) {
      localStorage.setItem('bm_admin', JSON.stringify(currentAdmin));
    } else {
      localStorage.removeItem('bm_admin');
    }
  }, [currentAdmin]);

  const loginUser = async (emailOrMobile: string): Promise<boolean> => {
    const mockUser: UserAccount = {
      id: `usr-${Date.now()}`,
      email: emailOrMobile.includes('@') ? emailOrMobile : `${emailOrMobile}@matrimony.user`,
      mobile: emailOrMobile.includes('@') ? '01700-112233' : emailOrMobile,
      role: 'user',
      profileId: 'MM-100102',
      createdAt: new Date().toISOString(),
    };
    setCurrentUser(mockUser);
    return true;
  };

  const loginAsDemoUser = (profileId: string) => {
    const demoMap: Record<string, UserAccount> = {
      'MM-100101': {
        id: 'usr-101',
        email: 'farhana.dr@gmail.com',
        mobile: '01819-112233',
        role: 'user',
        profileId: 'MM-100101',
        createdAt: '2025-10-15',
      },
      'MM-100102': {
        id: 'usr-102',
        email: 'tanvir.engr@gmail.com',
        mobile: '01712-345678',
        role: 'user',
        profileId: 'MM-100102',
        createdAt: '2025-09-10',
      },
      'MM-100105': {
        id: 'usr-105',
        email: 'sadia.ruet@gmail.com',
        mobile: '01912-998877',
        role: 'user',
        profileId: 'MM-100105',
        createdAt: '2025-11-20',
      },
      'MM-100108': {
        id: 'usr-108',
        email: 'asif.london@gmail.com',
        mobile: '+44 7700 900077',
        role: 'user',
        profileId: 'MM-100108',
        createdAt: '2025-06-25',
      }
    };

    if (demoMap[profileId]) {
      setCurrentUser(demoMap[profileId]);
    } else {
      setCurrentUser({
        id: `usr-${profileId}`,
        email: `user.${profileId.toLowerCase()}@ascahdo.org`,
        mobile: '01700-112233',
        role: 'user',
        profileId: profileId,
        createdAt: new Date().toISOString(),
      });
    }
  };

  const loginAdmin = async (email: string, _password?: string, role: AdminRole = 'super_admin'): Promise<boolean> => {
    const targetAdmin = INITIAL_ADMINS.find(a => a.email.toLowerCase() === email.toLowerCase()) || {
      id: `adm-${Date.now()}`,
      name: role === 'super_admin' ? 'Super Admin' : role === 'verification_officer' ? 'Verification Officer' : 'Moderator',
      email: email || 'admin@ascahdo.org',
      role: role,
      lastLogin: new Date().toLocaleString(),
      status: 'active',
      phone: '+880 1813-817167',
    };
    setCurrentAdmin(targetAdmin as AdminUser);
    return true;
  };

  const logoutUser = () => {
    setCurrentUser(null);
  };

  const logoutAdmin = () => {
    setCurrentAdmin(null);
  };

  const registerNewUserAccount = (accountData: Partial<UserAccount>): UserAccount => {
    const newAccount: UserAccount = {
      id: `usr-${Date.now()}`,
      email: accountData.email || 'user@example.com',
      mobile: accountData.mobile || '01700000000',
      role: 'user',
      profileId: accountData.profileId || `MM-${Math.floor(100000 + Math.random() * 900000)}`,
      createdAt: new Date().toISOString(),
      twoFactorEnabled: false,
    };
    setCurrentUser(newAccount);
    return newAccount;
  };

  return (
    <MatrimonyAuthContext.Provider
      value={{
        currentUser,
        currentAdmin,
        isAuthenticated: !!currentUser,
        isAdminAuthenticated: !!currentAdmin,
        loginUser,
        loginAsDemoUser,
        loginAdmin,
        logoutUser,
        logoutAdmin,
        registerNewUserAccount,
      }}
    >
      {children}
    </MatrimonyAuthContext.Provider>
  );
};

export const useMatrimonyAuth = () => useContext(MatrimonyAuthContext);
