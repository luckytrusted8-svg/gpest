<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('treatments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('work_order_id')->constrained('work_orders')->cascadeOnDelete();
            $table->enum('treatment_type', [
                'spraying', 'baiting', 'trapping', 'fogging',
                'termite', 'fumigation', 'disinfection', 'other',
            ])->default('spraying');
            $table->foreignId('chemical_id')->nullable()->constrained('bahan_kimia')->nullOnDelete();
            $table->decimal('quantity', 10, 2)->default(1);
            $table->string('unit')->default('ml');
            $table->string('area')->nullable();
            $table->string('method')->nullable();
            $table->text('notes')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('treatments');
    }
};
