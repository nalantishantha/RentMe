"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { authApi } from '@/lib/api';

interface Permissions {
  browse_properties?: boolean;
  add_property?: boolean;
  edit_own_property?: boolean;
  delete_own_property?: boolean;
  view_all_users?: boolean;
  add_user?: boolean;
  edit_user?: boolean;
  delete_user?: boolean;
  manage_permissions?: boolean;
}

interface User {
  id: number;
  email: string;
  role: string;
  firstName: string;
  lastName: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  permissions: Permissions;
  hasPermission: (permission: string) => boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [permissions, setPermissions] = useState<Permissions>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored token on mount
    const storedToken = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user');
    const storedPermissions = localStorage.getItem('permissions');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      if (storedPermissions) {
        setPermissions(JSON.parse(storedPermissions));
      }
    }
    
    setIsLoading(false);
  }, []);

  const hasPermission = useCallback((permission: string): boolean => {
    return permissions[permission as keyof Permissions] === true;
  }, [permissions]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      const { access_token, user: userData, permissions: userPermissions } = response.data;
      
      // Batch localStorage writes
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('permissions', JSON.stringify(userPermissions || {}));
      
      setToken(access_token);
      setUser(userData);
      setPermissions(userPermissions || {});
      return userData;
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (token) {
        await authApi.logout(token);
      }
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      // Batch localStorage removals
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      localStorage.removeItem('permissions');
      setToken(null);
      setUser(null);
      setPermissions({});
    }
  }, [token]);

  const contextValue = useMemo(() => ({
    user,
    token,
    permissions,
    hasPermission,
    login,
    logout,
    isLoading
  }), [user, token, permissions, hasPermission, login, logout, isLoading]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};