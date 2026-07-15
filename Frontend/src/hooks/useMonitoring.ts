import { useQuery, useQueryClient } from '@tanstack/react-query';
import { monitoringService } from '../services/monitoring';
import { CACHE_KEYS } from '../constants/api';
import { HistoryParams, TimeRange, ChartData, ChartDataPoint } from '../types';
import { useSettingsStore } from '../store/settings';
import { useCallback, useState, useEffect } from 'react';

export const useDashboard = () => {
  const { selectedDeviceId } = useSettingsStore();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [...CACHE_KEYS.DASHBOARD, selectedDeviceId],
    queryFn: () => monitoringService.getDashboard(selectedDeviceId),
    refetchInterval: 5000,
  });

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: CACHE_KEYS.DASHBOARD });
  }, [queryClient]);

  return { ...query, invalidate };
};

export const useLatestMonitoring = () => {
  const { selectedDeviceId } = useSettingsStore();

  return useQuery({
    queryKey: [...CACHE_KEYS.LATEST, selectedDeviceId],
    queryFn: () => monitoringService.getLatest(selectedDeviceId),
    refetchInterval: 5000,
  });
};

export const useMonitoringHistory = (params: HistoryParams) => {
  const { selectedDeviceId } = useSettingsStore();

  const mergedParams = { ...params };
  if (selectedDeviceId) mergedParams.device_id = selectedDeviceId;

  return useQuery({
    queryKey: [...CACHE_KEYS.HISTORY, mergedParams],
    queryFn: () => monitoringService.getHistory(mergedParams),
    placeholderData: (prev) => prev,
  });
};

export const useMonitoringChart = (timeRange: TimeRange | '') => {
  const { selectedDeviceId } = useSettingsStore();
  const isRealtime = timeRange === '';

  const emptyChart: ChartData = {
    ac_voltage: [], ac_current: [], dc_voltage: [], temperature: [], humidity: [],
  };

  const { data: latest } = useQuery({
    queryKey: [...CACHE_KEYS.LATEST, 'realtime', selectedDeviceId],
    queryFn: () => monitoringService.getLatest(selectedDeviceId),
    refetchInterval: isRealtime ? 5000 : false,
    enabled: isRealtime,
  });

  const [realtimeData, setRealtimeData] = useState<ChartData>(emptyChart);

  useEffect(() => {
    if (!latest) return;

    const cutoff = Date.now() - 5 * 60 * 1000;
    const ts = latest.recorded_at;

    const addPoint = (prevPoints: ChartDataPoint[], value: number) => {
      const filtered = prevPoints.filter(
        (p) => new Date(p.timestamp).getTime() > cutoff,
      );
      return [...filtered, { timestamp: ts, value }];
    };

    setRealtimeData((prev) => ({
      ac_voltage: addPoint(prev.ac_voltage, latest.ac_voltage),
      ac_current: addPoint(prev.ac_current, latest.ac_current),
      dc_voltage: addPoint(prev.dc_voltage, latest.dc_voltage),
      temperature: addPoint(prev.temperature, latest.temperature),
      humidity: addPoint(prev.humidity, latest.humidity),
    }));
  }, [latest]);

  const chartQuery = useQuery({
    queryKey: [...CACHE_KEYS.CHART, timeRange, selectedDeviceId],
    queryFn: () => monitoringService.getChart(timeRange as TimeRange, selectedDeviceId),
    refetchInterval: !isRealtime ? 5000 : false,
    enabled: !isRealtime,
    placeholderData: (prev) => prev,
  });

  if (isRealtime) {
    return {
      data: realtimeData,
      isLoading: false,
      isError: false,
      error: null,
      refetch: () => {},
    };
  }

  return chartQuery;
};

export const useMonitoringDetail = (id: string) => {
  return useQuery({
    queryKey: [...CACHE_KEYS.DASHBOARD, id],
    queryFn: () => monitoringService.getDetail(id),
    enabled: !!id,
  });
};
