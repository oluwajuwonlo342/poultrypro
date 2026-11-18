import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const FarmContext = createContext(null);

export const FarmProvider = ({ children }) => {
  const { user, farms } = useAuth();
  const [activeFarm, setActiveFarm] = useState(null);

  useEffect(() => {
    if (!farms || farms.length === 0) {
      setActiveFarm(null);
      localStorage.removeItem('poultrypro_active_farm_id');
      return;
    }

    const savedId = localStorage.getItem('poultrypro_active_farm_id');
    const matched = farms.find((f) => f._id === savedId) || farms[0];
    setActiveFarm(matched);
    localStorage.setItem('poultrypro_active_farm_id', matched._id);
  }, [farms]);

  const switchFarm = (farmId) => {
    const target = farms.find((f) => f._id === farmId);
    if (target) {
      setActiveFarm(target);
      localStorage.setItem('poultrypro_active_farm_id', target._id);
    }
  };

  // Helper to check if current user can access a given module
  const hasPermission = (permKey) => {
    if (!user) return false;
    if (user.role === 'super_admin' || user.role === 'farm_owner') return true;
    return Boolean(activeFarm?.workerPermissions?.[permKey]);
  };

  return (
    <FarmContext.Provider value={{ activeFarm, switchFarm, hasPermission }}>
      {children}
    </FarmContext.Provider>
  );
};

export const useFarm = () => useContext(FarmContext);