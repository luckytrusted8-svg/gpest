<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('work_report_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_report_id')->constrained('work_reports')->onDelete('cascade');
            $table->enum('jenis_foto', ['sebelum', 'selama', 'sesudah']);
            $table->string('path_foto');
            $table->string('keterangan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('work_report_photos');
    }
};
