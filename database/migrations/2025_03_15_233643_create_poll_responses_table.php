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
        Schema::create('poll_responses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('poll_option_id');
            $table->foreign('poll_option_id')->references('id')->on('poll_options')->onDelete('cascade');
            $table->unsignedBigInteger('attendee_id');
            $table->foreign('attendee_id')->references('id')->on('attendees')->onDelete('cascade');
            $table->timestamps();
            
            // Ensure an attendee can only respond once to a specific poll option
            $table->unique(['poll_option_id', 'attendee_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('poll_responses');
    }
};
