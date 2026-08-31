<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('survey_photos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('survey_report_id')->constrained('survey_reports')->onDelete('cascade');
            $table->string('path_foto');
            $table->text('keterangan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('survey_photos');
    }
};
