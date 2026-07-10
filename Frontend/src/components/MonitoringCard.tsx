import { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Card, Text, useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';

interface MonitoringCardProps {
  title: string;
  value: string;
  unit: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  status?: 'normal' | 'warning' | 'critical';
  onPress?: () => void;
  index?: number;
}

export const MonitoringCard = ({
  title,
  value,
  unit,
  icon,
  color,
  status = 'normal',
  onPress,
  index = 0,
}: MonitoringCardProps) => {
  const theme = useTheme();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(24)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        delay: index * 80,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const statusColor =
    status === 'critical'
      ? COLORS.offline
      : status === 'warning'
        ? COLORS.warning
        : COLORS.online;

  return (
    <Animated.View
      style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}
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
        onPress={onPress}
      >
        <View style={styles.accentBar}>
          <View style={[styles.accentFill, { backgroundColor: color }]} />
        </View>
        <View style={styles.container}>
          <View style={[styles.iconOuter, { backgroundColor: color + '18' }]}>
            <View style={[styles.iconInner, { backgroundColor: color + '28' }]}>
              <Ionicons name={icon} size={22} color={color} />
            </View>
          </View>
          <View style={styles.content}>
            <Text
              variant="labelSmall"
              style={[styles.title, { color: theme.colors.onSurfaceVariant }]}
            >
              {title}
            </Text>
            <View style={styles.valueRow}>
              <Text
                variant="headlineSmall"
                style={[styles.value, { color: theme.colors.onSurface }]}
              >
                {value}
              </Text>
              <Text
                variant="labelMedium"
                style={[styles.unit, { color: theme.colors.onSurfaceVariant }]}
              >
                {unit}
              </Text>
            </View>
          </View>
          {status !== 'normal' && (
            <View style={[styles.statusDot, { backgroundColor: statusColor }]} />
          )}
        </View>
      </Card>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.sm,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  accentBar: {
    height: 3,
    width: '100%',
    backgroundColor: 'transparent',
  },
  accentFill: {
    height: '100%',
    width: '40%',
    borderBottomRightRadius: 3,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SPACING.md,
  },
  iconOuter: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  iconInner: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  title: {
    marginBottom: 4,
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontWeight: '700',
    marginRight: SPACING.xs,
    letterSpacing: 0.5,
  },
  unit: {
    opacity: 0.6,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    position: 'absolute',
    top: 14,
    right: 14,
  },
});
