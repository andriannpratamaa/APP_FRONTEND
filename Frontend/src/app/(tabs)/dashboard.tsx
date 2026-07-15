import { useCallback, useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Text, useTheme, Card, Button } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useDevices } from '../../hooks/useDevice';
import { StatusBadge } from '../../components/StatusBadge';
import { DeviceInfoModal } from '../../components/DeviceInfoModal';
import { ConfirmDialog } from '../../components/ConfirmDialog';
import { ErrorState } from '../../components/ErrorState';
import { deviceService } from '../../services/device';
import { useQueryClient } from '@tanstack/react-query';
import { CACHE_KEYS } from '../../constants/api';
import { SPACING, COLORS } from '../../constants/theme';
import { DeviceInfo } from '../../types';
import { getEffectiveStatus } from '../../utils/status';

export default function DashboardScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { data: devices, isLoading, isError, error, refetch } = useDevices();
  const [selectedDevice, setSelectedDevice] = useState<DeviceInfo | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<DeviceInfo | null>(null);
  const [deleting, setDeleting] = useState(false);

  const handleDeleteDevice = (device: DeviceInfo) => {
    setDeleteTarget(device);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deviceService.delete(deleteTarget.id);
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.DEVICES });
      setDeleteTarget(null);
    } catch (err: unknown) {
      let msg = 'Gagal menghapus device';
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response: { data: { message?: string; errors?: Record<string, string[]> } } };
        if (axiosErr.response?.data?.message) {
          msg = axiosErr.response.data.message;
        } else if (axiosErr.response?.data?.errors) {
          const first = Object.values(axiosErr.response.data.errors)[0];
          if (first?.length) msg = first[0];
        }
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setDeleteTarget(null);
      setDeleting(false);
    } finally {
      setDeleting(false);
    }
  };

  const onRefresh = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: CACHE_KEYS.DEVICES });
  }, [queryClient]);

  const renderDevice = ({ item, index }: { item: DeviceInfo; index: number }) => {
    const effectiveStatus = getEffectiveStatus(item.status, item.last_seen);
    const isOnline = effectiveStatus === 'online';
    const colors = [
      { bg: COLORS.voltageAC + '15', icon: COLORS.voltageAC },
      { bg: COLORS.currentAC + '15', icon: COLORS.currentAC },
      { bg: COLORS.voltageDC + '15', icon: COLORS.voltageDC },
      { bg: COLORS.temperature + '15', icon: COLORS.temperature },
      { bg: COLORS.humidity + '15', icon: COLORS.humidity },
    ];
    const color = colors[index % colors.length];

    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => router.push({ pathname: '/device/[id]', params: { id: String(item.id) } })}
        onLongPress={() => {
          setSelectedDevice(item);
          setModalVisible(true);
        }}
        delayLongPress={500}
      >
        <Card
          style={[
            styles.deviceCard,
            {
              backgroundColor: theme.dark
                ? 'rgba(30, 41, 59, 0.7)'
                : theme.colors.elevation.level1,
              borderColor: isOnline ? COLORS.online + '30' : 'transparent',
            },
          ]}
        >
          <Card.Content style={styles.cardContent}>
            <View style={[styles.cardIcon, { backgroundColor: color.bg }]}>
              <Ionicons name="hardware-chip-outline" size={24} color={color.icon} />
            </View>
            <View style={styles.cardInfo}>
              <View style={styles.cardHeader}>
                <Text variant="titleMedium" style={[styles.deviceName, { color: theme.colors.onSurface }]} numberOfLines={1}>
                  {item.device_name}
                </Text>
                <StatusBadge status={effectiveStatus} size="sm" />
              </View>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }} numberOfLines={1}>
                {item.device_code}
              </Text>
              {item.location ? (
                <View style={styles.locationRow}>
                  <Ionicons name="location-outline" size={12} color={theme.colors.onSurfaceVariant} />
                  <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginLeft: 4 }}>
                    {item.location}
                  </Text>
                </View>
              ) : null}
            </View>
            <Ionicons name="chevron-forward" size={20} color={theme.colors.onSurfaceVariant} />
          </Card.Content>
        </Card>
      </TouchableOpacity>
    );
  };

  const renderHeader = () => (
    <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
      <View style={styles.headerLeft}>
        <View style={[styles.headerIcon, { backgroundColor: theme.colors.primary + '18' }]}>
          <Ionicons name="speedometer" size={20} color={theme.colors.primary} />
        </View>
        <View>
          <Text variant="headlineSmall" style={[styles.headerTitle, { color: theme.colors.onSurface }]}>
            Perangkat
          </Text>
          <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
            {devices ? `${devices.length} device terdaftar` : 'Memuat...'}
          </Text>
        </View>
      </View>
    </View>
  );

  if (isError) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        {renderHeader()}
        <ErrorState
          message={(error as Error)?.message || 'Gagal memuat device'}
          onRetry={refetch}
        />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderHeader()}

      <FlatList
        data={devices}
        renderItem={renderDevice}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={onRefresh}
            colors={[theme.colors.primary]}
            tintColor={theme.colors.primary}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={styles.emptyState}>
              <View style={[styles.emptyIcon, { backgroundColor: theme.colors.primary + '12' }]}>
                <Ionicons name="hardware-chip-outline" size={40} color={theme.colors.primary} />
              </View>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                Belum ada device
              </Text>
              <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, textAlign: 'center', marginTop: 4 }}>
                Tambah device baru untuk mulai monitoring
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          <View style={styles.footer}>
            <Button
              mode="contained"
              icon="plus"
              onPress={() => router.push('/device/add')}
              style={styles.addBtn}
              contentStyle={styles.addBtnContent}
            >
              Tambah Device
            </Button>
            <View style={{ height: SPACING.xxl }} />
          </View>
        }
      />

      <DeviceInfoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        device={selectedDevice}
        onDeleteDevice={handleDeleteDevice}
      />

      <ConfirmDialog
        visible={deleteTarget !== null}
        title="Hapus Device"
        message={deleteTarget ? `Yakin ingin menghapus "${deleteTarget.device_name}"? Semua data monitoring akan ikut terhapus.` : ''}
        confirmLabel="Hapus"
        destructive
        loading={deleting}
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
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
  listContent: {
    padding: SPACING.md,
    paddingTop: 0,
  },
  deviceCard: {
    borderRadius: 16,
    marginBottom: SPACING.sm,
    borderWidth: 1,
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  deviceName: {
    fontWeight: '700',
    flex: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  footer: {
    paddingTop: SPACING.sm,
  },
  addBtn: {
    borderRadius: 12,
  },
  addBtnContent: {
    height: 48,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xl * 2,
    gap: SPACING.sm,
  },
  emptyIcon: {
    width: 72,
    height: 72,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
