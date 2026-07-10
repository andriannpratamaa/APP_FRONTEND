import { useQuery } from '@tanstack/react-query';
import { deviceService } from '../services/device';
import { CACHE_KEYS } from '../constants/api';

export const useDevices = () => {
  return useQuery({
    queryKey: CACHE_KEYS.DEVICES,
    queryFn: deviceService.getAll,
  });
};
