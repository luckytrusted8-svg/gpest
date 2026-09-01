<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('customer_requests', function (Blueprint $table) {
            $table->id();
            $table->string('request_number')->unique();
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->string('jenis_layanan');
            $table->enum('prioritas', ['rendah', 'sedang', 'tinggi', 'darurat'])->default('sedang');
            $table->text('deskripsi');
            $table->date('tanggal_permintaan')->nullable();
            $table->enum('status', ['baru', 'ditinjau', 'dijadwalkan', 'diproses', 'selesai', 'ditolak'])->default('baru');
            $table->text('catatan_admin')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('customer_requests');
    }
};
