<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\ChartRequest;
use App\Http\Requests\StoreMonitoringRequest;
use App\Http\Resources\MonitoringResource;
use App\Services\MonitoringService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class MonitoringController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected MonitoringService $monitoringService,
    ) {}

    public function store(StoreMonitoringRequest $request): JsonResponse
    {
        try {
            $monitoring = $this->monitoringService->storeFromSensor($request->validated());

            return $this->success(
                new MonitoringResource($monitoring),
                'Data monitoring berhasil disimpan',
                201
            );
        } catch (\RuntimeException $e) {
            return $this->error($e->getMessage(), null, $e->getCode() ?: 400);
        }
    }

    public function latest(Request $request): JsonResponse
    {
        $deviceId = $request->input('device_id');
        $data = $this->monitoringService->getLatest($deviceId);

        if (!$data) {
            return $this->error('Belum ada data monitoring', null, 404);
        }

        return $this->success(new MonitoringResource($data));
    }

    public function history(Request $request): JsonResponse
    {
        $filters = $request->only([
            'device_id', 'start_date', 'end_date',
            'search', 'sort_by', 'sort_order',
            'per_page', 'page',
        ]);

        $data = $this->monitoringService->getHistory($filters);

        return $this->success([
            'data' => MonitoringResource::collection($data),
            'total' => $data->total(),
            'page' => $data->currentPage(),
            'per_page' => $data->perPage(),
            'total_pages' => $data->lastPage(),
        ]);
    }

    public function chart(ChartRequest $request): JsonResponse
    {
        $data = $this->monitoringService->getChartData($request->validated());

        return $this->success($data);
    }

    public function show(int $id): JsonResponse
    {
        $monitoring = $this->monitoringService->getDetail($id);

        if (!$monitoring) {
            return $this->error('Data monitoring tidak ditemukan', null, 404);
        }

        return $this->success(new MonitoringResource($monitoring));
    }
}
