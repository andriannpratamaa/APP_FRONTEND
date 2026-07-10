import api from './api';
import { DeviceInfo } from '../types';
import { ENDPOINTS } from '../constants/api';

export const deviceService = {
  getAll: async (): Promise<DeviceInfo[]> => {
    const { data } = await api.get<DeviceInfo[]>(ENDPOINTS.DEVICES);
    return data;
  },

  getById: async (id: number): Promise<DeviceInfo> => {
    const { data } = await api.get<DeviceInfo>(`${ENDPOINTS.DEVICES}/${id}`);
    return data;
  },
};
