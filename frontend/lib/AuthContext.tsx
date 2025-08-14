'use client';

import React, { createContext, useState, useEffect, useContext, ReactNode } from 'react';
import { getAuthToken, removeAuthToken, setAuthToken } from './auth';
import { api } from './utils';
import { IUser } from '@/types/user';

interface AuthContextType {
  user: IUser | null;
  loading: boolean;
  token: string | null;
  login: (token: string, user: IUser) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  const fetchUser = async () => {
    setLoading(true);
    const storedToken = getAuthToken();
    setToken(storedToken);

    if (storedToken) {
      try {
        const res = await api.get('/auth/me', {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });
        setUser(res.data.user);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
        removeAuthToken();
        setToken(null);
        setUser(null);
      }
    } else {
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = (newToken: string, newUser: IUser) => {
    setAuthToken(newToken);
    setToken(newToken);
    setUser(newUser);
  };

  const logout = () => {
    removeAuthToken();
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, token, login, logout, fetchUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
