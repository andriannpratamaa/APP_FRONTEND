<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ExportHistoryResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'user_id' => $this->user_id,
            'file_name' => $this->file_name,
            'period_start' => $this->period_start,
            'period_end' => $this->period_end,
            'created_at' => $this->created_at,
        ];
    }
}
