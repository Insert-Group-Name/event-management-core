<?php

namespace App\Http\Controllers;

use App\Models\Attendee;
use App\Models\Event;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AttendeeController extends Controller
{
    /**
     * Display a listing of the attendees for a specific event.
     */
    public function index(Event $event): Response
    {
        // Get all attendees for the event
        $attendees = Attendee::where('event_id', $event->id)
            ->select('id', 'name', 'email', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();
        
        return Inertia::render('attendees/index', [
            'event' => $event,
            'attendees' => $attendees
        ]);
    }

    /**
     * Show the form for creating a new attendee.
     */
    public function create(Event $event): Response
    {
        return Inertia::render('attendees/create', [
            'event' => $event
        ]);
    }

    /**
     * Store a newly created attendee in storage.
     */
    public function store(Request $request, Event $event)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
        ]);

        $attendee = new Attendee();
        $attendee->name = $validated['name'];
        $attendee->email = $validated['email'];
        $attendee->event_id = $event->id;
        $attendee->save();

        return redirect()->route('events.attendees.index', $event)
            ->with('message', 'Attendee added successfully.');
    }

    /**
     * Display the specified attendee.
     */
    public function show(Event $event, Attendee $attendee): Response
    {
        return Inertia::render('attendees/show', [
            'event' => $event,
            'attendee' => $attendee
        ]);
    }

    /**
     * Show the form for editing the specified attendee.
     */
    public function edit(Event $event, Attendee $attendee): Response
    {
        return Inertia::render('attendees/edit', [
            'event' => $event,
            'attendee' => $attendee
        ]);
    }

    /**
     * Update the specified attendee in storage.
     */
    public function update(Request $request, Event $event, Attendee $attendee)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
        ]);

        $attendee->name = $validated['name'];
        $attendee->email = $validated['email'];
        $attendee->save();

        return redirect()->route('events.attendees.index', $event)
            ->with('message', 'Attendee updated successfully.');
    }

    /**
     * Remove the specified attendee from storage.
     */
    public function destroy(Event $event, Attendee $attendee)
    {
        $attendee->delete();

        return redirect()->route('events.attendees.index', $event)
            ->with('message', 'Attendee deleted successfully.');
    }
} 