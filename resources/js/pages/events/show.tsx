import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { type Event } from '@/types/event';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Play } from "lucide-react";

interface Props {
    event: Event;
}

export default function Show({ event }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Events',
            href: '/events',
        },
        {
            title: event.name,
            href: `/events/${event.id}`,
        },
    ];

    const handleEdit = () => {
        router.visit(`/events/${event.id}/edit`);
    };

    const handleDelete = () => {
        if (!confirm('Are you sure you want to delete this event?')) return;
        
        router.delete(`/events/${event.id}`, {
            onSuccess: () => {
                router.visit('/events');
            }
        });
    };

    const handleStoryView = () => {
        router.visit(`/events/${event.id}/story`);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={event.name} />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">{event.name}</h1>
                    <div className="flex gap-2">
                        <Button onClick={handleStoryView} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
                            <Play className="mr-2 h-4 w-4" /> 
                            Story View
                        </Button>
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
                            <h3 className="font-medium text-sm">Start Date & Time</h3>
                            <p>{new Date(event.start_date).toLocaleString()}</p>
                        </div>
                        <div>
                            <h3 className="font-medium text-sm">End Date & Time</h3>
                            <p>{new Date(event.end_date).toLocaleString()}</p>
                        </div>
                        {event.location && (
                            <div>
                                <h3 className="font-medium text-sm">Location</h3>
                                <p>{event.location}</p>
                            </div>
                        )}
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