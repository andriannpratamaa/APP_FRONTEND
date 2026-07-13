import { useQuery, useQueryClient } from '@tanstack/react-query';
import { monitoringService } from '../services/monitoring';
import { CACHE_KEYS } from '../constants/api';
import { HistoryParams, TimeRange, ChartData, MonitoringData } from '../types';
import { useSettingsStore } from '../store/settings';
import { useCallback } from 'react';

export const useDashboard = () => {
  const { autoRefresh, refreshInterval, selectedDeviceId } = useSettingsStore();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [...CACHE_KEYS.DASHBOARD, selectedDeviceId],
    queryFn: () => monitoringService.getDashboard(selectedDeviceId),
    refetchInterval: autoRefresh ? refreshInterval * 1000 : false,
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: CACHE_KEYS.DASHBOARD });
  }, [queryClient]);

  return { ...query, invalidate };
};

export const useLatestMonitoring = () => {
  const { autoRefresh, refreshInterval, selectedDeviceId } = useSettingsStore();

  return useQuery({
    queryKey: [...CACHE_KEYS.LATEST, selectedDeviceId],
    queryFn: () => monitoringService.getLatest(selectedDeviceId),
    refetchInterval: autoRefresh ? refreshInterval * 1000 : false,
  });
};

export const useMonitoringHistory = (params: HistoryParams) => {
  const { historyRefreshInterval, selectedDeviceId } = useSettingsStore();

  const mergedParams = { ...params };
  if (selectedDeviceId) mergedParams.device_id = selectedDeviceId;

  return useQuery({
    queryKey: [...CACHE_KEYS.HISTORY, mergedParams],
    queryFn: () => monitoringService.getHistory(mergedParams),
    placeholderData: (prev) => prev,
    refetchInterval: historyRefreshInterval * 1000,
  });
};

const latestToChartData = (latest: MonitoringData | undefined): ChartData => {
  if (!latest) {
    return { ac_voltage: [], ac_current: [], dc_voltage: [], temperature: [], humidity: [] };
  }
  const timestamp = latest.recorded_at;
  return {
    ac_voltage: [{ timestamp, value: latest.ac_voltage }],
    ac_current: [{ timestamp, value: latest.ac_current }],
    dc_voltage: [{ timestamp, value: latest.dc_voltage }],
    temperature: [{ timestamp, value: latest.temperature }],
    humidity: [{ timestamp, value: latest.humidity }],
  };
};

export const useMonitoringChart = (timeRange: TimeRange) => {
  const { autoRefresh, refreshInterval, selectedDeviceId } = useSettingsStore();

  if (timeRange === '5m') {
    return useQuery({
      queryKey: [...CACHE_KEYS.LATEST, 'chart', selectedDeviceId],
      queryFn: async () => {
        const latest = await monitoringService.getLatest(selectedDeviceId);
        return latestToChartData(latest);
      },
      refetchInterval: 5000,
      placeholderData: (prev) => prev,
    });
  }

  return useQuery({
    queryKey: [...CACHE_KEYS.CHART, timeRange, selectedDeviceId],
    queryFn: () => monitoringService.getChart(timeRange, selectedDeviceId),
    refetchInterval: autoRefresh ? refreshInterval * 1000 : false,
  });
};

export const useMonitoringDetail = (id: string) => {
  return useQuery({
    queryKey: [...CACHE_KEYS.DASHBOARD, id],
    queryFn: () => monitoringService.getDetail(id),
    enabled: !!id,
  });
};
