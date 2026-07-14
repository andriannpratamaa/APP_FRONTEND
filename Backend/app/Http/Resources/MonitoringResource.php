<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class MonitoringResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'device_id' => $this->device_id,
            'device_code' => $this->whenLoaded('device', fn() => $this->device->device_code),
            'device_name' => $this->whenLoaded('device', fn() => $this->device->device_name),
            'ac_voltage' => (float) $this->ac_voltage,
            'ac_current' => (float) $this->ac_current,
            'dc_voltage' => (float) $this->dc_voltage,
            'temperature' => (float) $this->temperature,
            'humidity' => (float) $this->humidity,
            'status' => $this->status,
            'recorded_at' => $this->recorded_at,
            'created_at' => $this->created_at,
        ];
    }
}
