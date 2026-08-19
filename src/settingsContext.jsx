import { createContext, useContext, useEffect, useState } from "react";
import { getSettings } from "./api.js";

const SettingsContext = createContext({ settings: null, refresh: () => {} });

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(null);

  const refresh = () => {
    getSettings()
      .then(setSettings)
      .catch(() => {});
  };

  useEffect(() => {
    refresh();
  }, []);

  return <SettingsContext.Provider value={{ settings, refresh }}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return useContext(SettingsContext);
}
