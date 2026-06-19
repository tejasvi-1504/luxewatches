import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import api from '../utils/api';

const SettingsContext = createContext();

const DEFAULTS = {
  brandName: 'Sparkle Time',
  theme: 'rose',
  logo: '',
  themes: ['rose', 'gold', 'emerald', 'sapphire', 'platinum'],
};

const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme || 'rose');
};

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  // Always holds the persisted theme, so resetTheme() is stable & never stale.
  const savedTheme = useRef(DEFAULTS.theme);

  // Apply the default theme immediately to avoid a flash before fetch resolves.
  useEffect(() => { applyTheme(DEFAULTS.theme); }, []);

  const sync = useCallback((data) => {
    const next = { ...DEFAULTS, ...data };
    savedTheme.current = next.theme;
    setSettings(next);
    applyTheme(next.theme);
    if (next.brandName) document.title = `${next.brandName} — Premium Timepieces & Fashion`;
    return next;
  }, []);

  useEffect(() => {
    api.get('/settings')
      .then(({ data }) => sync(data.settings))
      .catch(() => {/* keep defaults */})
      .finally(() => setLoading(false));
  }, [sync]);

  // Admin-only: persist appearance changes and apply them live.
  const updateSettings = async (payload) => {
    const { data } = await api.put('/settings', payload);
    return sync(data.settings);
  };

  // Preview a theme without persisting (used by the admin picker).
  const previewTheme = useCallback((theme) => applyTheme(theme), []);
  // Restore whatever theme is actually saved (reads a ref, never stale).
  const resetTheme = useCallback(() => applyTheme(savedTheme.current), []);

  return (
    <SettingsContext.Provider value={{ ...settings, loading, updateSettings, previewTheme, resetTheme }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);
