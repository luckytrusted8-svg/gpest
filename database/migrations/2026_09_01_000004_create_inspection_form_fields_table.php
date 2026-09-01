<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inspection_form_fields', function (Blueprint $table) {
            $table->id();
            $table->foreignId('inspection_form_id')->constrained('inspection_forms')->cascadeOnDelete();
            $table->string('label');
            $table->string('field_key');
            $table->enum('type', [
                'text', 'number', 'textarea', 'yesno', 'dropdown',
                'multiselect', 'date', 'image', 'signature',
                'document', 'barcode', 'phone', 'email', 'item',
            ])->default('text');
            $table->boolean('required')->default(false);
            $table->json('options')->nullable();
            $table->string('placeholder')->nullable();
            $table->integer('order')->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inspection_form_fields');
    }
};
