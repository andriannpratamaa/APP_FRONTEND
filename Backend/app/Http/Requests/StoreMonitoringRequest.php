<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class StoreMonitoringRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'device_code' => 'required|string|exists:devices,device_code',
            'ac_voltage' => 'nullable|numeric|min:0|max:1000',
            'ac_current' => 'nullable|numeric|min:0|max:1000',
            'dc_voltage' => 'nullable|numeric|min:0|max:100',
            'temperature' => 'nullable|numeric|min:-50|max:150',
            'humidity' => 'nullable|numeric|min:0|max:100',
        ];
    }
}
