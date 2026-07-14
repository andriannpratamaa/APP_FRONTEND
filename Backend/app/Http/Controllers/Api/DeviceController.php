<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreDeviceRequest;
use App\Http\Requests\UpdateDeviceRequest;
use App\Http\Resources\DeviceResource;
use App\Services\DeviceService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DeviceController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected DeviceService $deviceService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $devices = $this->deviceService->getAll($request->only(['search', 'status']));

        return $this->success(DeviceResource::collection($devices));
    }

    public function show(int $id): JsonResponse
    {
        $device = $this->deviceService->findById($id);

        if (!$device) {
            return $this->error('Device tidak ditemukan', null, 404);
        }

        return $this->success(new DeviceResource($device));
    }

    public function store(StoreDeviceRequest $request): JsonResponse
    {
        $device = $this->deviceService->create($request->validated());

        return $this->success(new DeviceResource($device), 'Device berhasil ditambahkan', 201);
    }

    public function update(UpdateDeviceRequest $request, int $id): JsonResponse
    {
        try {
            $device = $this->deviceService->update($id, $request->validated());
            return $this->success(new DeviceResource($device), 'Device berhasil diperbarui');
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), null, $e->getCode() ?: 400);
        }
    }

    public function destroy(int $id): JsonResponse
    {
        try {
            $this->deviceService->delete($id);
            return $this->success(null, 'Device berhasil dihapus');
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), null, $e->getCode() ?: 400);
        }
    }
}
