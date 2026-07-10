import { MD3LightTheme, MD3DarkTheme, configureFonts } from 'react-native-paper';

const fontConfig = {
  fontFamily: 'System',
};

const baseTheme = {
  roundness: 16,
  fonts: configureFonts({ config: fontConfig }),
  animation: { scale: 1 },
};

export const LightTheme = {
  ...MD3LightTheme,
  ...baseTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2563EB',
    primaryContainer: '#DBEAFE',
    secondary: '#7C3AED',
    secondaryContainer: '#EDE9FE',
    tertiary: '#0891B2',
    tertiaryContainer: '#CFFAFE',
    surface: '#FFFFFF',
    surfaceVariant: '#F1F5F9',
    background: '#F0F4F8',
    error: '#DC2626',
    errorContainer: '#FEE2E2',
    onPrimary: '#FFFFFF',
    onSurface: '#0F172A',
    onSurfaceVariant: '#475569',
    outline: '#E2E8F0',
    elevation: {
      ...MD3LightTheme.colors.elevation,
      level0: 'transparent',
      level1: '#FFFFFF',
      level2: '#F8FAFC',
    },
  },
};

export const DarkTheme = {
  ...MD3DarkTheme,
  ...baseTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#60A5FA',
    primaryContainer: '#1E3A5F',
    secondary: '#A78BFA',
    secondaryContainer: '#3B1F6E',
    tertiary: '#22D3EE',
    tertiaryContainer: '#164E63',
    surface: '#0F172A',
    surfaceVariant: '#1E293B',
    background: '#020617',
    error: '#F87171',
    errorContainer: '#3B1111',
    onPrimary: '#0F172A',
    onSurface: '#F1F5F9',
    onSurfaceVariant: '#94A3B8',
    outline: '#334155',
    elevation: {
      ...MD3DarkTheme.colors.elevation,
      level0: 'transparent',
      level1: '#0F172A',
      level2: '#1E293B',
    },
  },
};

export const COLORS = {
  voltageAC: '#3B82F6',
  currentAC: '#8B5CF6',
  voltageDC: '#14B8A6',
  temperature: '#F43F5E',
  humidity: '#10B981',
  online: '#22C55E',
  offline: '#EF4444',
  warning: '#F59E0B',
} as const;

export const GRADIENTS = {
  voltageAC: ['#3B82F6', '#2563EB'] as const,
  currentAC: ['#8B5CF6', '#7C3AED'] as const,
  voltageDC: ['#14B8A6', '#0D9488'] as const,
  temperature: ['#F43F5E', '#E11D48'] as const,
  humidity: ['#10B981', '#059669'] as const,
} as const;

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const FONT_SIZES = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 42,
} as const;
