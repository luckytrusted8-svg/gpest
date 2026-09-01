<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('invoices', function (Blueprint $table) {
            $table->id();
            $table->string('nomor_invoice')->unique();
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->foreignId('contract_id')->nullable()->constrained('contracts')->onDelete('set null');
            $table->foreignId('work_report_id')->nullable()->constrained('work_reports')->onDelete('set null');
            $table->date('tanggal_invoice');
            $table->date('jatuh_tempo');
            $table->decimal('subtotal', 15, 2)->default(0);
            $table->decimal('diskon', 15, 2)->default(0);
            $table->decimal('pajak', 15, 2)->default(0);
            $table->decimal('total', 15, 2)->default(0);
            $table->enum('status_pembayaran', ['draft', 'terbit', 'dikirim', 'dibayar_sebagian', 'lunas', 'jatuh_tempo', 'batal'])->default('draft');
            $table->text('catatan')->nullable();
            $table->foreignId('dibuat_oleh')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('invoices');
    }
};
