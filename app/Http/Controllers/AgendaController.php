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

        // Get existing slides for this agenda item from the database
        // In a real implementation, this would load slides from a slides table
        // For now, we'll simulate this with example data
        $slides = $this->getExampleSlides($agendaItem);
        
        // Return Inertia response with our new agenda editor component
        return Inertia::render('agenda/agenda-editor', [
            'event' => $event,
            'agendaItem' => $agendaItem,
            'slides' => $slides
        ]);
    }

    /**
     * Get example slides for the agenda item (temporary placeholder)
     */
    private function getExampleSlides(AgendaItem $agendaItem): array
    {
        // In a real implementation, this would load from a database
        // For now, we'll create some example slides based on the activity type
        
        $slideTypes = ['poll', 'quiz', 'qa', 'rating', 'checkin', 'selfie', 'speaker'];
        $slides = [];
        
        // Generate a few slides for demonstration
        $numSlides = rand(1, 3);
        for ($i = 0; $i < $numSlides; $i++) {
            $type = $slideTypes[array_rand($slideTypes)];
            $slides[] = $this->createSlide($agendaItem->id, $i, $type, $agendaItem);
        }
        
        return $slides;
    }

    /**
     * Create a slide with type-specific content
     */
    private function createSlide($activityId, $order, $type, $agendaItem): array
    {
        $slide = [
            'id' => rand(100, 999),
            'title' => ucfirst($type) . ' Slide',
            'duration' => rand(15, 60),
            'slide_type' => $type,
            'activity_id' => $activityId,
            'order' => $order,
            'created_at' => now()->toISOString(),
            'updated_at' => now()->toISOString()
        ];
        
        // Add content based on slide type
        switch ($type) {
            case 'poll':
                $slide['content'] = [
                    'question' => 'What do you think of this session?',
                    'options' => ['Great!', 'Good', 'Average', 'Need improvement']
                ];
                break;
            
            case 'quiz':
                $slide['content'] = [
                    'question' => 'What technology are we using?',
                    'options' => ['React', 'Vue', 'Angular', 'Svelte'],
                    'correctAnswer' => 'React'
                ];
                break;
                
            case 'qa':
                $slide['content'] = [
                    'question' => 'Do you have any questions for the presenter?'
                ];
                break;
                
            case 'rating':
                $slide['content'] = [
                    'question' => 'Rate this session:',
                    'maxRating' => 5
                ];
                break;
                
            case 'checkin':
                $slide['content'] = [
                    'location' => $agendaItem->location ?? 'Event venue'
                ];
                break;
                
            case 'selfie':
                $slide['content'] = [
                    'prompt' => 'Take a selfie at ' . ($agendaItem->title ?? 'the event') . '!'
                ];
                break;
                
            case 'speaker':
                $slide['content'] = [
                    'speakerId' => 'speaker1'
                ];
                break;
        }
        
        return $slide;
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
