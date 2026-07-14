<?php

namespace App\Services;

use App\Models\Device;
use App\Repositories\DeviceRepository;
use Illuminate\Database\Eloquent\Collection;

class DeviceService
{
    public function __construct(
        protected DeviceRepository $deviceRepository,
    ) {}

    public function getAll(array $filters = []): Collection
    {
        return $this->deviceRepository->getAll($filters);
    }

    public function findById(int $id): ?Device
    {
        return $this->deviceRepository->findById($id);
    }

    public function create(array $data): Device
    {
        return $this->deviceRepository->create($data);
    }

    public function update(int $id, array $data): Device
    {
        $device = $this->deviceRepository->findById($id);

        if (!$device) {
            throw new \RuntimeException('Device tidak ditemukan', 404);
        }

        return $this->deviceRepository->update($device, $data);
    }

    public function delete(int $id): void
    {
        $device = $this->deviceRepository->findById($id);

        if (!$device) {
            throw new \RuntimeException('Device tidak ditemukan', 404);
        }

        $this->deviceRepository->delete($device);
    }
}
