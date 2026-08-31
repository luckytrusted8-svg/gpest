<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('judul');
            $table->text('pesan');
            $table->enum('jenis', ['info', 'sukses', 'peringatan', 'error'])->default('info');
            $table->string('modul');
            $table->string('url_tujuan')->nullable();
            $table->timestamp('dibaca_pada')->nullable();
            $table->timestamps();

            $table->index(['user_id', 'dibaca_pada']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
