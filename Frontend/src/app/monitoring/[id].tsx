import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  useTheme,
  Card,
  Divider,
  ActivityIndicator,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import { useMonitoringDetail } from '../../hooks/useMonitoring';
import { StatusBadge } from '../../components/StatusBadge';
import { ErrorState } from '../../components/ErrorState';
import { SPACING, COLORS } from '../../constants/theme';
import {
  formatTimestamp,
  formatVoltage,
  formatCurrent,
  formatTemperature,
  formatHumidity,
} from '../../utils/format';

export default function MonitoringDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();

  const { data, isLoading, isError, error, refetch } = useMonitoringDetail(id);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (isError || !data) {
    return (
      <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <ErrorState
          message={(error as Error)?.message || 'Data tidak ditemukan'}
          onRetry={refetch}
        />
      </View>
    );
  }

  const parameters = [
    {
      icon: 'flash-outline' as const,
      label: 'Tegangan AC',
      value: formatVoltage(data.ac_voltage),
      color: COLORS.voltageAC,
      status: data.ac_voltage > 240 ? 'Tinggi' : 'Normal',
    },
    {
      icon: 'barbell-outline' as const,
      label: 'Arus AC',
      value: formatCurrent(data.ac_current),
      color: COLORS.currentAC,
      status: data.ac_current > 10 ? 'Berlebih' : 'Normal',
    },
    {
      icon: 'battery-full-outline' as const,
      label: 'Tegangan DC',
      value: formatVoltage(data.dc_voltage),
      color: COLORS.voltageDC,
      status: data.dc_voltage < 11 ? 'Rendah' : 'Normal',
    },
    {
      icon: 'thermometer-outline' as const,
      label: 'Suhu',
      value: formatTemperature(data.temperature),
      color: COLORS.temperature,
      status: data.temperature > 45 ? 'Tinggi' : 'Normal',
    },
    {
      icon: 'water-outline' as const,
      label: 'Kelembapan',
      value: formatHumidity(data.humidity),
      color: COLORS.humidity,
      status: 'Normal',
    },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card
          style={[
            styles.timestampCard,
            {
              backgroundColor: theme.dark
                ? 'rgba(30, 41, 59, 0.7)'
                : theme.colors.elevation.level1,
              borderColor: theme.dark ? 'rgba(148, 163, 184, 0.08)' : 'transparent',
            },
          ]}
        >
          <Card.Content style={styles.timestampContent}>
            <View style={[styles.dateIcon, { backgroundColor: theme.colors.primary + '12' }]}>
              <Ionicons name="time-outline" size={20} color={theme.colors.primary} />
            </View>
            <View style={styles.timestampInfo}>
              <Text variant="bodyMedium" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                {formatTimestamp(data.recorded_at)}
              </Text>
              <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant }}>
                Waktu Perekaman
              </Text>
            </View>
            <StatusBadge status={data.status} />
          </Card.Content>
        </Card>

        <Card
          style={[
            styles.paramsCard,
            {
              backgroundColor: theme.dark
                ? 'rgba(30, 41, 59, 0.7)'
                : theme.colors.elevation.level1,
              borderColor: theme.dark ? 'rgba(148, 163, 184, 0.08)' : 'transparent',
            },
          ]}
        >
          <Card.Content>
            <Text
              variant="titleMedium"
              style={[styles.sectionTitle, { color: theme.colors.onSurface }]}
            >
              Parameter
            </Text>
            {parameters.map((param, index) => (
              <View key={param.label}>
                <View style={styles.paramRow}>
                  <View style={[styles.paramIcon, { backgroundColor: param.color + '18' }]}>
                    <View style={[styles.paramIconInner, { backgroundColor: param.color + '28' }]}>
                      <Ionicons name={param.icon} size={18} color={param.color} />
                    </View>
                  </View>
                  <View style={styles.paramInfo}>
                    <Text
                      variant="bodySmall"
                      style={{ color: theme.colors.onSurfaceVariant }}
                    >
                      {param.label}
                    </Text>
                    <Text
                      variant="bodyLarge"
                      style={[styles.paramValue, { color: theme.colors.onSurface }]}
                    >
                      {param.value}
                    </Text>
                  </View>
                  <Text
                    variant="labelSmall"
                    style={{
                      color:
                        param.status === 'Normal'
                          ? COLORS.online
                          : COLORS.warning,
                      fontWeight: '700',
                    }}
                  >
                    {param.status}
                  </Text>
                </View>
                {index < parameters.length - 1 && (
                  <Divider style={[styles.divider, { backgroundColor: theme.colors.outline }]} />
                )}
              </View>
            ))}
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: SPACING.md,
  },
  timestampCard: {
    borderRadius: 16,
    marginBottom: SPACING.md,
    borderWidth: 1,
  },
  timestampContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  dateIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timestampInfo: {
    flex: 1,
  },
  paramsCard: {
    borderRadius: 16,
    marginBottom: SPACING.md,
    borderWidth: 1,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  paramRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
  },
  paramIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  paramIconInner: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  paramInfo: {
    flex: 1,
  },
  paramValue: {
    fontWeight: '700',
  },
  divider: {
    marginVertical: SPACING.xs,
    opacity: 0.5,
  },
});
