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
        Schema::table('customer_requests', function (Blueprint $table) {
            $table->foreignId('site_id')->nullable()->after('customer_id')->constrained('sites')->nullOnDelete();
            $table->string('lokasi')->nullable()->after('site_id');
            $table->text('alamat_detail')->nullable()->after('lokasi');
            $table->string('pic_name')->nullable()->after('alamat_detail');
            $table->string('pic_phone')->nullable()->after('pic_name');
            $table->string('waktu_layanan')->nullable()->after('tanggal_permintaan');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('customer_requests', function (Blueprint $table) {
            $table->dropForeign(['site_id']);
            $table->dropColumn([
                'site_id',
                'lokasi',
                'alamat_detail',
                'pic_name',
                'pic_phone',
                'waktu_layanan',
            ]);
        });
    }
};
