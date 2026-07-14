import { DeviceStatus } from '../types';

const DEFAULT_OFFLINE_THRESHOLD_MS = 120_000;

export const getEffectiveStatus = (
  serverStatus: DeviceStatus | undefined | null,
  lastRecordedAt: string | undefined | null,
  thresholdMs: number = DEFAULT_OFFLINE_THRESHOLD_MS,
): DeviceStatus => {
  if (!serverStatus || serverStatus === 'offline') {
    return 'offline';
  }

  if (lastRecordedAt) {
    const elapsed = Date.now() - new Date(lastRecordedAt).getTime();
    if (elapsed > thresholdMs) {
      return 'offline';
    }
  }

  return serverStatus;
};
