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
        Schema::table('notifications', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable()->change();
            $table->foreignId('customer_user_id')->nullable()->after('user_id')->constrained('customer_users')->nullOnDelete();
            $table->index(['customer_user_id', 'dibaca_pada']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('notifications', function (Blueprint $table) {
            $table->dropIndex(['customer_user_id', 'dibaca_pada']);
            $table->dropForeign(['customer_user_id']);
            $table->dropColumn(['customer_user_id']);
            $table->unsignedBigInteger('user_id')->nullable(false)->change();
        });
    }
};
