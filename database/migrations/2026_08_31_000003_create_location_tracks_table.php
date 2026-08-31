<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('location_tracks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('technician_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('schedule_id')->nullable()->constrained('schedules')->onDelete('set null');
            $table->decimal('latitude', 10, 8);
            $table->decimal('longitude', 11, 8);
            $table->decimal('akurasi', 8, 2)->nullable();
            $table->decimal('kecepatan', 6, 2)->nullable();
            $table->enum('status_teknisi', ['aktif', 'dalam_perjalanan', 'tiba', 'bekerja', 'offline'])->default('aktif');
            $table->timestamps();

            $table->index(['technician_id', 'created_at']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('location_tracks');
    }
};
