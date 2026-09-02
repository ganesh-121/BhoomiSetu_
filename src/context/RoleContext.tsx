import React, { createContext, useContext, useState } from 'react';
import { UserRole } from '../types';

export type AppView = 'landing' | 'map' | 'parcel-details' | 'verify' | 'citizen-dashboard' | 'officer-dashboard' | 'admin-dashboard';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  activeView: AppView;
  setActiveView: (view: AppView) => void;
  selectedUlpin: string | null;
  setSelectedUlpin: (ulpin: string | null) => void;
  navigateToParcel: (ulpin: string, view?: AppView) => void;
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('Citizen');
  const [activeView, setActiveView] = useState<AppView>('landing');
  const [selectedUlpin, setSelectedUlpin] = useState<string | null>('IN-MH-411001-P1001');

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    // Auto-switch view if switching role to officer/admin
    if (newRole === 'Officer' && activeView !== 'officer-dashboard') {
      setActiveView('officer-dashboard');
    } else if (newRole === 'Admin' && activeView !== 'admin-dashboard') {
      setActiveView('admin-dashboard');
    } else if (newRole === 'Citizen' && (activeView === 'officer-dashboard' || activeView === 'admin-dashboard')) {
      setActiveView('citizen-dashboard');
    }
  };

  const navigateToParcel = (ulpin: string, view: AppView = 'parcel-details') => {
    setSelectedUlpin(ulpin);
    setActiveView(view);
  };

  return (
    <RoleContext.Provider value={{ role, setRole, activeView, setActiveView, selectedUlpin, setSelectedUlpin, navigateToParcel }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};
