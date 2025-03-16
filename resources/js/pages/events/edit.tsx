import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { EventForm } from '@/components/events/event-form';
import { type Event, type UpdateEventData } from '@/types/event';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

// Mock event data for UI development
const mockEvent: Event = {
    id: 1,
    title: 'Tech Conference 2024',
    description: 'Annual technology conference with industry leaders',
    date: '2024-06-15T09:00:00',
    location: 'Convention Center, San Francisco',
    created_at: '2024-01-15T00:00:00',
    updated_at: '2024-01-15T00:00:00',
};

export default function Edit() {
    const [event, setEvent] = useState<Event | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
        {
            title: 'Events',
            href: '/events',
        },
        {
            title: 'Edit',
            href: '#',
        },
    ]);

    // Simulate fetching event data
    useEffect(() => {
        // Simulate API call to fetch event data
        setTimeout(() => {
            setEvent(mockEvent);
            setIsLoading(false);
            
            // Update breadcrumbs with event title
            setBreadcrumbs([
                {
                    title: 'Events',
                    href: '/events',
                },
                {
                    title: `Edit: ${mockEvent.title}`,
                    href: `/events/${mockEvent.id}/edit`,
                },
            ]);
        }, 500);
    }, []);

    const handleSubmit = (data: UpdateEventData) => {
        setIsSubmitting(true);
        
        // Simulate API call
        console.log('Updating event with data:', data);
        
        setTimeout(() => {
            setIsSubmitting(false);
            // For UI demo, we could redirect or show success message
            alert('Event updated successfully!');
            router.visit('/events');
        }, 1000);
    };

    if (isLoading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Edit Event" />
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                    <p>Loading event...</p>
                </div>
            </AppLayout>
        );
    }

    if (!event) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Event Not Found" />
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                    <p>Event not found.</p>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Event: ${event.title}`} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-semibold mb-6">Edit Event</h1>
                <EventForm 
                    event={event} 
                    onSubmit={handleSubmit} 
                    isSubmitting={isSubmitting} 
                />
            </div>
        </AppLayout>
    );
} 