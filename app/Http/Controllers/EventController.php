<?php

namespace App\Http\Controllers;

use App\Models\Event;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;


class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        // Temporarily increase timeout for debugging
        set_time_limit(120);
        
        // Enable query logging
        DB::enableQueryLog();
        
        $events = Event::select('id', 'title', 'description', 'date', 'end_date', 'user_id', 'created_at')
            ->with('user:id,name')
            ->latest('created_at')
            ->paginate(10);
            
        // Log the executed queries
        Log::info('Event queries:', ['queries' => DB::getQueryLog()]);
        
        return Inertia::render('events/index', [
            'events' => $events
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('events/create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'location' => 'nullable|string|max:255',
        ]);

        $event = new Event();
        $event->title = $validated['name'];
        $event->description = $validated['description'];
        $event->date = $validated['start_date'];
        $event->end_date = $validated['end_date'];
        $event->location = $validated['location'] ?? null;
        $event->user_id = Auth::id();
        $event->save();

        return redirect()->route('events.index')
            ->with('message', 'Event created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Event $event): Response
    {
        return Inertia::render('events/show', [
            'event' => $event
        ]);
    }

    /**
     * Display the event in story format.
     */
    public function storyView(Event $event): Response
    {
        // Load the event with its agenda items and associated data
        $event->load(['agendaItems' => function ($query) {
            $query->orderBy('start_time');
        }]);

        // Transform the data into the format expected by the story view
        $agenda = [
            'id' => (string)$event->id,
            'title' => $event->title,
            'date' => $event->date,
            'activities' => $event->agendaItems->map(function ($item) {
                // For demo purposes, create some example slides
                $slides = $this->generateExampleSlides($item);
                
                return [
                    'id' => (string)$item->id,
                    'title' => $item->title,
                    'description' => $item->description ?? 'No description available',
                    'startTime' => $item->start_time,
                    'endTime' => $item->end_time,
                    'startDate' => $item->start_date,
                    'endDate' => $item->end_date,
                    'type' => $item->type ?? 'session',
                    'location' => $item->location ?? 'Main Hall',
                    'slides' => $slides,
                    'speakers' => $this->getExampleSpeakers($item),
                ];
            }),
        ];

        return Inertia::render('stories/index', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'description' => $event->description,
                'agenda' => $agenda,
            ],
        ]);
    }

    /**
     * Generate example slides for demo purposes.
     */
    private function generateExampleSlides($item): array
    {
        // These are example slides for demonstration
        $slideTypes = ['poll', 'quiz', 'qa', 'rating', 'checkin', 'selfie', 'speaker'];
        $slides = [];
        
        // Add 2-3 random slides per agenda item
        $numSlides = rand(2, 3);
        for ($i = 0; $i < $numSlides; $i++) {
            $type = $slideTypes[array_rand($slideTypes)];
            $content = $this->getSlideContent($type, $item);
            
            $slides[] = [
                'id' => uniqid(),
                'type' => $type,
                'content' => $content,
                'duration' => rand(10, 30), // 10-30 seconds per slide
            ];
        }
        
        return $slides;
    }

    /**
     * Get content for a slide based on its type.
     */
    private function getSlideContent($type, $item): array
    {
        switch ($type) {
            case 'poll':
                return [
                    'question' => 'What are you most excited about in this session?',
                    'options' => [
                        ['id' => '1', 'text' => 'Technical content'],
                        ['id' => '2', 'text' => 'Networking opportunities'],
                        ['id' => '3', 'text' => 'Learning new skills'],
                        ['id' => '4', 'text' => 'Interactive elements'],
                    ],
                ];
            case 'quiz':
                return [
                    'question' => 'What technology is our event platform built with?',
                    'options' => [
                        ['id' => '1', 'text' => 'React & Laravel'],
                        ['id' => '2', 'text' => 'Angular & Django'],
                        ['id' => '3', 'text' => 'Vue & Express'],
                        ['id' => '4', 'text' => 'Svelte & Flask'],
                    ],
                    'correctAnswer' => '1',
                ];
            case 'qa':
                return [
                    'question' => 'Do you have any questions for the presenter?',
                ];
            case 'rating':
                return [
                    'question' => 'How would you rate this session so far?',
                    'maxRating' => 5,
                ];
            case 'checkin':
                return [
                    'location' => $item->location ?? 'Main Hall',
                ];
            case 'selfie':
                return [
                    'prompt' => 'Take a selfie with other attendees!',
                ];
            case 'speaker':
                return [
                    'speakerId' => 'speaker1',
                ];
            default:
                return [];
        }
    }

    /**
     * Get example speakers for demo purposes.
     */
    private function getExampleSpeakers($item): array
    {
        // Example speakers
        return [
            [
                'id' => 'speaker1',
                'name' => 'Jane Smith',
                'title' => 'Lead Developer',
                'company' => 'Tech Innovations',
                'bio' => 'Jane is a seasoned developer with 10+ years of experience in web applications.',
                'photoUrl' => 'https://i.pravatar.cc/150?img=5',
                'socials' => [
                    'twitter' => 'janesmith',
                    'linkedin' => 'janesmith',
                ],
            ],
        ];
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Event $event): Response
    {
        return Inertia::render('events/edit', [
            'event' => $event
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Event $event): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'location' => 'nullable|string|max:255',
        ]);

        $event->title = $validated['name'];
        $event->description = $validated['description'];
        $event->date = $validated['start_date'];
        $event->end_date = $validated['end_date'];
        $event->location = $validated['location'] ?? null;
        $event->save();

        return redirect()->route('events.index')
            ->with('message', 'Event updated successfully.');
    }

    /**
     * Display the event in attendee view.
     */
    public function attendeeView(Event $event): Response
    {
        // Load the event with its agenda items and associated data
        $event->load(['agendaItems' => function ($query) {
            $query->orderBy('start_time');
        }]);

        // Transform the data into the format expected by the public view
        $eventStartDate = date('c', strtotime($event->date));
        
        // Create a sample agenda similar to what's used in the public-view component
        $agenda = [
            'id' => (string)$event->id,
            'title' => $event->title,
            'date' => date('c', strtotime($event->date)), // ISO8601 format for frontend compatibility
            'activities' => $event->agendaItems->map(function ($item) {
                // Generate slides for this activity
                $slides = $this->generateExampleSlides($item);
                $speakers = $this->getExampleSpeakers($item);
                
                return [
                    'id' => (string)$item->id,
                    'title' => $item->title,
                    'description' => $item->description ?? 'No description available',
                    'startTime' => date('c', strtotime($item->start_time)),
                    'endTime' => date('c', strtotime($item->end_time)),
                    'startDate' => $item->start_date ? date('Y-m-d', strtotime($item->start_date)) : null,
                    'endDate' => $item->end_date ? date('Y-m-d', strtotime($item->end_date)) : null,
                    'type' => $item->type ?? 'session',
                    'location' => $item->location ?? 'Main Hall',
                    'slides' => $slides,
                    'speakers' => $speakers,
                ];
            })->toArray(),
        ];

        // Pass data to the frontend
        return Inertia::render('events/public-view', [
            'event' => [
                'id' => $event->id,
                'title' => $event->title,
                'description' => $event->description,
                'start_date' => date('c', strtotime($event->date)),
                'end_date' => date('c', strtotime($event->end_date)),
                'location' => $event->location ?? 'TBD',
                'agenda' => $agenda
            ],
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event): RedirectResponse
    {
        $event->delete();

        return redirect()->route('events.index')
            ->with('message', 'Event deleted successfully.');
    }
}
