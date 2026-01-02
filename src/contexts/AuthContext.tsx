import React, { useState, useEffect } from 'react';
import { api } from '../api/client';
import type { LoginResponse } from '../api/types';
import { AuthContext } from './authTypes';
import type { User } from './authTypes';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Validate session with backend on mount
    const validateSession = async () => {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          // Call backend to verify session is still valid
          const response = await api.get<LoginResponse>('/admin/me');
          // Use fresh data from backend
          setUser({ email: response.email, role: response.role });
        } catch {
          // Session invalid - clear everything
          localStorage.removeItem('user');
          setUser(null);
        }
      }
      setIsLoading(false);
    };
    validateSession();
  }, []);

  // Listen for auth failures from API client (e.g., session expired mid-use)
  useEffect(() => {
    const handleAuthFailure = () => {
      localStorage.removeItem('user');
      setUser(null);
    };

    window.addEventListener('auth:failure', handleAuthFailure);
    return () => window.removeEventListener('auth:failure', handleAuthFailure);
  }, []);

  const login = async (email: string, password: string) => {
    const response = await api.post<LoginResponse>('/admin/login', { email, password });
    const loggedInUser: User = {
      email: response.email,
      role: response.role,
    };
    setUser(loggedInUser);
    localStorage.setItem('user', JSON.stringify(loggedInUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
