<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('leads', function (Blueprint $table) {
            $table->id();
            $table->string('lead_id')->unique();
            $table->string('nama_perusahaan');
            $table->string('nama_pic');
            $table->string('telepon');
            $table->string('email')->nullable();
            $table->text('alamat')->nullable();
            $table->enum('sumber_lead', ['telepon', 'website', 'referral', 'media_sosial', 'walk_in', 'lainnya']);
            $table->text('kebutuhan')->nullable();
            $table->enum('status', ['baru', 'dihubungi', 'survey', 'quotation', 'negosiasi', 'menang', 'kalah'])->default('baru');
            $table->foreignId('assigned_sales')->nullable()->constrained('users')->nullOnDelete();
            $table->text('catatan')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('leads');
    }
};
