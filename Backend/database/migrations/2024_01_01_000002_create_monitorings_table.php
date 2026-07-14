<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('monitorings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('device_id')->constrained()->cascadeOnDelete();
            $table->decimal('ac_voltage', 8, 2)->nullable();
            $table->decimal('ac_current', 8, 2)->nullable();
            $table->decimal('dc_voltage', 8, 2)->nullable();
            $table->decimal('temperature', 8, 2)->nullable();
            $table->decimal('humidity', 8, 2)->nullable();
            $table->enum('status', ['online', 'offline', 'warning'])->default('online');
            $table->timestamp('recorded_at');
            $table->timestamps();

            $table->index('recorded_at');
            $table->index(['device_id', 'recorded_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('monitorings');
    }
};
