<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('geofences', function (Blueprint $table) {
            $table->id();
            $table->string('nama');
            $table->foreignId('customer_id')->nullable()->constrained('customers')->onDelete('set null');
            $table->decimal('latitude_pusat', 10, 8);
            $table->decimal('longitude_pusat', 11, 8);
            $table->integer('radius_meter')->default(100);
            $table->boolean('aktif')->default(true);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('geofences');
    }
};
