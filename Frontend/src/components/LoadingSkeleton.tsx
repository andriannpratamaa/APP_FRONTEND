import { View, StyleSheet, Animated } from 'react-native';
import { useTheme } from 'react-native-paper';
import { useEffect, useRef } from 'react';
import { SPACING } from '../constants/theme';

interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: object;
}

export const Skeleton = ({
  width = '100%',
  height = 20,
  borderRadius = 8,
  style,
}: SkeletonProps) => {
  const theme = useTheme();
  const opacity = useRef(new Animated.Value(0.3));

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity.current, {
          toValue: 0.6,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(opacity.current, {
          toValue: 0.3,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View
      style={[
        {
          width: width as number | undefined,
          height,
          borderRadius,
          backgroundColor: theme.colors.surfaceVariant,
          opacity: opacity.current,
        },
        style,
      ]}
    />
  );
};

export const MonitoringCardSkeleton = () => {
  const theme = useTheme();
  return (
    <View style={[styles.card, {
      backgroundColor: theme.dark ? 'rgba(30, 41, 59, 0.7)' : theme.colors.elevation.level1,
    }]}>
      <View style={styles.row}>
        <Skeleton width={52} height={52} borderRadius={16} />
        <View style={styles.content}>
          <Skeleton width={100} height={12} style={styles.mb} />
          <Skeleton width={140} height={26} />
        </View>
      </View>
    </View>
  );
};

export const DashboardSkeleton = () => {
  return (
    <View style={styles.container}>
      {[1, 2, 3, 4, 5].map((i) => (
        <MonitoringCardSkeleton key={i} />
      ))}
      <Skeleton width="100%" height={220} borderRadius={16} style={styles.chart} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: SPACING.md,
  },
  card: {
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    borderRadius: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    marginLeft: SPACING.md,
  },
  mb: {
    marginBottom: 8,
  },
  chart: {
    marginTop: SPACING.md,
  },
});
