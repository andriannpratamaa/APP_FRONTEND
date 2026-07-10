import { Platform } from 'react-native';
import { ENDPOINTS, API } from '../constants/api';
import { ExportRequest } from '../types';

const downloadNative = async (
  url: string,
  fileName: string,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const FileSystem = require('expo-file-system/legacy');
  const fileUri = `${FileSystem.documentDirectory}${fileName}`;

  const downloadResult = await FileSystem.downloadAsync(url, fileUri, {
    headers: {
      Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
    ...(onProgress && {
      progressCallback: (progressEvent: { bytesWritten: number; totalBytesExpectedToWrite: number }) => {
        if (progressEvent.totalBytesExpectedToWrite > 0) {
          const percent = Math.round(
            (progressEvent.bytesWritten * 100) / progressEvent.totalBytesExpectedToWrite
          );
          onProgress(percent);
        }
      },
    }),
  });

  return downloadResult.uri;
};

const downloadWeb = async (url: string, fileName: string): Promise<string> => {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    },
  });

  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = blobUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(blobUrl);

  return blobUrl;
};

export const exportService = {
  exportExcel: async (
    params: ExportRequest,
    onProgress?: (progress: number) => void
  ): Promise<string> => {
    const fileName = `monitoring_${params.start_date.slice(0, 10)}_${params.end_date.slice(0, 10)}.xlsx`;

    const downloadUrl = `${API.BASE_URL}${ENDPOINTS.EXPORT.EXCEL}?start_date=${encodeURIComponent(params.start_date)}&end_date=${encodeURIComponent(params.end_date)}`;

    if (Platform.OS === 'web') {
      return downloadWeb(downloadUrl, fileName);
    }

    return downloadNative(downloadUrl, fileName, onProgress);
  },

  shareFile: async (fileUri: string): Promise<void> => {
    if (Platform.OS === 'web') {
      return;
    }
    const Sharing = require('expo-sharing');
    const isAvailable = await Sharing.isAvailableAsync();
    if (isAvailable) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
    }
  },
};
