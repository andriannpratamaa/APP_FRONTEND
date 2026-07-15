import { Platform, Linking } from 'react-native';
import { ENDPOINTS, API } from '../constants/api';
import { ExportRequest } from '../types';

export const exportService = {
  exportExcel: async (params: ExportRequest): Promise<void> => {
    const query = new URLSearchParams();
    if (params.id_device) query.set('id_device', String(params.id_device));
    query.set('from', params.from.slice(0, 10));
    query.set('to', params.to.slice(0, 10));
    query.set('interval', '10menit');

    const url = `${API.BASE_URL}${ENDPOINTS.EXPORT.EXCEL_V2}?${query.toString()}`;

    if (Platform.OS === 'web') {
      window.open(url, '_blank');
    } else {
      await Linking.openURL(url);
    }
  },
};
