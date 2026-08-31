<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quotations', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_quotation')->unique();
            $table->foreignId('customer_id')->constrained()->cascadeOnDelete();
            $table->foreignId('lead_id')->nullable()->constrained()->nullOnDelete();
            $table->date('berlaku_hingga');
            $table->text('syarat_ketentuan')->nullable();
            $table->text('catatan')->nullable();
            $table->enum('status', ['draft', 'dikirim', 'dilihat', 'diterima', 'ditolak', 'kadaluarsa'])->default('draft');
            $table->foreignId('dibuat_oleh')->constrained('users');
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quotations');
    }
};
