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

  create: async (params: {
    device_code?: string;
    device_name?: string;
    location?: string;
  }): Promise<DeviceInfo> => {
    const { data } = await api.post<DeviceInfo>(ENDPOINTS.DEVICES, params);
    return data;
  },

  update: async (id: number, params: {
    device_code?: string;
    device_name?: string;
    location?: string;
  }): Promise<DeviceInfo> => {
    const { data } = await api.put<DeviceInfo>(`${ENDPOINTS.DEVICES}/${id}`, params);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`${ENDPOINTS.DEVICES}/${id}`);
  },
};
