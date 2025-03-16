<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PollResponse extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'poll_option_id',
        'attendee_id',
    ];
    
    /**
     * Get the poll option that was selected.
     */
    public function pollOption(): BelongsTo
    {
        return $this->belongsTo(PollOption::class);
    }
    
    /**
     * Get the attendee who responded.
     */
    public function attendee(): BelongsTo
    {
        return $this->belongsTo(Attendee::class);
    }
}
