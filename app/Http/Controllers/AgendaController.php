<?php

namespace App\Http\Controllers;

use App\Models\AgendaItem;
use App\Models\Event;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class AgendaController extends Controller
{
    /**
     * Display agenda items for an event
     */
    public function index(Event $event): Response
    {
        $agendaItems = $event->agendaItems()
            ->orderBy('start_time')
            ->get();

        // Return Inertia response with agenda items
        return Inertia::render('agenda/index', [
            'event' => $event,
            'agendaItems' => $agendaItems
        ]);
    }

    /**
     * Show the form for creating a new agenda item
     */
    public function create(Event $event): Response
    {
        // Return Inertia response with create form
        return Inertia::render('agenda/create', [
            'event' => $event
        ]);
    }

    /**
     * Store a newly created agenda item
     */
    public function store(Request $request, Event $event): RedirectResponse
    {
        // Validate the request
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'location' => 'nullable|string|max:255',
            'speaker' => 'nullable|string|max:255',
            'order' => 'nullable|integer',
        ]);

        // Extract date part from timestamps
        $validated['start_date'] = date('Y-m-d', strtotime($validated['start_time']));
        $validated['end_date'] = date('Y-m-d', strtotime($validated['end_time']));

        // Create the agenda item
        $agendaItem = $event->agendaItems()->create($validated);

        // Redirect to the agenda items index
        return Redirect::route('event.agenda.index', ['event' => $event->id])
            ->with('success', 'Agenda item created successfully.');
    }

    /**
     * Display the specified agenda item
     */
    public function show(Event $event, AgendaItem $agendaItem): Response
    {
        // Ensure the agenda item belongs to the event
        if ($agendaItem->event_id !== $event->id) {
            abort(404);
        }

        // Return Inertia response with agenda item details
        return Inertia::render('agenda/show', [
            'event' => $event,
            'agendaItem' => $agendaItem
        ]);
    }

    /**
     * Show the form for editing the specified agenda item
     */
    public function edit(Event $event, AgendaItem $agendaItem): Response
    {
        // Ensure the agenda item belongs to the event
        if ($agendaItem->event_id !== $event->id) {
            abort(404);
        }

        // Return Inertia response with edit form
        return Inertia::render('agenda/edit', [
            'event' => $event,
            'agendaItem' => $agendaItem
        ]);
    }

    /**
     * Update the specified agenda item
     */
    public function update(Request $request, Event $event, AgendaItem $agendaItem): RedirectResponse
    {
        // Ensure the agenda item belongs to the event
        if ($agendaItem->event_id !== $event->id) {
            abort(404);
        }

        // Validate the request
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'required|date',
            'end_time' => 'required|date|after:start_time',
            'location' => 'nullable|string|max:255',
            'speaker' => 'nullable|string|max:255',
            'order' => 'nullable|integer',
        ]);

        // Extract date part from timestamps
        $validated['start_date'] = date('Y-m-d', strtotime($validated['start_time']));
        $validated['end_date'] = date('Y-m-d', strtotime($validated['end_time']));

        // Update the agenda item
        $agendaItem->update($validated);

        // Redirect to the agenda items index
        return Redirect::route('event.agenda.index', ['event' => $event->id])
            ->with('success', 'Agenda item updated successfully.');
    }

    /**
     * Remove the specified agenda item
     */
    public function destroy(Event $event, AgendaItem $agendaItem): RedirectResponse
    {
        // Ensure the agenda item belongs to the event
        if ($agendaItem->event_id !== $event->id) {
            abort(404);
        }

        // Delete the agenda item
        $agendaItem->delete();

        // Redirect to the agenda items index
        return Redirect::route('event.agenda.index', ['event' => $event->id])
            ->with('success', 'Agenda item deleted successfully.');
    }
}
