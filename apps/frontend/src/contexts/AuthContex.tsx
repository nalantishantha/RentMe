"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
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

  const hasPermission = (permission: string): boolean => {
    return permissions[permission as keyof Permissions] === true;
  };

  const login = async (email: string, password: string) => {
    try {
      const response = await authApi.login({ email, password });
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('permissions', JSON.stringify(response.data.permissions || {}));
      setToken(response.data.access_token);
      setUser(response.data.user);
      setPermissions(response.data.permissions || {});
      return response.data.user;
    } catch (error: any) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await authApi.logout(token);
      }
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      localStorage.removeItem('permissions');
      setToken(null);
      setUser(null);
      setPermissions({});
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, permissions, hasPermission, login, logout, isLoading }}>
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