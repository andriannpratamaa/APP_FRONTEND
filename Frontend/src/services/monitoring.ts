import api from './api';
import {
  ChartData,
  DashboardData,
  HistoryParams,
  MonitoringData,
  PaginatedResponse,
  TimeRange,
} from '../types';
import { ENDPOINTS } from '../constants/api';

const rangeConfig: Record<TimeRange, { interval: string; hours: number }> = {
  '1h': { interval: 'minute', hours: 1 },
  '6h': { interval: 'hour', hours: 6 },
  '12h': { interval: 'hour', hours: 12 },
  '24h': { interval: 'hour', hours: 24 },
  '7d': { interval: 'day', hours: 168 },
  '30d': { interval: 'day', hours: 720 },
};

export const monitoringService = {
  getDashboard: async (deviceId?: number | null): Promise<DashboardData> => {
    const params: Record<string, string | number> = {};
    if (deviceId) params.device_id = deviceId;
    const { data } = await api.get<DashboardData>(ENDPOINTS.DASHBOARD, { params });
    return data;
  },

  getLatest: async (deviceId?: number | null): Promise<MonitoringData> => {
    const params: Record<string, string | number> = {};
    if (deviceId) params.device_id = deviceId;
    const { data } = await api.get<MonitoringData>(ENDPOINTS.MONITORING.LATEST, { params });
    return data;
  },

  getHistory: async (params: HistoryParams): Promise<PaginatedResponse<MonitoringData>> => {
    const { data } = await api.get<PaginatedResponse<MonitoringData>>(
      ENDPOINTS.MONITORING.HISTORY,
      { params }
    );
    return data;
  },

  getChart: async (timeRange: TimeRange, deviceId?: number | null): Promise<ChartData> => {
    const now = new Date();
    const startDate = new Date(now.getTime() - rangeConfig[timeRange].hours * 60 * 60 * 1000);

    const params: Record<string, string | number> = {
      start_date: startDate.toISOString(),
      end_date: now.toISOString(),
      interval: rangeConfig[timeRange].interval,
    };
    if (deviceId) params.device_id = deviceId;

    const { data } = await api.get<ChartData>(ENDPOINTS.MONITORING.CHART, { params });
    return data;
  },

  getDetail: async (id: string | number): Promise<MonitoringData> => {
    const { data } = await api.get<MonitoringData>(ENDPOINTS.MONITORING.DETAIL(id));
    return data;
  },
};
