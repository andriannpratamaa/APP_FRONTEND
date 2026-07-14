<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreDeviceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'device_code' => 'required|string|unique:devices,device_code',
            'device_name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'firmware_version' => 'nullable|string|max:50',
            'ip_address' => 'nullable|ip',
            'mac_address' => 'nullable|string|max:50',
        ];
    }
}
