import { View, StyleSheet, Modal } from 'react-native';
import { Text, useTheme, Button, IconButton, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { COLORS, SPACING } from '../constants/theme';
import { DeviceInfo } from '../types';
import { getEffectiveStatus } from '../utils/status';

interface DeviceInfoModalProps {
  visible: boolean;
  onClose: () => void;
  device: DeviceInfo | null;
  onDeleteDevice: (device: DeviceInfo) => void;
}

const specRows = [
  { label: 'Kode Device', key: 'device_code' as const, icon: 'qr-code-outline' },
  { label: 'Nama Device', key: 'device_name' as const, icon: 'hardware-chip-outline' },
  { label: 'Lokasi', key: 'location' as const, icon: 'location-outline' },
  { label: 'Firmware', key: 'firmware_version' as const, icon: 'code-slash-outline' },
  { label: 'IP Address', key: 'ip_address' as const, icon: 'globe-outline' },
  { label: 'MAC Address', key: 'mac_address' as const, icon: 'git-network-outline' },
];

export const DeviceInfoModal = ({ visible, onClose, device, onDeleteDevice }: DeviceInfoModalProps) => {
  const theme = useTheme();

  if (!device) return null;

  const handleEdit = () => {
    onClose();
    router.push({ pathname: '/device/edit/[id]', params: { id: String(device.id) } });
  };

  const handleDelete = () => {
    onClose();
    onDeleteDevice(device);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: theme.dark ? '#0F172A' : theme.colors.surface }]}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.headerIcon, { backgroundColor: COLORS.voltageAC + '18' }]}>
                <Ionicons name="hardware-chip-outline" size={22} color={COLORS.voltageAC} />
              </View>
              <View style={styles.headerText}>
                <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                  Spesifikasi Device
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  {device.device_name}
                </Text>
              </View>
            </View>
            <IconButton icon="close" onPress={onClose} iconColor={theme.colors.onSurfaceVariant} />
          </View>

          <View style={styles.specsContainer}>
            {specRows.map((row, i) => {
              const value = device[row.key];
              return (
                <View key={row.key}>
                  <View style={styles.specRow}>
                    <View style={styles.specLabel}>
                      <Ionicons name={row.icon as any} size={16} color={theme.colors.onSurfaceVariant} />
                      <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginLeft: 8, flex: 1 }}>
                        {row.label}
                      </Text>
                    </View>
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, fontWeight: '500', maxWidth: '50%' }} numberOfLines={1}>
                      {value || '-'}
                    </Text>
                  </View>
                  {i < specRows.length - 1 && <Divider style={{ backgroundColor: theme.colors.outlineVariant, opacity: 0.4 }} />}
                </View>
              );
            })}
          </View>

          <View style={[styles.statusRow, { backgroundColor: getEffectiveStatus(device.status, device.last_seen) === 'online' ? COLORS.online + '12' : theme.colors.errorContainer + '30' }]}>
            <View style={[styles.statusDot, { backgroundColor: getEffectiveStatus(device.status, device.last_seen) === 'online' ? COLORS.online : theme.colors.error }]} />
            <Text variant="bodySmall" style={{ color: getEffectiveStatus(device.status, device.last_seen) === 'online' ? COLORS.online : theme.colors.error, fontWeight: '600' }}>
              {getEffectiveStatus(device.status, device.last_seen) === 'online' ? 'Online' : 'Offline'}
            </Text>
            {device.last_seen ? (
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginLeft: 8 }}>
                Terakhir: {new Date(device.last_seen).toLocaleString('id-ID')}
              </Text>
            ) : null}
          </View>

          <View style={styles.actions}>
            <Button
              mode="contained"
              icon="pencil-outline"
              onPress={handleEdit}
              style={styles.editBtn}
              contentStyle={styles.actionBtnContent}
            >
              Edit Device
            </Button>
            <Button
              mode="outlined"
              icon="delete-outline"
              onPress={handleDelete}
              textColor={theme.colors.error}
              style={styles.deleteBtn}
              contentStyle={styles.actionBtnContent}
            >
              Hapus Device
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: SPACING.lg,
  },
  modal: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.1)',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    flex: 1,
  },
  headerIcon: {
    width: 42,
    height: 42,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    flex: 1,
  },
  specsContainer: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: SPACING.sm + 2,
  },
  specLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: SPACING.sm,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: 10,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  actions: {
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
  },
  editBtn: {
    borderRadius: 12,
  },
  deleteBtn: {
    width: '100%',
    borderRadius: 12,
    borderColor: 'transparent',
  },
  actionBtnContent: {
    height: 44,
  },
});
