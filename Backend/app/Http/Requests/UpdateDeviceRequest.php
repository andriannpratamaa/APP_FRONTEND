<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateDeviceRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'device_code' => ['required', 'string', Rule::unique('devices', 'device_code')->ignore($this->route('device'))],
            'device_name' => 'required|string|max:255',
            'location' => 'nullable|string|max:255',
            'firmware_version' => 'nullable|string|max:50',
            'ip_address' => 'nullable|ip',
            'mac_address' => 'nullable|string|max:50',
            'status' => 'nullable|in:online,offline,warning',
        ];
    }
}
