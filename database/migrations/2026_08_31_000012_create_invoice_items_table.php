<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoice_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('invoice_id')->constrained('invoices')->onDelete('cascade');
            $table->string('deskripsi');
            $table->decimal('kuantitas', 10, 2)->default(1);
            $table->string('satuan', 50)->default('paket');
            $table->decimal('harga_satuan', 15, 2)->default(0);
            $table->decimal('diskon_persen', 5, 2)->default(0);
            $table->decimal('subtotal', 15, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoice_items');
    }
};
