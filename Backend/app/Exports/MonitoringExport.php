<?php

namespace App\Exports;

use App\Models\Monitoring;
use App\Models\Device;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\DB;
use Maatwebsite\Excel\Concerns\FromView;
use Maatwebsite\Excel\Concerns\WithColumnWidths;
use Maatwebsite\Excel\Concerns\WithStyles;
use PhpOffice\PhpSpreadsheet\Worksheet\Worksheet;

class MonitoringExport implements FromView, WithColumnWidths, WithStyles
{
    protected array $params;

    public function __construct(array $params)
    {
        $this->params = $params;
    }

    public function view(): View
    {
        $interval = $this->params['interval'] ?? null;

        if ($interval && $interval !== 'minute') {
            $monitorings = $this->getAggregatedData();
        } else {
            $monitorings = $this->getRawData();
        }

        return view('exports.monitoring', [
            'monitorings' => $monitorings,
        ]);
    }

    private function getRawData()
    {
        $query = Monitoring::with('device');

        if (!empty($this->params['device_id'])) {
            $query->where('device_id', $this->params['device_id']);
        }

        $startDate = \Carbon\Carbon::parse($this->params['start_date'] ?? now()->subDay())->startOfDay();
        $endDate = \Carbon\Carbon::parse($this->params['end_date'] ?? now())->endOfDay();

        $query->where('recorded_at', '>=', $startDate)
              ->where('recorded_at', '<=', $endDate)
              ->orderBy('recorded_at');

        return $query->get();
    }

    private function getAggregatedData()
    {
        $query = Monitoring::query();

        if (!empty($this->params['device_id'])) {
            $query->where('device_id', $this->params['device_id']);
        }

        $startDate = \Carbon\Carbon::parse($this->params['start_date'] ?? now()->subDay())->startOfDay();
        $endDate = \Carbon\Carbon::parse($this->params['end_date'] ?? now())->endOfDay();

        $query->where('recorded_at', '>=', $startDate)
              ->where('recorded_at', '<=', $endDate);

        $interval = $this->params['interval'];

        $dateFormat = match ($interval) {
            '10menit' => "CONCAT(DATE_FORMAT(recorded_at, '%Y-%m-%d %H:'), LPAD(FLOOR(MINUTE(recorded_at) / 10) * 10, 2, '0'), ':00')",
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

        $device = null;
        if (!empty($this->params['device_id'])) {
            $device = Device::find($this->params['device_id']);
        }

        return $results->map(function ($item) use ($device) {
            return (object) [
                'recorded_at' => new \Carbon\Carbon($item->time_label),
                'device' => $device,
                'ac_voltage' => round($item->avg_ac_voltage, 2),
                'ac_current' => round($item->avg_ac_current, 4),
                'dc_voltage' => round($item->avg_dc_voltage, 2),
                'temperature' => round($item->avg_temperature, 1),
                'humidity' => round($item->avg_humidity, 1),
            ];
        });
    }

    public function columnWidths(): array
    {
        return [
            'A' => 15,
            'B' => 10,
            'C' => 20,
            'D' => 15,
            'E' => 12,
            'F' => 15,
            'G' => 12,
            'H' => 12,
        ];
    }

    public function styles(Worksheet $sheet): array
    {
        return [
            1 => [
                'font' => ['bold' => true, 'size' => 12],
                'fill' => [
                    'fillType' => \PhpOffice\PhpSpreadsheet\Style\Fill::FILL_SOLID,
                    'startColor' => ['rgb' => 'E2E8F0'],
                ],
            ],
        ];
    }
}
