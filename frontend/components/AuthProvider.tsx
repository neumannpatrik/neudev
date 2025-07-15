"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { getToken, setToken, removeToken } from '@/utils/auth';
import { jwtDecode } from 'jwt-decode';

interface User {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  loading: true,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setTokenState] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = getToken();
    if (t) {
      setTokenState(t);
      try {
        const decoded: any = jwtDecode(t);
        setUser({
          id: decoded.userId,
          email: decoded.email || '',
          name: decoded.name || '',
          isAdmin: !!decoded.isAdmin,
        });
      } catch {
        setUser(null);
      }
    }
    setLoading(false);
  }, []);

  function login(token: string) {
    setToken(token);
    setTokenState(token);
    try {
      const decoded: any = jwtDecode(token);
      setUser({
        id: decoded.userId,
        email: decoded.email || '',
        name: decoded.name || '',
        isAdmin: !!decoded.isAdmin,
      });
    } catch {
      setUser(null);
    }
  }

  function logout() {
    removeToken();
    setTokenState(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 