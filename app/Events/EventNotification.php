<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class EventNotification implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $title;
    public $description;
    public $attendeeName;
    public $type;
    private $userId;
    private $eventId;

    /**
     * Create a new event instance.
     */
    public function __construct(int $userId, int $eventId, string $title, string $description, string $attendeeName, string $type)
    {
        $this->userId = $userId;
        $this->eventId = $eventId;
        $this->title = $title;
        $this->description = $description;
        $this->attendeeName = $attendeeName;
        $this->type = $type;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("user.{$this->userId}.event.{$this->eventId}"),
        ];
    }

    /**
     * The event's broadcast name.
     */
    public function broadcastAs(): string
    {
        return 'event.notification';
    }

    /**
     * Get the data to broadcast.
     *
     * @return array<string, mixed>
     */
    public function broadcastWith(): array
    {
        return [
            'title' => $this->title,
            'description' => $this->description,
            'attendee_name' => $this->attendeeName,
            'type' => $this->type,
            'event_id' => $this->eventId,
            'timestamp' => now()->toIso8601String(),
        ];
    }
} 