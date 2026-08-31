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
        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->string('contract_number')->unique();
            $table->foreignId('customer_id')->constrained('customers')->onDelete('cascade');
            $table->string('location');
            $table->string('contract_type');
            $table->date('start_date');
            $table->date('end_date');
            $table->string('service_frequency');
            $table->string('service_type');
            $table->decimal('contract_value', 15, 2);
            $table->enum('status', ['draft', 'active', 'expiring_soon', 'expired', 'cancelled'])->default('draft');
            $table->string('pic')->nullable();
            $table->string('attachment')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('contracts');
    }
};
