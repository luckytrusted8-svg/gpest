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
        Schema::create('technicians', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('employee_id')->unique();
            $table->string('nama');
            $table->string('telepon');
            $table->string('email');
            $table->string('jabatan');
            $table->enum('status', ['aktif', 'tidak_aktif', 'cuti'])->default('aktif');
            $table->string('area_tugas')->nullable();
            $table->json('keahlian')->nullable();
            $table->date('tanggal_bergabung');
            $table->string('foto_profil')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('technicians');
    }
};
