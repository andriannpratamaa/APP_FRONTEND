<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class DeviceResource extends JsonResource
{
    public function toArray($request): array
    {
        return [
            'id' => $this->id,
            'device_code' => $this->device_code,
            'device_name' => $this->device_name,
            'location' => $this->location,
            'firmware_version' => $this->firmware_version,
            'ip_address' => $this->ip_address,
            'mac_address' => $this->mac_address,
            'status' => $this->status,
            'last_seen' => $this->last_seen,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
