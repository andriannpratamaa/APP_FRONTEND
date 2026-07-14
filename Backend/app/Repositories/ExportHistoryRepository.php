<?php

namespace App\Repositories;

use App\Models\ExportHistory;

class ExportHistoryRepository
{
    public function create(array $data): ExportHistory
    {
        return ExportHistory::create($data);
    }

    public function getByUser(int $userId, int $limit = 10)
    {
        return ExportHistory::where('user_id', $userId)
            ->latest()
            ->limit($limit)
            ->get();
    }
}
