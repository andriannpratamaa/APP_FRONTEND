<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\DashboardResource;
use App\Services\AuthService;
use App\Traits\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    use ApiResponse;

    public function __construct(
        protected AuthService $authService,
    ) {}

    public function index(Request $request): JsonResponse
    {
        $deviceId = $request->input('device_id');
        $data = $this->authService->getDashboard($deviceId);

        return $this->success(new DashboardResource($data));
    }
}
