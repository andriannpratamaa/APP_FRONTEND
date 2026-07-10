export interface MonitoringData {
  id: number;
  device_id: number;
  device_code?: string;
  device_name?: string;
  ac_voltage: number;
  ac_current: number;
  dc_voltage: number;
  temperature: number;
  humidity: number;
  status: DeviceStatus;
  recorded_at: string;
  created_at?: string;
}

export type DeviceStatus = 'online' | 'offline' | 'warning';

export type TimeRange = '1h' | '6h' | '12h' | '24h' | '7d' | '30d';

export interface ChartDataPoint {
  timestamp: string;
  value: number;
}

export interface ChartData {
  ac_voltage: ChartDataPoint[];
  ac_current: ChartDataPoint[];
  dc_voltage: ChartDataPoint[];
  temperature: ChartDataPoint[];
  humidity: ChartDataPoint[];
}

export interface HistoryParams {
  device_id?: number;
  page: number;
  limit: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
  search?: string;
  start_date?: string;
  end_date?: string;
  filter?: 'day' | 'week' | 'month' | 'custom';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface DeviceInfo {
  id: number;
  device_code: string;
  device_name: string;
  location: string;
  firmware_version: string;
  ip_address: string;
  mac_address: string;
  status: DeviceStatus;
  last_seen: string;
  created_at?: string;
  updated_at?: string;
}

export interface DashboardData {
  total_devices: number;
  devices_online: number;
  devices_offline: number;
  latest_monitoring: MonitoringData | null;
  last_update: string | null;
}

export interface ExportRequest {
  start_date: string;
  end_date: string;
}

export interface SettingsState {
  darkMode: boolean;
  notificationsEnabled: boolean;
  autoRefresh: boolean;
  refreshInterval: number;
  historyRefreshInterval: number;
  selectedDeviceId: number | null;
}
