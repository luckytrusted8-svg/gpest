<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('schedules', function (Blueprint $table) {
            $table->id();
            $table->string('schedule_code')->unique();
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->foreignId('contract_id')->nullable()->constrained('contracts')->onDelete('set null');
            $table->string('lokasi');
            $table->string('jenis_layanan');
            $table->foreignId('technician_id')->nullable()->constrained('users')->onDelete('set null');
            $table->foreignId('supervisor_id')->nullable()->constrained('users')->onDelete('set null');
            $table->date('tanggal');
            $table->time('jam_mulai');
            $table->time('jam_selesai');
            $table->enum('prioritas', ['rendah', 'normal', 'tinggi', 'urgent'])->default('normal');
            $table->enum('status', [
                'dijadwalkan',
                'ditugaskan',
                'dalam_perjalanan',
                'tiba',
                'sedang_dikerjakan',
                'selesai',
                'dibatalkan',
                'dijadwal_ulang',
            ])->default('dijadwalkan');
            $table->text('catatan')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('schedules');
    }
};
