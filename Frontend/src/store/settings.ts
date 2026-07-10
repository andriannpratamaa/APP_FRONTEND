import { create } from 'zustand';
import { SettingsState } from '../types';
import { getItem, setItem } from '../utils/storage';
import { STORAGE_KEYS } from '../constants/api';

interface SettingsStore extends SettingsState {
  loadSettings: () => Promise<void>;
  setDarkMode: (value: boolean) => Promise<void>;
  setNotificationsEnabled: (value: boolean) => Promise<void>;
  setAutoRefresh: (value: boolean) => Promise<void>;
  setRefreshInterval: (value: number) => Promise<void>;
  setHistoryRefreshInterval: (value: number) => Promise<void>;
  setSelectedDeviceId: (value: number | null) => Promise<void>;
}

const defaultSettings: SettingsState = {
  darkMode: false,
  notificationsEnabled: true,
  autoRefresh: true,
  refreshInterval: 30,
  historyRefreshInterval: 3600,
  selectedDeviceId: null,
};

const persist = async (partial: Partial<SettingsState>) => {
  const current = useSettingsStore.getState();
  await setItem(STORAGE_KEYS.SETTINGS, { ...current, ...partial });
};

export const useSettingsStore = create<SettingsStore>((set) => ({
  ...defaultSettings,

  loadSettings: async () => {
    const saved = await getItem<Partial<SettingsState>>(STORAGE_KEYS.SETTINGS);
    if (saved) {
      set({ ...defaultSettings, ...saved });
    }
  },

  setDarkMode: async (value) => {
    set({ darkMode: value });
    await persist({ darkMode: value });
  },

  setNotificationsEnabled: async (value) => {
    set({ notificationsEnabled: value });
    await persist({ notificationsEnabled: value });
  },

  setAutoRefresh: async (value) => {
    set({ autoRefresh: value });
    await persist({ autoRefresh: value });
  },

  setRefreshInterval: async (value) => {
    set({ refreshInterval: value });
    await persist({ refreshInterval: value });
  },

  setHistoryRefreshInterval: async (value) => {
    set({ historyRefreshInterval: value });
    await persist({ historyRefreshInterval: value });
  },

  setSelectedDeviceId: async (value) => {
    set({ selectedDeviceId: value });
    await persist({ selectedDeviceId: value });
  },
}));
