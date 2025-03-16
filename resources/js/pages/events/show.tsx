import { useState, useEffect } from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Event } from '@/types/event';
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

export default function Show() {
    const [event, setEvent] = useState<Event | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [breadcrumbs, setBreadcrumbs] = useState<BreadcrumbItem[]>([
        {
            title: 'Events',
            href: '/events',
        },
        {
            title: 'Details',
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
                    title: mockEvent.title,
                    href: `/events/${mockEvent.id}`,
                },
            ]);
        }, 500);
    }, []);

    const handleEdit = () => {
        router.visit(`/events/${event?.id}/edit`);
    };

    const handleDelete = () => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        // Simulate API call
        console.log('Deleting event:', event?.id);
        
        setTimeout(() => {
            alert('Event deleted successfully!');
            router.visit('/events');
        }, 500);
    };

    if (isLoading) {
        return (
            <AppLayout breadcrumbs={breadcrumbs}>
                <Head title="Event Details" />
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
            <Head title={event.title} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">{event.title}</h1>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={handleEdit}>
                            Edit
                        </Button>
                        <Button variant="destructive" onClick={handleDelete}>
                            Delete
                        </Button>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Event Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <h3 className="font-medium text-sm">Date & Time</h3>
                            <p>{new Date(event.date).toLocaleString()}</p>
                        </div>
                        <div>
                            <h3 className="font-medium text-sm">Location</h3>
                            <p>{event.location}</p>
                        </div>
                        <div>
                            <h3 className="font-medium text-sm">Description</h3>
                            <p className="whitespace-pre-line">{event.description}</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
} 