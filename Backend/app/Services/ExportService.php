<?php

namespace App\Services;

use App\Exports\MonitoringExport;
use App\Models\User;
use App\Repositories\ExportHistoryRepository;

class ExportService
{
    public function __construct(
        protected ExportHistoryRepository $exportHistoryRepository,
    ) {}

    public function export(array $params, ?User $user = null): array
    {
        $fileName = sprintf(
            'monitoring_%s_%s.xlsx',
            $params['start_date'] ?? now()->subDay()->format('Y-m-d'),
            $params['end_date'] ?? now()->format('Y-m-d')
        );

        if ($user) {
            $this->exportHistoryRepository->create([
                'user_id' => $user->id,
                'file_name' => $fileName,
                'period_start' => $params['start_date'],
                'period_end' => $params['end_date'],
            ]);
        }

        return [
            'export' => new MonitoringExport($params),
            'fileName' => $fileName,
        ];
    }
}
