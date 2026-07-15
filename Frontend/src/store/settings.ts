import { create } from 'zustand';
import { SettingsState } from '../types';
import { getItem, setItem } from '../utils/storage';
import { STORAGE_KEYS } from '../constants/api';

interface SettingsStore extends SettingsState {
  loadSettings: () => Promise<void>;
  setDarkMode: (value: boolean) => Promise<void>;
  setNotificationsEnabled: (value: boolean) => Promise<void>;
  setSelectedDeviceId: (value: number | null) => Promise<void>;
}

const defaultSettings: SettingsState = {
  darkMode: false,
  notificationsEnabled: true,
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

  setSelectedDeviceId: async (value) => {
    set({ selectedDeviceId: value });
    await persist({ selectedDeviceId: value });
  },
}));
