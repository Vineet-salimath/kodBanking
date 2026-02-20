import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getMe, logoutUser } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Verify session on mount
  useEffect(() => {
    (async () => {
      try {
        const { data } = await getMe();
        if (data.success) setUser(data.user);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = useCallback((userData) => {
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } catch {
      // swallow – clear client state regardless
    } finally {
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
