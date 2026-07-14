<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DashboardResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'total_devices' => $this['total_devices'],
            'devices_online' => $this['devices_online'],
            'devices_offline' => $this['devices_offline'],
            'latest_monitoring' => $this['latest_monitoring'] ? new MonitoringResource($this['latest_monitoring']) : null,
            'last_update' => $this['last_update'],
        ];
    }
}
