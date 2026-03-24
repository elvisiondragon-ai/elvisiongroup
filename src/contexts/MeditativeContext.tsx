import React, { createContext, useContext, useState } from 'react';

interface MeditativeContextType {
  isMeditativeActive: boolean;
  setMeditativeActive: (active: boolean) => void;
  showTabWarning: () => void;
}

const MeditativeContext = createContext<MeditativeContextType | undefined>(undefined);

export function MeditativeProvider({ children }: { children: React.ReactNode }) {
  const [isMeditativeActive, setIsMeditativeActive] = useState(false);
  const [showWarning, setShowWarning] = useState(false);

  const setMeditativeActive = (active: boolean) => {
    setIsMeditativeActive(active);
  };

  const showTabWarning = () => {
    setShowWarning(true);
  };

  return (
    <MeditativeContext.Provider value={{
      isMeditativeActive,
      setMeditativeActive,
      showTabWarning
    }}>
      {children}
    </MeditativeContext.Provider>
  );
}

export function useMeditative() {
  const context = useContext(MeditativeContext);
  if (context === undefined) {
    throw new Error('useMeditative must be used within a MeditativeProvider');
  }
  return context;
}