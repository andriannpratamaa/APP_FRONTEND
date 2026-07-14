<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Monitoring extends Model
{
    use HasFactory;

    protected $fillable = [
        'device_id',
        'ac_voltage',
        'ac_current',
        'dc_voltage',
        'temperature',
        'humidity',
        'status',
        'recorded_at',
    ];

    protected $casts = [
        'recorded_at' => 'datetime',
        'ac_voltage' => 'float',
        'ac_current' => 'float',
        'dc_voltage' => 'float',
        'temperature' => 'float',
        'humidity' => 'float',
    ];

    public function device()
    {
        return $this->belongsTo(Device::class);
    }
}
