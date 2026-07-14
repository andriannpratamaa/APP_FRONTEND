<?php

namespace App\Services;

use App\Models\User;
use App\Repositories\DeviceRepository;
use App\Repositories\MonitoringRepository;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthService
{
    public function __construct(
        protected DeviceRepository $deviceRepository,
        protected MonitoringRepository $monitoringRepository,
    ) {}

    public function login(array $credentials): array
    {
        $user = User::where('email', $credentials['email'])->first();

        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Email atau password salah'],
            ]);
        }

        $token = $user->createToken('auth-token')->plainTextToken;

        return [
            'user' => $user,
            'token' => $token,
        ];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()->delete();
    }

    public function updateProfile(User $user, array $data): User
    {
        $user->update($data);
        return $user->fresh();
    }

    public function changePassword(User $user, string $oldPassword, string $newPassword): void
    {
        if (!Hash::check($oldPassword, $user->password)) {
            throw ValidationException::withMessages([
                'old_password' => ['Password lama tidak sesuai'],
            ]);
        }

        $user->update([
            'password' => Hash::make($newPassword),
        ]);
    }

    public function getDashboard(?int $deviceId = null): array
    {
        $latestMonitorings = $this->monitoringRepository->getLatest(1, $deviceId);
        $latestMonitoring = $latestMonitorings->first();

        return [
            'total_devices' => $this->deviceRepository->totalDevices(),
            'devices_online' => $this->deviceRepository->countOnline(),
            'devices_offline' => $this->deviceRepository->countOffline(),
            'latest_monitoring' => $latestMonitoring,
            'last_update' => $latestMonitoring?->recorded_at,
        ];
    }
}
