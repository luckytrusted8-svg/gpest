<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->string('work_type', 10)->default('WFO')->after('status');
            $table->string('selfie_masuk')->nullable()->after('work_type');
            $table->text('tanda_tangan')->nullable()->after('selfie_masuk');
            $table->string('lokasi_nama')->nullable()->after('tanda_tangan');
        });
    }

    public function down(): void
    {
        Schema::table('attendances', function (Blueprint $table) {
            $table->dropColumn(['work_type', 'selfie_masuk', 'tanda_tangan', 'lokasi_nama']);
        });
    }
};
