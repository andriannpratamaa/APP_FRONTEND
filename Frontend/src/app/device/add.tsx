import { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  useTheme,
  Card,
  TextInput,
  Button,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { deviceService } from '../../services/device';
import { CACHE_KEYS } from '../../constants/api';
import { SPACING } from '../../constants/theme';

export default function AddDeviceScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const [deviceCode, setDeviceCode] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [location, setLocation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!deviceCode.trim()) {
      setError('Kode device harus diisi');
      return;
    }
    if (!deviceName.trim()) {
      setError('Nama device harus diisi');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await deviceService.create({
        device_code: deviceCode.trim(),
        device_name: deviceName.trim(),
        location: location.trim() || undefined,
      });
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.DEVICES });
      router.back();
    } catch (err: unknown) {
      let msg = 'Gagal menambahkan device';
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosErr = err as { response: { data: { message?: string; errors?: Record<string, string[]> } } };
        if (axiosErr.response?.data?.message) {
          msg = axiosErr.response.data.message;
        } else if (axiosErr.response?.data?.errors) {
          const first = Object.values(axiosErr.response.data.errors)[0];
          if (first?.length) msg = first[0];
        }
      } else if (err instanceof Error) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={[styles.header, { paddingTop: insets.top + SPACING.md }]}>
        <View style={styles.headerLeft}>
          <Button
            icon="arrow-left"
            mode="text"
            onPress={() => router.back()}
            style={styles.backBtn}
          >
            Kembali
          </Button>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.sectionHeader}>
          <View style={[styles.iconWrap, { backgroundColor: theme.colors.primary + '18' }]}>
            <Ionicons name="hardware-chip-outline" size={24} color={theme.colors.primary} />
          </View>
          <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onSurface }]}>
            Tambah Device
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            Daftarkan device baru ke sistem
          </Text>
        </View>

        <Card style={[styles.formCard, { backgroundColor: theme.colors.elevation.level1 }]}>
          <Card.Content style={styles.formContent}>
            <Text variant="labelLarge" style={{ color: theme.colors.onSurface, marginBottom: SPACING.xs }}>
              Kode Device
            </Text>
            <TextInput
              mode="outlined"
              value={deviceCode}
              onChangeText={setDeviceCode}
              placeholder="Contoh: ESP32-ABCDEF"
              style={styles.input}
              outlineStyle={{ borderRadius: 12 }}
            />

            <Text variant="labelLarge" style={{ color: theme.colors.onSurface, marginTop: SPACING.md, marginBottom: SPACING.xs }}>
              Nama Device
            </Text>
            <TextInput
              mode="outlined"
              value={deviceName}
              onChangeText={setDeviceName}
              placeholder="Contoh: Panel Utama Lantai 1"
              style={styles.input}
              outlineStyle={{ borderRadius: 12 }}
            />

            <Text variant="labelLarge" style={{ color: theme.colors.onSurface, marginTop: SPACING.md, marginBottom: SPACING.xs }}>
              Lokasi
            </Text>
            <TextInput
              mode="outlined"
              value={location}
              onChangeText={setLocation}
              placeholder="Contoh: Gedung A, Lantai 2"
              style={styles.input}
              outlineStyle={{ borderRadius: 12 }}
            />

            {error ? (
              <Text variant="bodySmall" style={{ color: theme.colors.error, marginTop: SPACING.sm, textAlign: 'center' }}>
                {error}
              </Text>
            ) : null}

            <Button
              mode="contained"
              onPress={handleSubmit}
              loading={submitting}
              disabled={submitting}
              icon="plus"
              style={styles.submitBtn}
              contentStyle={styles.submitContent}
            >
              {submitting ? 'Menyimpan...' : 'Tambah Device'}
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: { marginLeft: -8 },
  scrollContent: {
    padding: SPACING.md,
  },
  sectionHeader: {
    alignItems: 'center',
    marginBottom: SPACING.lg,
    gap: SPACING.sm,
  },
  iconWrap: {
    width: 56,
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontWeight: '800',
    textAlign: 'center',
  },
  formCard: {
    borderRadius: 16,
  },
  formContent: {
    gap: 4,
  },
  input: {
    backgroundColor: 'transparent',
  },
  submitBtn: {
    borderRadius: 12,
    marginTop: SPACING.md,
  },
  submitContent: {
    height: 48,
  },
});
