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
        // View to get all interactive contents with their specific details
        DB::statement("
            CREATE VIEW view_all_interactive_contents AS
            SELECT 
                ic.id, 
                ic.activity_id, 
                ic.type, 
                ic.duration, 
                ic.display_order,
                a.title as activity_title,
                a.start_time as activity_start_time,
                a.end_time as activity_end_time,
                a.type as activity_type,
                e.id as event_id,
                e.title as event_title,
                e.date as event_date,
                CASE 
                    WHEN ic.type = 'poll' THEN (SELECT pc.question FROM poll_contents pc WHERE pc.content_id = ic.id)
                    WHEN ic.type = 'quiz' THEN (SELECT qc.question FROM quiz_contents qc WHERE qc.content_id = ic.id)
                    WHEN ic.type = 'qa' THEN (SELECT qac.question FROM qa_contents qac WHERE qac.content_id = ic.id)
                    WHEN ic.type = 'rating' THEN (SELECT rc.question FROM rating_contents rc WHERE rc.content_id = ic.id)
                    WHEN ic.type = 'checkin' THEN (SELECT cc.location FROM checkin_contents cc WHERE cc.content_id = ic.id)
                    WHEN ic.type = 'selfie' THEN (SELECT sc.prompt FROM selfie_contents sc WHERE sc.content_id = ic.id)
                    WHEN ic.type = 'speaker' THEN (
                        SELECT sp.name 
                        FROM speaker_contents spc 
                        JOIN speakers sp ON spc.speaker_id = sp.id 
                        WHERE spc.content_id = ic.id
                    )
                    ELSE NULL
                END as content
            FROM 
                interactive_contents ic
            JOIN 
                activities a ON ic.activity_id = a.id
            JOIN 
                events e ON a.event_id = e.id
            ORDER BY 
                e.date, a.start_time, ic.display_order
        ");

        // View to get activity statistics
        DB::statement("
            CREATE VIEW view_activity_statistics AS
            SELECT 
                a.id as activity_id,
                a.title as activity_title,
                a.type as activity_type,
                e.id as event_id,
                e.title as event_title,
                COUNT(DISTINCT ic.id) as content_count,
                COUNT(DISTINCT asp.speaker_id) as speaker_count,
                SUM(ic.duration) as total_content_duration_seconds
            FROM 
                activities a
            JOIN 
                events e ON a.event_id = e.id
            LEFT JOIN 
                interactive_contents ic ON a.id = ic.activity_id
            LEFT JOIN 
                activity_speakers asp ON a.id = asp.activity_id
            GROUP BY 
                a.id, a.title, a.type, e.id, e.title
            ORDER BY 
                e.date, a.start_time
        ");

        // View to get user engagement statistics
        DB::statement("
            CREATE VIEW view_user_engagement AS
            SELECT 
                u.id as user_id,
                u.name as user_name,
                e.id as event_id,
                e.title as event_title,
                COUNT(DISTINCT pr.id) as poll_responses,
                COUNT(DISTINCT qr.id) as quiz_responses,
                COUNT(DISTINCT qar.id) as qa_responses,
                COUNT(DISTINCT rr.id) as rating_responses,
                COUNT(DISTINCT cr.id) as checkins,
                COUNT(DISTINCT ss.id) as selfies
            FROM 
                users u
            JOIN 
                event_registrations er ON u.id = er.user_id
            JOIN 
                events e ON er.event_id = e.id
            LEFT JOIN 
                poll_responses pr ON u.id = pr.user_id
            LEFT JOIN 
                quiz_responses qr ON u.id = qr.user_id
            LEFT JOIN 
                qa_responses qar ON u.id = qar.user_id
            LEFT JOIN 
                rating_responses rr ON u.id = rr.user_id
            LEFT JOIN 
                checkin_records cr ON u.id = cr.user_id
            LEFT JOIN 
                selfie_submissions ss ON u.id = ss.user_id
            GROUP BY 
                u.id, u.name, e.id, e.title
            ORDER BY 
                e.date, u.name
        ");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        DB::statement('DROP VIEW IF EXISTS view_user_engagement');
        DB::statement('DROP VIEW IF EXISTS view_activity_statistics');
        DB::statement('DROP VIEW IF EXISTS view_all_interactive_contents');
    }
};
