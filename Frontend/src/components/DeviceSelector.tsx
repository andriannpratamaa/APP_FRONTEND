import { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, FlatList } from 'react-native';
import { Text, useTheme, RadioButton, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import { useSettingsStore } from '../store/settings';
import { deviceService } from '../services/device';
import { CACHE_KEYS } from '../constants/api';
import { COLORS, SPACING } from '../constants/theme';

export const DeviceSelector = () => {
  const theme = useTheme();
  const { selectedDeviceId, setSelectedDeviceId } = useSettingsStore();
  const [visible, setVisible] = useState(false);

  const { data: devices } = useQuery({
    queryKey: CACHE_KEYS.DEVICES,
    queryFn: deviceService.getAll,
  });

  if (!devices || devices.length === 0) return null;

  const selectedDevice = devices.find((d) => d.id === selectedDeviceId);
  const isOnline = selectedDevice?.status === 'online';

  return (
    <>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setVisible(true)}
        style={[styles.trigger, { backgroundColor: theme.dark ? 'rgba(30,41,59,0.7)' : theme.colors.elevation.level1, borderColor: theme.colors.outlineVariant }]}
      >
        <View style={styles.triggerLeft}>
          <View style={[styles.triggerIcon, { backgroundColor: (isOnline ? COLORS.online : theme.colors.error) + '18' }]}>
            <Ionicons name="hardware-chip-outline" size={18} color={isOnline ? COLORS.online : theme.colors.error} />
          </View>
          <View>
            <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, fontWeight: '600' }}>
              Device
            </Text>
            <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
              {selectedDevice ? selectedDevice.device_name || selectedDevice.device_code : 'Semua Device'}
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-down" size={20} color={theme.colors.onSurfaceVariant} />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setVisible(false)}
        >
          <View style={[styles.dropdown, { backgroundColor: theme.dark ? '#0F172A' : theme.colors.surface }]}>
            <View style={styles.dropdownHeader}>
              <Text variant="titleMedium" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                Pilih Device
              </Text>
              <IconButton icon="close" size={20} onPress={() => setVisible(false)} iconColor={theme.colors.onSurfaceVariant} />
            </View>
            <FlatList
              data={devices}
              keyExtractor={(item) => String(item.id)}
              renderItem={({ item }) => {
                const selected = item.id === selectedDeviceId;
                const online = item.status === 'online';
                return (
                  <TouchableOpacity
                    style={[styles.deviceOption, { backgroundColor: selected ? theme.colors.primary + '10' : 'transparent' }]}
                    onPress={() => {
                      setSelectedDeviceId(selectedDeviceId === item.id ? null : item.id);
                      setVisible(false);
                    }}
                  >
                    <View style={styles.optionLeft}>
                      <View style={[styles.optionDot, { backgroundColor: online ? COLORS.online : theme.colors.error }]} />
                      <View style={styles.optionInfo}>
                        <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, fontWeight: selected ? '700' : '500' }}>
                          {item.device_name || item.device_code}
                        </Text>
                        <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                          {item.device_code} {online ? '• Online' : '• Offline'}
                        </Text>
                      </View>
                    </View>
                    <RadioButton
                      value={String(item.id)}
                      status={selected ? 'checked' : 'unchecked'}
                      onPress={() => {
                        setSelectedDeviceId(selectedDeviceId === item.id ? null : item.id);
                        setVisible(false);
                      }}
                    />
                  </TouchableOpacity>
                );
              }}
              ListHeaderComponent={
                <TouchableOpacity
                  style={[styles.deviceOption, { backgroundColor: !selectedDeviceId ? theme.colors.primary + '10' : 'transparent' }]}
                  onPress={() => {
                    setSelectedDeviceId(null);
                    setVisible(false);
                  }}
                >
                  <View style={styles.optionLeft}>
                    <View style={[styles.optionDot, { backgroundColor: theme.colors.onSurfaceVariant }]} />
                    <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, fontWeight: !selectedDeviceId ? '700' : '500' }}>
                      Semua Device
                    </Text>
                  </View>
                  <RadioButton
                    value=""
                    status={!selectedDeviceId ? 'checked' : 'unchecked'}
                    onPress={() => {
                      setSelectedDeviceId(null);
                      setVisible(false);
                    }}
                  />
                </TouchableOpacity>
              }
            />
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: SPACING.md,
    marginBottom: SPACING.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderRadius: 12,
    borderWidth: 1,
  },
  triggerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  triggerIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: SPACING.lg,
  },
  dropdown: {
    width: '100%',
    maxWidth: 400,
    maxHeight: '70%',
    borderRadius: 16,
    overflow: 'hidden',
  },
  dropdownHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(148, 163, 184, 0.1)',
  },
  deviceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm + 4,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    flex: 1,
  },
  optionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  optionInfo: {
    flex: 1,
  },
});
