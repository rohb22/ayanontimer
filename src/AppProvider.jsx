import { createContext, useContext, useState, useEffect } from "react";

const AppContext = createContext();

const defaultSettings = {
  notifications: false,
  music: false,
  studyMusic: true,
  restMusic: false,
  maxStudyTime: 30,
  maxRestTime: 30,
};

export const AppProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    const saved = typeof window !== 'undefined' ? localStorage?.getItem("settings") : null;
    return saved ? JSON.parse(saved) : defaultSettings;
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage?.setItem("settings", JSON.stringify(settings));
    }
  }, [settings]);

  return (
    <AppContext.Provider value={{ settings, setSettings }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);