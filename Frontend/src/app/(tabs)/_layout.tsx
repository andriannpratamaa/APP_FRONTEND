import { Tabs } from 'expo-router';
import { useTheme } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

type IoniconsName = keyof typeof Ionicons.glyphMap;

const tabs = [
  {
    name: 'dashboard',
    title: 'Dashboard',
    icon: 'speedometer-outline' as IoniconsName,
    activeIcon: 'speedometer' as IoniconsName,
  },
  {
    name: 'history',
    title: 'Riwayat',
    icon: 'time-outline' as IoniconsName,
    activeIcon: 'time' as IoniconsName,
  },
  {
    name: 'settings',
    title: 'Pengaturan',
    icon: 'settings-outline' as IoniconsName,
    activeIcon: 'settings' as IoniconsName,
  },
];

export default function TabsLayout() {
  const theme = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.onSurfaceVariant,
        tabBarStyle: {
          backgroundColor: theme.dark
            ? 'rgba(15, 23, 42, 0.85)'
            : theme.colors.elevation.level1,
          borderTopColor: theme.dark
            ? 'rgba(148, 163, 184, 0.1)'
            : theme.colors.outline,
          borderTopWidth: 1,
          paddingBottom: 8,
          paddingTop: 8,
          height: 64,
          elevation: 0,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '700',
          letterSpacing: 0.3,
        },
        tabBarItemStyle: {
          gap: 2,
        },
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ focused, color, size }) => (
              <Ionicons
                name={focused ? tab.activeIcon : tab.icon}
                size={focused ? 24 : 22}
                color={color}
              />
            ),
          }}
        />
      ))}
    </Tabs>
  );
}
