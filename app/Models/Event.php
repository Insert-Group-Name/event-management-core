<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Event extends Model
{
    use HasFactory;
    
    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'title',
        'description',
        'date',
        'end_date',
        'location',
        'user_id',
    ];

    /**
     * The attributes that should be appended to arrays.
     *
     * @var array<int, string>
     */
    protected $appends = ['start_date', 'name'];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date' => 'datetime',
        'end_date' => 'datetime',
    ];

    /**
     * Get the event's name (alias for title).
     *
     * @return string
     */
    public function getNameAttribute()
    {
        return $this->title;
    }
    
    /**
     * Set the event's name (alias for title).
     *
     * @param string $value
     * @return void
     */
    public function setNameAttribute($value)
    {
        $this->attributes['title'] = $value;
    }

    /**
     * Get the user that owns the event.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the attendees for the event.
     */
    public function attendees(): HasMany
    {
        return $this->hasMany(Attendee::class);
    }

    /**
     * Get the feedback for the event.
     */
    public function feedback(): HasMany
    {
        return $this->hasMany(Feedback::class);
    }
    
    /**
     * Get the poll associated with the event.
     */
    public function polls(): HasMany
    {
        return $this->hasMany(Poll::class);
    }

    /**
     * Get the agenda items for the event.
     */
    public function agendaItems(): HasMany
    {
        return $this->hasMany(AgendaItem::class);
    }

    /**
     * Get the event's start_date (alias for date).
     *
     * @return string
     */
    public function getStartDateAttribute()
    {
        return $this->date;
    }
    
    /**
     * Set the event's start_date (alias for date).
     *
     * @param string $value
     * @return void
     */
    public function setStartDateAttribute($value)
    {
        $this->attributes['date'] = $value;
    }
}
