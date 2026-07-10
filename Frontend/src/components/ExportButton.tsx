import { useState } from 'react';
import { View, StyleSheet, Modal, Platform } from 'react-native';
import {
  Button,
  Text,
  useTheme,
  ProgressBar,
  IconButton,
  TextInput,
} from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { SPACING } from '../constants/theme';
import { useExport } from '../hooks/useExport';

let DateTimePicker: React.ComponentType<{
  value: Date;
  mode: 'date' | 'time';
  display: 'default' | 'spinner' | 'calendar' | 'clock';
  onChange: (event: unknown, date?: Date) => void;
  maximumDate?: Date;
  minimumDate?: Date;
}> = () => null;

if (Platform.OS !== 'web') {
  try {
    const DTP = require('@react-native-community/datetimepicker');
    DateTimePicker = DTP.default || DTP;
  } catch {}
}

const quickRanges = [
  { label: 'Hari Ini', days: 0 },
  { label: '7 Hari', days: 7 },
  { label: '30 Hari', days: 30 },
];

export const ExportButton = () => {
  const theme = useTheme();
  const { isExporting, progress, error, exportData, shareFile, reset } =
    useExport();
  const [visible, setVisible] = useState(false);
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 7);
    return d;
  });
  const [endDate, setEndDate] = useState(new Date());
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [fileUri, setFileUri] = useState<string | null>(null);

  const formatDate = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const parseDate = (text: string): Date | null => {
    const match = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (!match) return null;
    const parsed = new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
    return isNaN(parsed.getTime()) ? null : parsed;
  };

  const handleQuickRange = (days: number) => {
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - days);
    setStartDate(start);
    setEndDate(end);
  };

  const handleExport = async () => {
    try {
      const uri = await exportData({
        start_date: startDate.toISOString(),
        end_date: endDate.toISOString(),
      });
      setFileUri(uri);
    } catch {
      // error handled in hook
    }
  };

  const handleShare = async () => {
    if (fileUri) {
      await shareFile(fileUri);
    }
  };

  const handleClose = () => {
    setVisible(false);
    reset();
    setFileUri(null);
    const d = new Date();
    d.setDate(d.getDate() - 7);
    setStartDate(d);
    setEndDate(new Date());
  };

  return (
    <>
      <View style={styles.triggerWrap}>
        <Button
          mode="contained"
          icon="file-download-outline"
          onPress={() => setVisible(true)}
          style={styles.trigger}
          contentStyle={styles.triggerContent}
        >
          Export Excel
        </Button>
      </View>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={handleClose}
      >
        <View style={styles.overlay}>
          <View
            style={[
              styles.modal,
              { backgroundColor: theme.dark ? '#0F172A' : theme.colors.surface },
            ]}
          >
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <View style={[styles.headerIcon, { backgroundColor: theme.colors.primary + '18' }]}>
                  <Ionicons name="document-text-outline" size={20} color={theme.colors.primary} />
                </View>
                <View>
                  <Text variant="titleLarge" style={{ color: theme.colors.onSurface, fontWeight: '700' }}>
                    Export Data
                  </Text>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant }}>
                    Pilih rentang tanggal
                  </Text>
                </View>
              </View>
              <IconButton icon="close" onPress={handleClose} iconColor={theme.colors.onSurfaceVariant} />
            </View>

            <View style={styles.content}>
              <View style={styles.quickRow}>
                {quickRanges.map((r) => (
                  <Button
                    key={r.days}
                    mode="outlined"
                    compact
                    onPress={() => handleQuickRange(r.days)}
                    style={styles.quickBtn}
                    labelStyle={styles.quickLabel}
                  >
                    {r.label}
                  </Button>
                ))}
              </View>

              <View style={styles.dateRow}>
                <View style={styles.dateInput}>
                  <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 4, fontWeight: '600' }}>
                    Mulai
                  </Text>
                  {Platform.OS === 'web' ? (
                    <TextInput
                      mode="outlined"
                      value={formatDate(startDate)}
                      onChangeText={(text) => {
                        const parsed = parseDate(text);
                        if (parsed) setStartDate(parsed);
                      }}
                      placeholder="YYYY-MM-DD"
                      style={styles.dateField}
                      outlineStyle={{ borderRadius: 10 }}
                    />
                  ) : (
                    <Button
                      mode="outlined"
                      onPress={() => setShowStartPicker(true)}
                      icon="calendar"
                      style={styles.dateBtn}
                    >
                      {formatDate(startDate)}
                    </Button>
                  )}
                </View>
                <Text
                  variant="bodyLarge"
                  style={{ color: theme.colors.onSurfaceVariant, marginTop: 24 }}
                >
                  -
                </Text>
                <View style={styles.dateInput}>
                  <Text variant="labelSmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: 4, fontWeight: '600' }}>
                    Selesai
                  </Text>
                  {Platform.OS === 'web' ? (
                    <TextInput
                      mode="outlined"
                      value={formatDate(endDate)}
                      onChangeText={(text) => {
                        const parsed = parseDate(text);
                        if (parsed) setEndDate(parsed);
                      }}
                      placeholder="YYYY-MM-DD"
                      style={styles.dateField}
                      outlineStyle={{ borderRadius: 10 }}
                    />
                  ) : (
                    <Button
                      mode="outlined"
                      onPress={() => setShowEndPicker(true)}
                      icon="calendar"
                      style={styles.dateBtn}
                    >
                      {formatDate(endDate)}
                    </Button>
                  )}
                </View>
              </View>

              {Platform.OS !== 'web' && showStartPicker && (
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="default"
                  onChange={(_: unknown, date?: Date) => {
                    setShowStartPicker(false);
                    if (date) setStartDate(date);
                  }}
                  maximumDate={endDate}
                />
              )}
              {Platform.OS !== 'web' && showEndPicker && (
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display="default"
                  onChange={(_: unknown, date?: Date) => {
                    setShowEndPicker(false);
                    if (date) setEndDate(date);
                  }}
                  minimumDate={startDate}
                />
              )}

              {isExporting && (
                <View style={styles.progressContainer}>
                  <Text variant="bodySmall" style={{ color: theme.colors.onSurfaceVariant, marginBottom: SPACING.xs }}>
                    Mengekspor data... {progress}%
                  </Text>
                  <ProgressBar
                    progress={progress / 100}
                    color={theme.colors.primary}
                    style={styles.progress}
                  />
                </View>
              )}

              {error && (
                <Text variant="bodySmall" style={[styles.error, { color: theme.colors.error }]}>
                  {error}
                </Text>
              )}

              {fileUri && (
                <Button
                  mode="contained"
                  icon="share-variant"
                  onPress={handleShare}
                  style={styles.shareBtn}
                >
                  Bagikan File
                </Button>
              )}
            </View>

            <View style={styles.footer}>
              <Button
                mode="contained"
                onPress={handleExport}
                loading={isExporting}
                disabled={isExporting}
                icon="download"
                style={styles.exportBtn}
              >
                {isExporting ? 'Mengekspor...' : 'Export'}
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  triggerWrap: {
    paddingHorizontal: SPACING.md,
  },
  trigger: {
    borderRadius: 12,
    marginBottom: SPACING.sm,
  },
  triggerContent: {
    height: 44,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  modal: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: SPACING.lg,
    minHeight: 300,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
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
  content: { gap: SPACING.md },
  quickRow: { flexDirection: 'row', gap: SPACING.xs },
  quickBtn: { flex: 1, borderRadius: 10 },
  quickLabel: { fontSize: 12 },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: SPACING.sm,
  },
  dateInput: { flex: 1 },
  dateField: { height: 40 },
  dateBtn: { borderRadius: 10 },
  progressContainer: { marginTop: SPACING.md },
  progress: { height: 6, borderRadius: 3, marginTop: SPACING.xs },
  error: { textAlign: 'center', marginTop: SPACING.sm },
  shareBtn: { borderRadius: 12, marginTop: SPACING.sm },
  footer: { marginTop: SPACING.lg },
  exportBtn: { borderRadius: 12, paddingVertical: 6 },
});
