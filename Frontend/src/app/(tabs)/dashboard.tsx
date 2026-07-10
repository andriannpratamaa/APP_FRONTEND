import { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { Text, useTheme, SegmentedButtons } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useDashboard, useMonitoringChart } from '../../hooks/useMonitoring';
import { MonitoringCard } from '../../components/MonitoringCard';
import { StatusBadge } from '../../components/StatusBadge';
import { DashboardSkeleton } from '../../components/LoadingSkeleton';
import { ErrorState } from '../../components/ErrorState';
import { DeviceSelector } from '../../components/DeviceSelector';
import { ChartPopup } from '../../components/ChartPopup';
import { COLORS, SPACING } from '../../constants/theme';
import {
  formatVoltage,
  formatCurrent,
  formatTemperature,
  formatHumidity,
  formatTimeAgo,
} from '../../utils/format';
import { TimeRange, ChartData } from '../../types';

const timeRangeOptions = [
  { label: '1j', value: '1h' },
  { label: '6j', value: '6h' },
  { label: '24j', value: '24h' },
  { label: '7h', value: '7d' },
  { label: '30h', value: '30d' },
];

interface SelectedChart {
  title: string;
  color: string;
  unit: string;
  dataKey: keyof ChartData;
}

export default function DashboardScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [timeRange, setTimeRange] = useState<TimeRange>('1h');
  const [refreshing, setRefreshing] = useState(false);
  const [selectedChart, setSelectedChart] = useState<SelectedChart | null>(null);

  const {
    data: dashboard,
    isLoading: isDashboardLoading,
    isError: isDashboardError,
    error: dashboardError,
    refetch: refetchDashboard,
  } = useDashboard();

  const {
    data: chartData,
    isLoading: isChartLoading,
  } = useMonitoringChart(timeRange);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetchDashboard();
    setRefreshing(false);
  }, [refetchDashboard]);

  const latestData = dashboard?.latest_monitoring;

  const getStatus = (value: number, critical: number, warning: number): 'critical' | 'warning' | 'normal' => {
    return value > critical ? 'critical' : value > warning ? 'warning' : 'normal';
  };

  const zeroData = { ac_voltage: 0, ac_current: 0, dc_voltage: 0, temperature: 0, humidity: 0 };

  const data = latestData || zeroData;

  const monitoringCards = useMemo(
    () => [
      {
        title: 'Tegangan AC',
        value: formatVoltage(data.ac_voltage),
        unit: 'Volt',
        icon: 'flash-outline' as keyof typeof Ionicons.glyphMap,
        color: COLORS.voltageAC,
        status: getStatus(data.ac_voltage, 240, 220),
        dataKey: 'ac_voltage' as keyof ChartData,
      },
      {
        title: 'Arus AC',
        value: formatCurrent(data.ac_current),
        unit: 'Ampere',
        icon: 'barbell-outline' as keyof typeof Ionicons.glyphMap,
        color: COLORS.currentAC,
        status: getStatus(data.ac_current, 10, 8),
        dataKey: 'ac_current' as keyof ChartData,
      },
      {
        title: 'Tegangan DC',
        value: formatVoltage(data.dc_voltage),
        unit: 'Volt',
        icon: 'battery-full-outline' as keyof typeof Ionicons.glyphMap,
        color: COLORS.voltageDC,
        status: data.dc_voltage < 11 ? 'critical' as const : data.dc_voltage < 12 ? 'warning' as const : 'normal' as const,
        dataKey: 'dc_voltage' as keyof ChartData,
      },
      {
        title: 'Suhu',
        value: formatTemperature(data.temperature),
        unit: '°C',
        icon: 'thermometer-outline' as keyof typeof Ionicons.glyphMap,
        color: COLORS.temperature,
        status: getStatus(data.temperature, 45, 35),
        dataKey: 'temperature' as keyof ChartData,
      },
      {
        title: 'Kelembapan',
        value: formatHumidity(data.humidity),
        unit: '%RH',
        icon: 'water-outline' as keyof typeof Ionicons.glyphMap,
        color: COLORS.humidity,
        status: 'normal' as const,
        dataKey: 'humidity' as keyof ChartData,
      },
    ],
    [data]
  );

  if (isDashboardLoading) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <DashboardSkeleton />
      </View>
    );
  }

  if (isDashboardError) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ErrorState
          message={(dashboardError as Error)?.message || 'Gagal memuat data'}
          onRetry={refetchDashboard}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
        <View style={styles.headerLeft}>
          <View style={[styles.headerIcon, { backgroundColor: theme.colors.primary + '18' }]}>
            <Ionicons name="speedometer" size={20} color={theme.colors.primary} />
          </View>
          <View>
            <Text
              variant="headlineSmall"
              style={[styles.headerTitle, { color: theme.colors.onSurface }]}
            >
              Dashboard
            </Text>
            <Text
              variant="bodySmall"
              style={{ color: theme.colors.onSurfaceVariant }}
            >
              {dashboard?.last_update ? formatTimeAgo(dashboard.last_update) : 'Memuat...'}
            </Text>
          </View>
        </View>
        <StatusBadge status={latestData?.status === 'online' ? 'online' : 'offline'} />
      </View>

      <DeviceSelector />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
      >
        <View style={styles.sectionLabel}>
          <Text
            variant="titleSmall"
            style={{ color: theme.colors.onSurfaceVariant, fontWeight: '700', letterSpacing: 0.5 }}
          >
            MONITORING
          </Text>
        </View>
        {monitoringCards.map((card, index) => (
          <MonitoringCard
            key={index}
            title={card.title}
            value={card.value}
            unit={card.unit}
            icon={card.icon}
            color={card.color}
            status={card.status}
            index={index}
            onPress={() => setSelectedChart({
              title: card.title,
              color: card.color,
              unit: card.unit,
              dataKey: card.dataKey,
            })}
          />
        ))}

        <View style={styles.chartSection}>
          <Text
            variant="titleSmall"
            style={{ color: theme.colors.onSurfaceVariant, fontWeight: '700', letterSpacing: 0.5, marginBottom: SPACING.sm }}
          >
            RENTANG WAKTU GRAFIK
          </Text>
          <SegmentedButtons
            value={timeRange}
            onValueChange={(val) => setTimeRange(val as TimeRange)}
            buttons={timeRangeOptions}
            density="small"
            style={styles.rangeButtons}
          />
        </View>

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>

      <ChartPopup
        visible={!!selectedChart}
        onClose={() => setSelectedChart(null)}
        chartData={chartData}
        isLoading={isChartLoading}
        title={selectedChart?.title || ''}
        color={selectedChart?.color || ''}
        unit={selectedChart?.unit || ''}
        dataKey={selectedChart?.dataKey || 'ac_voltage'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: '800',
  },
  scrollContent: {
    padding: SPACING.md,
  },
  sectionLabel: {
    paddingHorizontal: SPACING.xs,
    paddingBottom: SPACING.sm,
  },
  chartSection: {
    paddingHorizontal: SPACING.xs,
    paddingTop: SPACING.md,
  },
  rangeButtons: {
    marginBottom: SPACING.sm,
  },
});
