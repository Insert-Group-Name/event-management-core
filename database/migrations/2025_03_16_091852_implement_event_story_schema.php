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
        // Create custom enum types with checks
        try {
            // Try to create the enum types, but they'll fail if they already exist (which is fine)
            DB::statement("CREATE TYPE activity_type AS ENUM ('session', 'break', 'networking', 'workshop', 'keynote')");
        } catch (\Exception $e) {
            // Type already exists
        }
        
        try {
            DB::statement("CREATE TYPE interactive_content_type AS ENUM ('poll', 'quiz', 'qa', 'rating', 'checkin', 'selfie', 'speaker')");
        } catch (\Exception $e) {
            // Type already exists
        }
        
        try {
            DB::statement("CREATE TYPE user_role AS ENUM ('attendee', 'speaker', 'organizer', 'admin')");
        } catch (\Exception $e) {
            // Type already exists
        }
        
        try {
            DB::statement("CREATE TYPE registration_status AS ENUM ('registered', 'checked-in', 'cancelled')");
        } catch (\Exception $e) {
            // Type already exists
        }

        // Drop existing poll_responses table since we need to recreate it with a new structure
        Schema::dropIfExists('poll_responses');

        // Modify events table
        Schema::table('events', function (Blueprint $table) {
            // Check if columns exist before adding
            if (!Schema::hasColumn('events', 'location')) {
                $table->string('location')->nullable();
            }
            if (!Schema::hasColumn('events', 'organizer_id')) {
                $table->unsignedBigInteger('organizer_id')->nullable();
            }
            
            // Rename existing columns to match the new schema
            if (Schema::hasColumn('events', 'name') && !Schema::hasColumn('events', 'title')) {
                $table->renameColumn('name', 'title');
            }
            if (Schema::hasColumn('events', 'start_date') && !Schema::hasColumn('events', 'date')) {
                $table->renameColumn('start_date', 'date');
            }
        });

        // Create speakers table
        Schema::create('speakers', function (Blueprint $table) {
            $table->id();
            $table->string('name', 255);
            $table->string('title', 255);
            $table->string('company', 255);
            $table->text('bio');
            $table->string('photo_url', 255);
            $table->string('twitter', 255)->nullable();
            $table->string('linkedin', 255)->nullable();
            $table->string('github', 255)->nullable();
            $table->string('website', 255)->nullable();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->timestamps();
            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });

        // Create activities table
        Schema::create('activities', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('event_id');
            $table->string('title', 255);
            $table->text('description');
            $table->timestampTz('start_time');
            $table->timestampTz('end_time');
            $table->string('type'); // Will use the activity_type enum
            $table->string('location', 255);
            $table->timestamps();
            
            $table->foreign('event_id')->references('id')->on('events')->onDelete('cascade');
            
            // Indexes
            $table->index('event_id');
            $table->index('start_time');
            $table->index('end_time');
        });

        // Create activity_speakers junction table
        Schema::create('activity_speakers', function (Blueprint $table) {
            $table->unsignedBigInteger('activity_id');
            $table->unsignedBigInteger('speaker_id');
            $table->timestamp('created_at')->nullable();
            
            $table->primary(['activity_id', 'speaker_id']);
            $table->foreign('activity_id')->references('id')->on('activities')->onDelete('cascade');
            $table->foreign('speaker_id')->references('id')->on('speakers')->onDelete('cascade');
            
            // Index
            $table->index('speaker_id');
        });

        // Create interactive_contents table
        Schema::create('interactive_contents', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('activity_id');
            $table->string('type'); // Will use the interactive_content_type enum
            $table->integer('duration'); // in seconds
            $table->integer('display_order');
            $table->timestamps();
            
            $table->foreign('activity_id')->references('id')->on('activities')->onDelete('cascade');
            
            // Indexes
            $table->index('activity_id');
            $table->index('type');
        });

        // Create poll_contents table
        Schema::create('poll_contents', function (Blueprint $table) {
            $table->unsignedBigInteger('content_id')->primary();
            $table->text('question');
            $table->timestamps();
            
            $table->foreign('content_id')->references('id')->on('interactive_contents')->onDelete('cascade');
        });

        // Create poll_options table - adjust existing or create new
        if (Schema::hasTable('poll_options')) {
            Schema::table('poll_options', function (Blueprint $table) {
                // Add new columns if they don't exist
                if (!Schema::hasColumn('poll_options', 'poll_content_id')) {
                    $table->unsignedBigInteger('poll_content_id')->nullable();
                    $table->foreign('poll_content_id')->references('content_id')->on('poll_contents')->onDelete('cascade');
                }
                if (!Schema::hasColumn('poll_options', 'option_order')) {
                    $table->integer('option_order')->nullable();
                }
            });
        } else {
            Schema::create('poll_options', function (Blueprint $table) {
                $table->id();
                $table->unsignedBigInteger('poll_content_id');
                $table->string('text', 255);
                $table->integer('option_order');
                $table->timestamps();
                
                $table->foreign('poll_content_id')->references('content_id')->on('poll_contents')->onDelete('cascade');
                
                // Index
                $table->index('poll_content_id');
            });
        }

        // Create quiz_contents table
        Schema::create('quiz_contents', function (Blueprint $table) {
            $table->unsignedBigInteger('content_id')->primary();
            $table->text('question');
            $table->string('correct_answer', 255);
            $table->timestamps();
            
            $table->foreign('content_id')->references('id')->on('interactive_contents')->onDelete('cascade');
        });

        // Create quiz_options table
        Schema::create('quiz_options', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('quiz_content_id');
            $table->string('text', 255);
            $table->integer('option_order');
            $table->timestamps();
            
            $table->foreign('quiz_content_id')->references('content_id')->on('quiz_contents')->onDelete('cascade');
            
            // Index
            $table->index('quiz_content_id');
        });

        // Create qa_contents table
        Schema::create('qa_contents', function (Blueprint $table) {
            $table->unsignedBigInteger('content_id')->primary();
            $table->text('question');
            $table->timestamps();
            
            $table->foreign('content_id')->references('id')->on('interactive_contents')->onDelete('cascade');
        });

        // Create rating_contents table
        Schema::create('rating_contents', function (Blueprint $table) {
            $table->unsignedBigInteger('content_id')->primary();
            $table->text('question');
            $table->integer('max_rating');
            $table->timestamps();
            
            $table->foreign('content_id')->references('id')->on('interactive_contents')->onDelete('cascade');
        });

        // Create checkin_contents table
        Schema::create('checkin_contents', function (Blueprint $table) {
            $table->unsignedBigInteger('content_id')->primary();
            $table->string('location', 255);
            $table->timestamps();
            
            $table->foreign('content_id')->references('id')->on('interactive_contents')->onDelete('cascade');
        });

        // Create selfie_contents table
        Schema::create('selfie_contents', function (Blueprint $table) {
            $table->unsignedBigInteger('content_id')->primary();
            $table->text('prompt');
            $table->timestamps();
            
            $table->foreign('content_id')->references('id')->on('interactive_contents')->onDelete('cascade');
        });

        // Create speaker_contents table
        Schema::create('speaker_contents', function (Blueprint $table) {
            $table->unsignedBigInteger('content_id')->primary();
            $table->unsignedBigInteger('speaker_id');
            $table->timestamps();
            
            $table->foreign('content_id')->references('id')->on('interactive_contents')->onDelete('cascade');
            $table->foreign('speaker_id')->references('id')->on('speakers')->onDelete('cascade');
            
            // Index
            $table->index('speaker_id');
        });

        // Create event_registrations table
        Schema::create('event_registrations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('event_id');
            $table->unsignedBigInteger('user_id');
            $table->timestampTz('registration_date')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->string('status')->default('registered'); // Will use registration_status enum
            $table->timestamps();
            
            $table->foreign('event_id')->references('id')->on('events')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            // Indexes
            $table->index('event_id');
            $table->index('user_id');
            $table->index('status');
        });

        // Create poll_responses table
        Schema::create('poll_responses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('poll_content_id');
            $table->unsignedBigInteger('option_id');
            $table->unsignedBigInteger('user_id');
            $table->timestampTz('response_time')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('created_at')->nullable();
            
            $table->foreign('poll_content_id')->references('content_id')->on('poll_contents')->onDelete('cascade');
            $table->foreign('option_id')->references('id')->on('poll_options')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            // Indexes
            $table->index('poll_content_id');
            $table->index('user_id');
        });

        // Create quiz_responses table
        Schema::create('quiz_responses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('quiz_content_id');
            $table->unsignedBigInteger('option_id');
            $table->unsignedBigInteger('user_id');
            $table->boolean('is_correct');
            $table->timestampTz('response_time')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('created_at')->nullable();
            
            $table->foreign('quiz_content_id')->references('content_id')->on('quiz_contents')->onDelete('cascade');
            $table->foreign('option_id')->references('id')->on('quiz_options')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            // Indexes
            $table->index('quiz_content_id');
            $table->index('user_id');
        });

        // Create qa_responses table
        Schema::create('qa_responses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('qa_content_id');
            $table->text('answer');
            $table->unsignedBigInteger('user_id');
            $table->timestampTz('response_time')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('created_at')->nullable();
            
            $table->foreign('qa_content_id')->references('content_id')->on('qa_contents')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            // Indexes
            $table->index('qa_content_id');
            $table->index('user_id');
        });

        // Create rating_responses table
        Schema::create('rating_responses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('rating_content_id');
            $table->integer('rating');
            $table->unsignedBigInteger('user_id');
            $table->timestampTz('response_time')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('created_at')->nullable();
            
            $table->foreign('rating_content_id')->references('content_id')->on('rating_contents')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            // Indexes
            $table->index('rating_content_id');
            $table->index('user_id');
        });

        // Create checkin_records table
        Schema::create('checkin_records', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('checkin_content_id');
            $table->unsignedBigInteger('user_id');
            $table->timestampTz('checkin_time')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('created_at')->nullable();
            
            $table->foreign('checkin_content_id')->references('content_id')->on('checkin_contents')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            // Indexes
            $table->index('checkin_content_id');
            $table->index('user_id');
        });

        // Create selfie_submissions table
        Schema::create('selfie_submissions', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('selfie_content_id');
            $table->string('image_url', 255);
            $table->unsignedBigInteger('user_id');
            $table->timestampTz('submission_time')->default(DB::raw('CURRENT_TIMESTAMP'));
            $table->timestamp('created_at')->nullable();
            
            $table->foreign('selfie_content_id')->references('content_id')->on('selfie_contents')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            
            // Indexes
            $table->index('selfie_content_id');
            $table->index('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Drop all new tables in reverse order to avoid foreign key constraints
        Schema::dropIfExists('selfie_submissions');
        Schema::dropIfExists('checkin_records');
        Schema::dropIfExists('rating_responses');
        Schema::dropIfExists('qa_responses');
        Schema::dropIfExists('quiz_responses');
        Schema::dropIfExists('poll_responses');
        Schema::dropIfExists('event_registrations');
        Schema::dropIfExists('speaker_contents');
        Schema::dropIfExists('selfie_contents');
        Schema::dropIfExists('checkin_contents');
        Schema::dropIfExists('rating_contents');
        Schema::dropIfExists('qa_contents');
        Schema::dropIfExists('quiz_options');
        Schema::dropIfExists('quiz_contents');
        Schema::dropIfExists('poll_options');
        Schema::dropIfExists('poll_contents');
        Schema::dropIfExists('interactive_contents');
        Schema::dropIfExists('activity_speakers');
        Schema::dropIfExists('activities');
        Schema::dropIfExists('speakers');

        // Reverse changes to events table
        Schema::table('events', function (Blueprint $table) {
            if (Schema::hasColumn('events', 'title') && !Schema::hasColumn('events', 'name')) {
                $table->renameColumn('title', 'name');
            }
            if (Schema::hasColumn('events', 'date') && !Schema::hasColumn('events', 'start_date')) {
                $table->renameColumn('date', 'start_date');
            }
            if (Schema::hasColumn('events', 'location')) {
                $table->dropColumn('location');
            }
            if (Schema::hasColumn('events', 'organizer_id')) {
                $table->dropColumn('organizer_id');
            }
        });

        // Drop enum types
        DB::statement('DROP TYPE IF EXISTS activity_type');
        DB::statement('DROP TYPE IF EXISTS interactive_content_type');
        DB::statement('DROP TYPE IF EXISTS user_role');
        DB::statement('DROP TYPE IF EXISTS registration_status');
    }
};
