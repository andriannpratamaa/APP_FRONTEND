<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Device extends Model
{
    use HasFactory;

    protected $fillable = [
        'device_code',
        'device_name',
        'location',
        'firmware_version',
        'ip_address',
        'mac_address',
        'status',
        'last_seen',
        'user_id',
    ];

    protected $casts = [
        'last_seen' => 'datetime',
    ];

    public function monitorings()
    {
        return $this->hasMany(Monitoring::class);
    }

    public function latestMonitoring()
    {
        return $this->hasOne(Monitoring::class)->latestOfMany('recorded_at');
    }

    public function scopeOnline($query)
    {
        return $query->where('status', 'online');
    }

    public function scopeOffline($query)
    {
        return $query->where('status', 'offline');
    }
}
