import { View, StyleSheet, Modal, Platform } from 'react-native';
import { Text, useTheme, IconButton } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { ChartComponent } from './ChartComponent';
import { COLORS, SPACING } from '../constants/theme';
import { ChartData } from '../types';

interface ChartPopupProps {
  visible: boolean;
  onClose: () => void;
  chartData: ChartData | undefined;
  isLoading: boolean;
  title: string;
  color: string;
  unit: string;
  dataKey: keyof ChartData;
}

export const ChartPopup = ({ visible, onClose, chartData, isLoading, title, color, unit, dataKey }: ChartPopupProps) => {
  const theme = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modal, { backgroundColor: theme.dark ? '#0F172A' : theme.colors.surface }]}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={[styles.headerIcon, { backgroundColor: color + '18' }]}>
                <Ionicons name="stats-chart" size={20} color={color} />
              </View>
              <View>
                <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                  {title}
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  Grafik {unit}
                </Text>
              </View>
            </View>
            <IconButton icon="close" onPress={onClose} iconColor={theme.colors.onSurfaceVariant} />
          </View>

          <View style={styles.content}>
            {isLoading ? (
              <View style={styles.loadingState}>
                <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                  Memuat grafik...
                </Text>
              </View>
            ) : (
              <ChartComponent
                data={chartData?.[dataKey] || []}
                color={color}
                unit={unit}
                height={280}
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'web' ? SPACING.lg : SPACING.xl,
    minHeight: 400,
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
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: SPACING.md,
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  loadingState: {
    padding: SPACING.xl,
    alignItems: 'center',
  },
});
