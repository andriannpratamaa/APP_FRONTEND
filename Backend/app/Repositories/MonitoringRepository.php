<?php

namespace App\Repositories;

use App\Models\Monitoring;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class MonitoringRepository
{
    public function create(array $data): Monitoring
    {
        return Monitoring::create($data);
    }

    public function getLatest(int $limit = 1, ?int $deviceId = null)
    {
        $query = Monitoring::with('device');

        if ($deviceId) {
            $query->where('device_id', $deviceId);
        }

        return $query->latest('recorded_at')
            ->limit($limit)
            ->get();
    }

    public function getHistory(array $filters = []): LengthAwarePaginator
    {
        $query = Monitoring::with('device');

        if (!empty($filters['device_id'])) {
            $query->where('device_id', $filters['device_id']);
        }

        if (!empty($filters['start_date'])) {
            $query->where('recorded_at', '>=', $filters['start_date']);
        }

        if (!empty($filters['end_date'])) {
            $query->where('recorded_at', '<=', $filters['end_date'] . ' 23:59:59');
        }

        if (!empty($filters['search'])) {
            $query->whereHas('device', function ($q) use ($filters) {
                $q->where('device_name', 'like', "%{$filters['search']}%")
                  ->orWhere('device_code', 'like', "%{$filters['search']}%");
            });
        }

        $sortBy = $filters['sort_by'] ?? 'recorded_at';
        $sortOrder = $filters['sort_order'] ?? 'desc';

        if (in_array($sortBy, ['recorded_at', 'ac_voltage', 'ac_current', 'dc_voltage', 'temperature', 'humidity'])) {
            $query->orderBy($sortBy, $sortOrder === 'asc' ? 'asc' : 'desc');
        } else {
            $query->latest('recorded_at');
        }

        $perPage = $filters['per_page'] ?? 20;

        return $query->paginate($perPage);
    }

    public function getChartData(array $params): array
    {
        $query = Monitoring::query();

        if (!empty($params['device_id'])) {
            $query->where('device_id', $params['device_id']);
        }

        if (!empty($params['start_date'])) {
            $query->where('recorded_at', '>=', $params['start_date']);
        }

        if (!empty($params['end_date'])) {
            $query->where('recorded_at', '<=', $params['end_date'] . ' 23:59:59');
        }

        $interval = $params['interval'] ?? 'hour';

        $dateFormat = match ($interval) {
            'minute' => "DATE_FORMAT(recorded_at, '%Y-%m-%d %H:%i:00')",
            'hour' => "DATE_FORMAT(recorded_at, '%Y-%m-%d %H:00:00')",
            'day' => "DATE_FORMAT(recorded_at, '%Y-%m-%d')",
            'week' => "DATE_FORMAT(recorded_at, '%Y-%u')",
            'month' => "DATE_FORMAT(recorded_at, '%Y-%m')",
            default => "DATE_FORMAT(recorded_at, '%Y-%m-%d %H:00:00')",
        };

        $results = $query->select(
            DB::raw("{$dateFormat} as time_label"),
            DB::raw('AVG(ac_voltage) as avg_ac_voltage'),
            DB::raw('AVG(ac_current) as avg_ac_current'),
            DB::raw('AVG(dc_voltage) as avg_dc_voltage'),
            DB::raw('AVG(temperature) as avg_temperature'),
            DB::raw('AVG(humidity) as avg_humidity')
        )
            ->groupBy('time_label')
            ->orderBy('time_label')
            ->get();

        return $results->toArray();
    }

    public function getLatestByDevice(int $deviceId): ?Monitoring
    {
        return Monitoring::where('device_id', $deviceId)
            ->latest('recorded_at')
            ->first();
    }
}
