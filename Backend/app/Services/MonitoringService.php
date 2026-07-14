<?php

namespace App\Services;

use App\Models\Monitoring;
use App\Repositories\DeviceRepository;
use App\Repositories\MonitoringRepository;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class MonitoringService
{
    public function __construct(
        protected MonitoringRepository $monitoringRepository,
        protected DeviceRepository $deviceRepository,
    ) {}

    public function storeFromSensor(array $data): Monitoring
    {
        $device = $this->deviceRepository->findByCode($data['device_code']);

        if (!$device) {
            throw new \RuntimeException('Device tidak ditemukan', 404);
        }

        $this->deviceRepository->updateStatus($device->id, 'online');

        return $this->monitoringRepository->create([
            'device_id' => $device->id,
            'ac_voltage' => $data['ac_voltage'] ?? null,
            'ac_current' => $data['ac_current'] ?? null,
            'dc_voltage' => $data['dc_voltage'] ?? null,
            'temperature' => $data['temperature'] ?? null,
            'humidity' => $data['humidity'] ?? null,
            'status' => 'online',
            'recorded_at' => now(),
        ]);
    }

    public function getLatest(?int $deviceId = null)
    {
        return $this->monitoringRepository->getLatest(1, $deviceId)->first();
    }

    public function getHistory(array $filters): LengthAwarePaginator
    {
        return $this->monitoringRepository->getHistory($filters);
    }

    public function getChartData(array $params): array
    {
        $rawData = $this->monitoringRepository->getChartData($params);

        $series = [
            'ac_voltage' => [],
            'ac_current' => [],
            'dc_voltage' => [],
            'temperature' => [],
            'humidity' => [],
        ];

        foreach ($rawData as $row) {
            $timestamp = $row['time_label'];
            $series['ac_voltage'][] = ['timestamp' => $timestamp, 'value' => (float) $row['avg_ac_voltage']];
            $series['ac_current'][] = ['timestamp' => $timestamp, 'value' => (float) $row['avg_ac_current']];
            $series['dc_voltage'][] = ['timestamp' => $timestamp, 'value' => (float) $row['avg_dc_voltage']];
            $series['temperature'][] = ['timestamp' => $timestamp, 'value' => (float) $row['avg_temperature']];
            $series['humidity'][] = ['timestamp' => $timestamp, 'value' => (float) $row['avg_humidity']];
        }

        return $series;
    }

    public function getDetail(int $id): ?Monitoring
    {
        return Monitoring::with('device')->find($id);
    }
}
