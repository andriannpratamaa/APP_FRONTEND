import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  useTheme,
  Card,
  Switch,
  Divider,
  SegmentedButtons,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useSettingsStore } from '../../store/settings';
import { SPACING } from '../../constants/theme';

interface SettingRowProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  description: string;
  children: React.ReactNode;
}

const SettingRow = ({ icon, label, description, children }: SettingRowProps) => {
  const theme = useTheme();
  return (
    <View style={styles.settingRow}>
      <View style={[styles.settingIcon, { backgroundColor: theme.colors.primary + '12' }]}>
        <Ionicons name={icon} size={20} color={theme.colors.primary} />
      </View>
      <View style={styles.settingInfo}>
        <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
          {label}
        </Text>
        <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
          {description}
        </Text>
      </View>
      {children}
    </View>
  );
};

export default function SettingsScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const {
    darkMode,
    notificationsEnabled,
    autoRefresh,
    refreshInterval,
    historyRefreshInterval,
    setDarkMode,
    setNotificationsEnabled,
    setAutoRefresh,
    setRefreshInterval,
    setHistoryRefreshInterval,
  } = useSettingsStore();

  const refreshIntervalOptions = [
    { label: '15s', value: '15' },
    { label: '30s', value: '30' },
    { label: '60s', value: '60' },
    { label: '5m', value: '300' },
    { label: '30m', value: '1800' },
    { label: '1j', value: '3600' },
  ];

  const historyRefreshOptions = [
    { label: '5m', value: '300' },
    { label: '15m', value: '900' },
    { label: '30m', value: '1800' },
    { label: '1j', value: '3600' },
    { label: '6j', value: '21600' },
    { label: '24j', value: '86400' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
        <View style={[styles.headerIcon, { backgroundColor: theme.colors.primary + '18' }]}>
          <Ionicons name="settings" size={20} color={theme.colors.primary} />
        </View>
        <Text
          variant="headlineSmall"
          style={[styles.headerTitle, { color: theme.colors.onSurface }]}
        >
          Pengaturan
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Card
          style={[
            styles.section,
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
              Tampilan
            </Text>

            <SettingRow
              icon="moon-outline"
              label="Dark Mode"
              description="Gunakan tema gelap"
            >
              <Switch
                value={darkMode}
                onValueChange={setDarkMode}
                color={theme.colors.primary}
              />
            </SettingRow>
          </Card.Content>
        </Card>

        <Card
          style={[
            styles.section,
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
              Notifikasi
            </Text>

            <SettingRow
              icon="notifications-outline"
              label="Notifikasi Push"
              description="Terima notifikasi alarm dan peringatan"
            >
              <Switch
                value={notificationsEnabled}
                onValueChange={setNotificationsEnabled}
                color={theme.colors.primary}
              />
            </SettingRow>
          </Card.Content>
        </Card>

        <Card
          style={[
            styles.section,
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
              Pembaruan Data
            </Text>

            <SettingRow
              icon="sync-outline"
              label="Auto Refresh"
              description="Perbarui data secara otomatis"
            >
              <Switch
                value={autoRefresh}
                onValueChange={setAutoRefresh}
                color={theme.colors.primary}
              />
            </SettingRow>

            {autoRefresh && (
              <>
                <Divider style={[styles.divider, { backgroundColor: theme.colors.outline }]} />
                <View style={styles.subSetting}>
                  <Text
                    variant="bodyMedium"
                    style={{ color: theme.colors.onSurface, fontWeight: '500' }}
                  >
                    Interval Refresh
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{ color: theme.colors.onSurfaceVariant, marginBottom: SPACING.sm }}
                  >
                    Frekuensi pembaruan data
                  </Text>
                  <SegmentedButtons
                    value={String(refreshInterval)}
                    onValueChange={(val) => setRefreshInterval(Number(val))}
                    buttons={refreshIntervalOptions}
                    density="small"
                  />
                </View>
              </>
            )}
          </Card.Content>
        </Card>

        <Card
          style={[
            styles.section,
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
              Pembaruan Riwayat
            </Text>

            <View style={styles.subSetting}>
              <Text
                variant="bodyMedium"
                style={{ color: theme.colors.onSurface, fontWeight: '500' }}
              >
                Interval Riwayat
              </Text>
              <Text
                variant="bodySmall"
                style={{ color: theme.colors.onSurfaceVariant, marginBottom: SPACING.sm }}
              >
                Interval pembaruan data riwayat
              </Text>
              <SegmentedButtons
                value={String(historyRefreshInterval)}
                onValueChange={(val) => setHistoryRefreshInterval(Number(val))}
                buttons={historyRefreshOptions}
                density="small"
              />
            </View>
          </Card.Content>
        </Card>

        <Card
          style={[
            styles.section,
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
              Tentang
            </Text>

            <View style={styles.aboutRow}>
              <View style={[styles.aboutIcon, { backgroundColor: theme.colors.primary + '12' }]}>
                <Ionicons name="information-circle-outline" size={20} color={theme.colors.primary} />
              </View>
              <View style={styles.settingInfo}>
                <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, fontWeight: '600' }}>
                  Versi Aplikasi
                </Text>
                <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                  1.0.0
                </Text>
              </View>
            </View>
          </Card.Content>
        </Card>

        <View style={{ height: SPACING.xxl }} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.md,
  },
  headerIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontWeight: '800',
  },
  scrollContent: {
    padding: SPACING.md,
  },
  section: {
    borderRadius: 16,
    marginBottom: SPACING.md,
    borderWidth: 1,
  },
  sectionTitle: {
    fontWeight: '700',
    marginBottom: SPACING.md,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.sm,
    gap: SPACING.md,
  },
  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingInfo: {
    flex: 1,
  },
  divider: {
    marginVertical: SPACING.xs,
  },
  subSetting: {
    paddingTop: SPACING.sm,
  },
  aboutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.md,
  },
  aboutIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
