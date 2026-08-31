<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('work_reports', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_laporan')->unique();
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->foreignId('contract_id')->nullable()->constrained('contracts')->onDelete('set null');
            $table->foreignId('schedule_id')->nullable()->constrained('schedules')->onDelete('set null');
            $table->foreignId('technician_id')->constrained('users')->onDelete('cascade');
            $table->date('tanggal');
            $table->time('jam_mulai');
            $table->time('jam_selesai')->nullable();
            $table->string('jenis_layanan');
            $table->string('jenis_hama')->nullable();
            $table->string('metode_treatment')->nullable();
            $table->string('bahan_kimia')->nullable();
            $table->string('jumlah_bahan')->nullable();
            $table->text('area_treatment')->nullable();
            $table->string('peralatan')->nullable();
            $table->text('temuan')->nullable();
            $table->string('aktivitas_hama')->nullable();
            $table->string('tingkat_keparahan')->nullable();
            $table->text('rekomendasi')->nullable();
            $table->enum('status', ['draft', 'dikirim', 'disetujui', 'revisi', 'selesai'])->default('draft');
            $table->text('catatan_supervisor')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('work_reports');
    }
};
