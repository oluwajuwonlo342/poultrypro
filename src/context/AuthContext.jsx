import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [farms, setFarms] = useState([]);
  const [subscription, setSubscription] = useState(null);
  const [requiresOnboarding, setRequiresOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadSession = async () => {
    const token = localStorage.getItem('poultrypro_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.user);
      setFarms(data.farms || []);
      setSubscription(data.subscription || null);
      setRequiresOnboarding(Boolean(data.requiresOnboarding));
    } catch {
      localStorage.removeItem('poultrypro_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSession();
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('poultrypro_token', data.token);
    setUser(data.user);
    setFarms(data.farms || []);
    setSubscription(data.subscription || null);
    setRequiresOnboarding(Boolean(data.requiresOnboarding));
    return data;
  };

  const register = async (payload) => {
    const { data } = await api.post('/auth/register', payload);
    localStorage.setItem('poultrypro_token', data.token);
    setUser(data.user);
    setFarms([]);
    setRequiresOnboarding(true);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('poultrypro_token');
    localStorage.removeItem('poultrypro_active_farm_id');
    setUser(null);
    setFarms([]);
    setSubscription(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        farms,
        setFarms,
        subscription,
        setSubscription,
        requiresOnboarding,
        setRequiresOnboarding,
        loading,
        login,
        register,
        logout,
        refreshSession: loadSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);