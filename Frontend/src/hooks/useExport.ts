import { useState, useCallback } from 'react';
import { exportService } from '../services/exportService';
import { ExportRequest } from '../types';

export const useExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const exportData = useCallback(async (params: ExportRequest) => {
    try {
      setIsExporting(true);
      setProgress(0);
      setError(null);

      const fileUri = await exportService.exportExcel(params, (p) => {
        setProgress(p);
      });

      setProgress(100);
      return fileUri;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Gagal mengekspor data';
      setError(message);
      throw err;
    } finally {
      setIsExporting(false);
    }
  }, []);

  const shareFile = useCallback(async (fileUri: string) => {
    try {
      await exportService.shareFile(fileUri);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Gagal membagikan file';
      setError(message);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setProgress(0);
    setIsExporting(false);
  }, []);

  return {
    isExporting,
    progress,
    error,
    exportData,
    shareFile,
    reset,
  };
};
