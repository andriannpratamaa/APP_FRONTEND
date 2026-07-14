<?php

if (!function_exists('generateDeviceCode')) {
    function generateDeviceCode(): string
    {
        return 'ESP32-' . strtoupper(substr(uniqid(), -6));
    }
}
