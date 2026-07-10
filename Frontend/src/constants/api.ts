export const API = {
  BASE_URL: process.env.EXPO_PUBLIC_API_URL || 'http://localhost:8000/api',
  TIMEOUT: 30000,
} as const;

export const ENDPOINTS = {
  DASHBOARD: '/dashboard',
  MONITORING: {
    LATEST: '/monitorings/latest',
    HISTORY: '/monitorings/history',
    CHART: '/monitorings/chart',
    DETAIL: (id: string | number) => `/monitorings/${id}`,
  },
  DEVICES: '/devices',
  EXPORT: {
    EXCEL: '/export/excel',
  },
} as const;

export const STORAGE_KEYS = {
  SETTINGS: 'app_settings',
} as const;

export const CACHE_KEYS = {
  DASHBOARD: ['dashboard'],
  LATEST: ['monitoring', 'latest'],
  HISTORY: ['monitoring', 'history'],
  CHART: ['monitoring', 'chart'],
  DEVICES: ['devices'],
};
