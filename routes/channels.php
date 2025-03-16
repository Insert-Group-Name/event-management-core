<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('user.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

Broadcast::channel('user.{userId}.event.{eventId}', function ($user, $userId, $eventId) {
    // First check if the user ID matches
    if ((int) $user->id !== (int) $userId) {
        return false;
    }
    
    // Then check if the user has access to the event
    // This could be expanded to check specific permissions
    $event = \App\Models\Event::find($eventId);
    
    // Allow access if:
    // 1. The event exists
    // 2. The user is the owner of the event OR
    // 3. The user is registered for the event
    return $event && (
        $event->user_id === $user->id || 
        $user->registrations()->where('event_id', $eventId)->exists()
    );
});
