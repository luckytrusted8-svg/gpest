<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('survey_reports', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_survey')->unique();
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->foreignId('contract_id')->nullable()->constrained('contracts')->onDelete('set null');
            $table->foreignId('technician_id')->constrained('users')->onDelete('cascade');
            $table->date('tanggal_survey');
            $table->string('lokasi');
            $table->json('jenis_hama');
            $table->string('area_survey');
            $table->text('temuan');
            $table->enum('tingkat_risiko', ['rendah', 'sedang', 'tinggi', 'kritis'])->default('rendah');
            $table->text('rekomendasi');
            $table->text('catatan')->nullable();
            $table->enum('status', ['draft', 'dikirim', 'disetujui', 'selesai'])->default('draft');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('survey_reports');
    }
};
