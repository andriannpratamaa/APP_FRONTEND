import { useState, useCallback } from 'react';
import { exportService } from '../services/exportService';
import { ExportRequest } from '../types';

export const useExport = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const exportData = useCallback(async (params: ExportRequest) => {
    try {
      setIsExporting(true);
      setError(null);
      await exportService.exportExcel(params);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Gagal mengekspor data';
      setError(message);
      throw err;
    } finally {
      setIsExporting(false);
    }
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setIsExporting(false);
  }, []);

  return {
    isExporting,
    error,
    exportData,
    reset,
  };
};
