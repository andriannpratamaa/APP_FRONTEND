import { View, StyleSheet } from 'react-native';
import { SegmentedButtons, useTheme } from 'react-native-paper';
import { useQuery } from '@tanstack/react-query';
import { useSettingsStore } from '../store/settings';
import { deviceService } from '../services/device';
import { CACHE_KEYS } from '../constants/api';

export const DeviceSelector = () => {
  const theme = useTheme();
  const { selectedDeviceId, setSelectedDeviceId } = useSettingsStore();

  const { data: devices } = useQuery({
    queryKey: CACHE_KEYS.DEVICES,
    queryFn: deviceService.getAll,
  });

  if (!devices || devices.length < 2) return null;

  const buttons = devices.map((d) => ({
    label: d.device_name || d.device_code,
    value: String(d.id),
  }));

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.elevation.level1 }]}>
      <SegmentedButtons
        value={String(selectedDeviceId || devices[0]?.id || '')}
        onValueChange={(val) => setSelectedDeviceId(Number(val))}
        buttons={buttons}
        density="small"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
});
