import { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import { COLORS } from '../constants/theme';
import { DeviceStatus } from '../types';

interface StatusBadgeProps {
  status: DeviceStatus;
  size?: 'sm' | 'md';
}

const statusConfig: Record<DeviceStatus, { label: string; color: string }> = {
  online: { label: 'Online', color: COLORS.online },
  offline: { label: 'Offline', color: COLORS.offline },
  warning: { label: 'Warning', color: COLORS.warning },
};

export const StatusBadge = ({ status, size = 'md' }: StatusBadgeProps) => {
  const theme = useTheme();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const config = statusConfig[status];

  useEffect(() => {
    if (status !== 'online') return;
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 0.3,
          duration: 1500,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1500,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, [status]);

  return (
    <View
      style={[
        styles.badge,
        size === 'sm' && styles.badgeSm,
        { backgroundColor: config.color + '15' },
      ]}
    >
      <View style={[styles.dotWrap, size === 'sm' && styles.dotWrapSm]}>
        <View style={[styles.dot, { backgroundColor: config.color }]} />
        {status === 'online' && (
          <Animated.View
            style={[
              styles.pulse,
              {
                borderColor: config.color,
                opacity: pulseAnim,
              },
            ]}
          />
        )}
      </View>
      <Text
        variant={size === 'sm' ? 'labelSmall' : 'labelMedium'}
        style={[styles.label, { color: config.color }]}
      >
        {config.label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    alignSelf: 'flex-start',
    gap: 8,
  },
  badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  dotWrap: {
    width: 10,
    height: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dotWrapSm: {
    width: 8,
    height: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  pulse: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
  },
  label: {
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
