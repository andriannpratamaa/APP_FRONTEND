export const formatVoltage = (voltage: number): string => {
  return `${voltage.toFixed(1)} V`;
};

export const formatCurrent = (current: number): string => {
  return `${current.toFixed(2)} A`;
};

export const formatTemperature = (temp: number): string => {
  return `${temp.toFixed(1)} °C`;
};

export const formatHumidity = (humidity: number): string => {
  return `${humidity.toFixed(1)} %RH`;
};

export const formatTimestamp = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

export const formatTime = (timestamp: string): string => {
  const date = new Date(timestamp);
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

export const formatTimeAgo = (timestamp: string): string => {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return `${diffSec} detik yang lalu`;
  if (diffMin < 60) return `${diffMin} menit yang lalu`;
  if (diffHour < 24) return `${diffHour} jam yang lalu`;
  return `${diffDay} hari yang lalu`;
};

export const getTimeRangeLabel = (range: string): string => {
  const labels: Record<string, string> = {
    '1h': '1 Jam',
    '6h': '6 Jam',
    '12h': '12 Jam',
    '24h': '24 Jam',
    '7d': '7 Hari',
    '30d': '30 Hari',
  };
  return labels[range] || range;
};
