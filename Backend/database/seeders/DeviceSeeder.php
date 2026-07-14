<?php

namespace Database\Seeders;

use App\Models\Device;
use App\Models\User;
use Illuminate\Database\Seeder;

class DeviceSeeder extends Seeder
{
    public function run(): void
    {
        $user = User::first();

        if (!$user) {
            $user = User::factory()->create([
                'name' => 'Admin',
                'email' => 'admin@wiraiot.com',
                'password' => bcrypt('password'),
            ]);
        }

        $devices = [
            [
                'device_code' => generateDeviceCode(),
                'device_name' => 'Device 1',
                'ip_address' => '192.168.1.100',
                'mac_address' => 'AA:BB:CC:DD:EE:01',
                'firmware_version' => '1.0.0',
                'location' => 'Panel Utama - Lantai 1',
                'status' => 'online',
                'user_id' => $user->id,
            ],
            [
                'device_code' => generateDeviceCode(),
                'device_name' => 'Device 2',
                'ip_address' => '192.168.1.101',
                'mac_address' => 'AA:BB:CC:DD:EE:02',
                'firmware_version' => '1.0.0',
                'location' => 'Panel Cadangan - Lantai 2',
                'status' => 'offline',
                'user_id' => $user->id,
            ],
        ];

        foreach ($devices as $device) {
            Device::create($device);
        }
    }
}
