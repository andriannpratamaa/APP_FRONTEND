import { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import {
  Text,
  useTheme,
  Card,
  TextInput,
  Button,
  ActivityIndicator,
  Divider,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import { deviceService } from '../../../services/device';
import { CACHE_KEYS } from '../../../constants/api';
import { COLORS, SPACING } from '../../../constants/theme';

export default function EditDeviceScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const [deviceId, setDeviceId] = useState(0);
  const [deviceCode, setDeviceCode] = useState('');
  const [deviceName, setDeviceName] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!id) return;
    deviceService
      .getById(Number(id))
      .then((device) => {
        setDeviceId(device.id);
        setDeviceCode(device.device_code);
        setDeviceName(device.device_name);
        setLocation(device.location || '');
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : 'Gagal memuat device');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleSubmit = async () => {
    if (!deviceName.trim()) {
      setError('Nama device harus diisi');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      await deviceService.update(Number(id), {
        device_code: deviceCode.trim(),
        device_name: deviceName.trim(),
        location: location.trim() || undefined,
      });
      queryClient.invalidateQueries({ queryKey: CACHE_KEYS.DEVICES });
      router.back();
    } catch (err: unknown) {
      let msg = 'Gagal memperbarui device';
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

  if (loading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

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
            <Ionicons name="pencil-outline" size={24} color={theme.colors.primary} />
          </View>
          <Text variant="headlineSmall" style={[styles.title, { color: theme.colors.onSurface }]}>
            Edit Device
          </Text>
          <Text variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
            {deviceName}
          </Text>
        </View>

        <Card style={[styles.formCard, { backgroundColor: theme.colors.elevation.level1 }]}>
          <Card.Content style={styles.formContent}>
            <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant, marginBottom: SPACING.xs }}>
              ID Device
            </Text>
            <View style={[styles.viewOnlyField, { backgroundColor: theme.dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderColor: theme.colors.outlineVariant }]}>
              <Ionicons name="pricetag-outline" size={16} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, fontWeight: '600', marginLeft: 8 }}>
                {deviceId}
              </Text>
            </View>

            <Text variant="labelLarge" style={{ color: theme.colors.onSurfaceVariant, marginTop: SPACING.md, marginBottom: SPACING.xs }}>
              Kode Device
            </Text>
            <View style={[styles.viewOnlyField, { backgroundColor: theme.dark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)', borderColor: theme.colors.outlineVariant }]}>
              <Ionicons name="qr-code-outline" size={16} color={theme.colors.onSurfaceVariant} />
              <Text variant="bodyLarge" style={{ color: theme.colors.onSurface, fontWeight: '500', marginLeft: 8 }}>
                {deviceCode}
              </Text>
            </View>

            <Divider style={{ marginVertical: SPACING.md, backgroundColor: theme.colors.outlineVariant, opacity: 0.4 }} />

            <Text variant="labelLarge" style={{ color: theme.colors.onSurface, marginBottom: SPACING.xs }}>
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
              icon="check"
              style={styles.submitBtn}
              contentStyle={styles.submitContent}
            >
              Simpan Perubahan
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { justifyContent: 'center', alignItems: 'center' },
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
  viewOnlyField: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
  },
  input: {
    backgroundColor: 'transparent',
  },
  submitBtn: {
    borderRadius: 12,
    marginTop: SPACING.lg,
  },
  submitContent: {
    height: 48,
  },
});
