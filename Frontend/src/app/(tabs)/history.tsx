import { useState, useCallback, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  useTheme,
  Card,
  IconButton,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useMonitoringHistory } from '../../hooks/useMonitoring';
import { FilterBar } from '../../components/FilterBar';
import { StatusBadge } from '../../components/StatusBadge';
import { Skeleton } from '../../components/LoadingSkeleton';
import { ErrorState } from '../../components/ErrorState';
import { EmptyState } from '../../components/EmptyState';
import { ExportButton } from '../../components/ExportButton';
import { DeviceSelector } from '../../components/DeviceSelector';
import { COLORS, SPACING } from '../../constants/theme';
import { formatDate, formatTime, formatVoltage, formatCurrent, formatTemperature, formatHumidity } from '../../utils/format';
import { HistoryParams, MonitoringData } from '../../types';

const ITEMS_PER_PAGE = 20;

const filterOptions = [
  { label: 'Hari', value: 'day' },
  { label: 'Minggu', value: 'week' },
  { label: 'Bulan', value: 'month' },
  { label: 'Kustom', value: 'custom' },
];

const ParamBadge = ({ label, value, color }: { label: string; value: string; color: string }) => (
  <View style={[styles.paramBadge, { backgroundColor: color + '12' }]}>
    <Text variant="labelSmall" style={{ color, fontWeight: '600', letterSpacing: 0.3 }}>
      {label}
    </Text>
    <Text variant="bodySmall" style={{ color, fontWeight: '700' }}>
      {value}
    </Text>
  </View>
);

export default function HistoryScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterValue, setFilterValue] = useState('day');
  const [page, setPage] = useState(1);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [refreshing, setRefreshing] = useState(false);

  const queryParams: HistoryParams = useMemo(
    () => ({
      page,
      limit: ITEMS_PER_PAGE,
      sort_by: 'recorded_at',
      sort_order: sortOrder,
      search: searchQuery || undefined,
      filter: filterValue as HistoryParams['filter'],
    }),
    [page, sortOrder, searchQuery, filterValue]
  );

  const {
    data,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useMonitoringHistory(queryParams);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, [refetch]);

  const handleLoadMore = useCallback(() => {
    if (data && page < data.total_pages && !isFetching) {
      setPage((p) => p + 1);
    }
  }, [data, page, isFetching]);

  const renderItem = useCallback(
    ({ item }: { item: MonitoringData }) => (
      <TouchableOpacity
        onPress={() => router.push(`/monitoring/${item.id}`)}
        activeOpacity={0.7}
      >
        <Card
          style={[
            styles.card,
            {
              backgroundColor: theme.dark
                ? 'rgba(30, 41, 59, 0.7)'
                : theme.colors.elevation.level1,
              borderColor: theme.dark ? 'rgba(148, 163, 184, 0.08)' : 'transparent',
            },
          ]}
        >
          <Card.Content>
            <View style={styles.cardHeader}>
              <View style={styles.cardHeaderLeft}>
                <View style={[styles.dateIcon, { backgroundColor: theme.colors.primary + '12' }]}>
                  <Ionicons name="calendar-outline" size={16} color={theme.colors.primary} />
                </View>
                <View>
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.onSurfaceVariant, fontWeight: '500' }}
                  >
                    {formatDate(item.recorded_at)}
                  </Text>
                  <Text
                    variant="labelSmall"
                    style={{ color: theme.colors.onSurfaceVariant, opacity: 0.6 }}
                  >
                    {formatTime(item.recorded_at)}
                  </Text>
                </View>
              </View>
              <StatusBadge status={item.status} size="sm" />
            </View>

            <View style={styles.cardBody}>
              <ParamBadge label="Tegangan AC" value={formatVoltage(item.ac_voltage)} color={COLORS.voltageAC} />
              <ParamBadge label="Arus AC" value={formatCurrent(item.ac_current)} color={COLORS.currentAC} />
              <ParamBadge label="Tegangan DC" value={formatVoltage(item.dc_voltage)} color={COLORS.voltageDC} />
              <ParamBadge label="Suhu" value={formatTemperature(item.temperature)} color={COLORS.temperature} />
              <ParamBadge label="Kelembapan" value={formatHumidity(item.humidity)} color={COLORS.humidity} />
            </View>
          </Card.Content>
        </Card>
      </TouchableOpacity>
    ),
    [theme, router]
  );

  const renderFooter = useCallback(() => {
    if (!isFetching || !data) return null;
    return (
      <View style={styles.loadingFooter}>
        <Text
          variant="bodySmall"
          style={{ color: theme.colors.onSurfaceVariant }}
        >
          Memuat data...
        </Text>
      </View>
    );
  }, [isFetching, data, theme]);

  if (isLoading && !data) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <View style={styles.loadingContainer}>
          {[1, 2, 3, 4, 5].map((i) => (
            <View key={i} style={styles.skeletonCard}>
              <Skeleton width="100%" height={120} borderRadius={16} />
            </View>
          ))}
        </View>
      </View>
    );
  }

  if (isError) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ErrorState
          message={(error as Error)?.message || 'Gagal memuat riwayat'}
          onRetry={refetch}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
        <View style={[styles.headerIcon, { backgroundColor: theme.colors.primary + '18' }]}>
          <Ionicons name="time" size={20} color={theme.colors.primary} />
        </View>
        <Text
          variant="headlineSmall"
          style={[styles.headerTitle, { color: theme.colors.onSurface }]}
        >
          Riwayat
        </Text>
        <View style={styles.headerActions}>
          <IconButton
            icon={sortOrder === 'desc' ? 'sort-calendar-descending' : 'sort-calendar-ascending'}
            onPress={() => setSortOrder((o) => (o === 'desc' ? 'asc' : 'desc'))}
            size={22}
            iconColor={theme.colors.onSurfaceVariant}
          />
        </View>
      </View>

      <DeviceSelector />

      <FilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        filterValue={filterValue}
        onFilterChange={setFilterValue}
        filterOptions={filterOptions}
      />

      <ExportButton />

      <FlatList
        data={data?.data || []}
        renderItem={renderItem}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={
          <EmptyState
            icon="document-text-outline"
            title="Tidak Ada Data"
            description="Belum ada data monitoring untuk periode ini"
            actionLabel="Refresh"
            onAction={refetch}
          />
        }
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
    alignItems: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.xs,
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
    flex: 1,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  listContent: {
    padding: SPACING.md,
    paddingBottom: SPACING.xxl,
  },
  card: {
    marginBottom: SPACING.sm,
    borderRadius: 16,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  cardHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  dateIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardBody: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.xs,
  },
  paramBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    alignItems: 'center',
    minWidth: 60,
  },
  loadingContainer: {
    padding: SPACING.md,
  },
  skeletonCard: {
    marginBottom: SPACING.sm,
  },
  loadingFooter: {
    padding: SPACING.md,
    alignItems: 'center',
  },
});
