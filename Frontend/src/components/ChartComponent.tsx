import { View, StyleSheet } from 'react-native';
import { Text, useTheme } from 'react-native-paper';
import Svg, { Line, Path, Circle, Defs, LinearGradient, Stop } from 'react-native-svg';
import { ChartDataPoint } from '../types';

interface ChartComponentProps {
  data: ChartDataPoint[];
  color: string;
  unit: string;
  height?: number;
}

export const ChartComponent = ({
  data,
  color,
  unit,
  height = 200,
}: ChartComponentProps) => {
  const theme = useTheme();

  if (!data || data.length === 0) {
    return (
      <View style={[styles.container, { height }]}>
        <Text style={{ color: theme.colors.onSurfaceVariant }}>
          Tidak ada data
        </Text>
      </View>
    );
  }

  const values = data.map((d) => d.value);
  const maxVal = Math.max(...values, 1);
  const minVal = Math.min(...values, 0);
  const range = maxVal - minVal || 1;
  const padding = { top: 10, bottom: 20, left: 0, right: 10 };
  const chartWidth = Math.max(data.length * 30, 200);
  const chartHeight = height - padding.top - padding.bottom;

  const getX = (index: number) => {
    return (index / Math.max(data.length - 1, 1)) * (chartWidth - padding.left - padding.right) + padding.left;
  };

  const getY = (value: number) => {
    return padding.top + chartHeight - ((value - minVal) / range) * chartHeight;
  };

  const points = data.map((d, i) => ({
    x: getX(i),
    y: getY(d.value),
    ...d,
  }));

  const linePath = points
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`)
    .join(' ');

  const firstX = points[0]?.x || 20;
  const lastX = points[points.length - 1]?.x || chartWidth - 20;
  const bottomY = padding.top + chartHeight;
  const areaPath = `${linePath} L${lastX},${bottomY} L${firstX},${bottomY} Z`;

  const yLabels = [
    { value: minVal, y: getY(minVal) },
    { value: minVal + range / 2, y: getY(minVal + range / 2) },
    { value: maxVal, y: getY(maxVal) },
  ];

  const formatValue = (v: number) => {
    if (unit === 'V') return v.toFixed(0);
    if (unit === 'A') return v.toFixed(1);
    return v.toFixed(0);
  };

  return (
    <View style={[styles.container, { height }]}>
      <View style={styles.yAxis}>
        {yLabels.map((label, i) => (
          <Text
            key={i}
            variant="labelSmall"
            style={[
              styles.yLabel,
              {
                top: label.y - 6,
                left: 2,
                color: theme.colors.onSurfaceVariant,
              },
            ]}
          >
            {formatValue(label.value)}
          </Text>
        ))}
      </View>

      <View style={[styles.chartArea, { marginLeft: 32 }]}>
        <Svg width={chartWidth} height={height}>
          <Defs>
            <LinearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={color} stopOpacity="0.25" />
              <Stop offset="1" stopColor={color} stopOpacity="0.02" />
            </LinearGradient>
          </Defs>

          <Line
            x1="0"
            y1={getY(minVal)}
            x2={chartWidth}
            y2={getY(minVal)}
            stroke={theme.colors.outline}
            strokeWidth="0.5"
            opacity={0.2}
          />
          <Line
            x1="0"
            y1={getY(minVal + range / 2)}
            x2={chartWidth}
            y2={getY(minVal + range / 2)}
            stroke={theme.colors.outline}
            strokeWidth="0.5"
            opacity={0.2}
          />
          <Line
            x1="0"
            y1={getY(maxVal)}
            x2={chartWidth}
            y2={getY(maxVal)}
            stroke={theme.colors.outline}
            strokeWidth="0.5"
            opacity={0.2}
          />

          <Path
            d={areaPath}
            fill="url(#areaGrad)"
          />

          <Path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((p, i) => (
            <Circle
              key={i}
              cx={p.x}
              cy={p.y}
              r="4"
              fill={color}
              stroke={theme.dark ? '#0F172A' : '#FFFFFF'}
              strokeWidth="2"
            />
          ))}
        </Svg>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    flexDirection: 'row',
  },
  yAxis: {
    width: 32,
    position: 'relative',
  },
  yLabel: {
    position: 'absolute',
    fontSize: 10,
  },
  chartArea: {
    flex: 1,
    overflow: 'hidden',
  },
});
