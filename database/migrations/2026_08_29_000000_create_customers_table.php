<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('customers', function (Blueprint $table) {
            $table->id();
            $table->string('customer_id')->unique();
            $table->string('company_name');
            $table->string('pic_name');
            $table->string('phone');
            $table->string('email');
            $table->text('address');
            $table->string('location');
            $table->string('npwp')->nullable();
            $table->enum('status', ['active', 'inactive']);
            $table->string('sales_pic')->nullable();
            $table->timestamps();
            $table->softDeletes();
        });
    }

    public function down()
    {
        Schema::dropIfExists('customers');
    }
};
