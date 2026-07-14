<?php

namespace App\Repositories;

use App\Models\Device;
use Illuminate\Database\Eloquent\Collection;

class DeviceRepository
{
    public function getAll(array $filters = []): Collection
    {
        $query = Device::query();

        if (!empty($filters['search'])) {
            $query->where(function ($q) use ($filters) {
                $q->where('device_name', 'like', "%{$filters['search']}%")
                  ->orWhere('device_code', 'like', "%{$filters['search']}%")
                  ->orWhere('location', 'like', "%{$filters['search']}%");
            });
        }

        if (!empty($filters['status'])) {
            $query->where('status', $filters['status']);
        }

        return $query->latest()->get();
    }

    public function findById(int $id): ?Device
    {
        return Device::find($id);
    }

    public function findByCode(string $code): ?Device
    {
        return Device::where('device_code', $code)->first();
    }

    public function create(array $data): Device
    {
        return Device::create($data);
    }

    public function update(Device $device, array $data): Device
    {
        $device->update($data);
        return $device->fresh();
    }

    public function delete(Device $device): bool
    {
        return $device->delete();
    }

    public function updateStatus(int $deviceId, string $status): void
    {
        Device::where('id', $deviceId)->update([
            'status' => $status,
            'last_seen' => now(),
        ]);
    }

    public function countOnline(): int
    {
        return Device::online()->count();
    }

    public function countOffline(): int
    {
        return Device::offline()->count();
    }

    public function totalDevices(): int
    {
        return Device::count();
    }
}
