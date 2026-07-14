<?php

use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DeviceController;
use App\Http\Controllers\Api\ExportController;
use App\Http\Controllers\Api\MonitoringController;
use Illuminate\Support\Facades\Route;

Route::post('monitorings', [MonitoringController::class, 'store']);

Route::get('dashboard', [DashboardController::class, 'index']);

Route::apiResource('devices', DeviceController::class)->only(['index', 'show']);

Route::get('monitorings/latest', [MonitoringController::class, 'latest']);
Route::get('monitorings/history', [MonitoringController::class, 'history']);
Route::get('monitorings/chart', [MonitoringController::class, 'chart']);
Route::get('monitorings/{id}', [MonitoringController::class, 'show']);

Route::get('export/excel', [ExportController::class, 'export']);
