<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // First add the columns
        Schema::table('agenda_items', function (Blueprint $table) {
            $table->date('start_date')->nullable()->after('description');
            $table->date('end_date')->nullable()->after('start_time');
        });
        
        // Then update the data in a separate statement
        DB::statement('UPDATE agenda_items SET start_date = DATE(start_time), end_date = DATE(end_time)');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('agenda_items', function (Blueprint $table) {
            $table->dropColumn(['start_date', 'end_date']);
        });
    }
};
