import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Events',
        href: '/events',
    },
];

// Mock data for UI development
const mockEvents = [
    {
        id: 1,
        title: 'Tech Conference 2024',
        description: 'Annual technology conference with industry leaders',
        date: '2024-06-15T09:00:00',
        location: 'Convention Center, San Francisco',
        created_at: '2024-01-15T00:00:00',
        updated_at: '2024-01-15T00:00:00',
    },
    {
        id: 2,
        title: 'Product Launch Event',
        description: 'Launching our new product with demos and presentations',
        date: '2024-07-20T18:30:00',
        location: 'Main Auditorium, New York',
        created_at: '2024-02-10T00:00:00',
        updated_at: '2024-02-10T00:00:00',
    },
    {
        id: 3,
        title: 'Hackathon 2024',
        description: '48-hour coding challenge for developers',
        date: '2024-08-05T10:00:00',
        location: 'Tech Hub, Austin',
        created_at: '2024-03-05T00:00:00',
        updated_at: '2024-03-05T00:00:00',
    },
];

export default function Index() {
    const [events, setEvents] = useState(mockEvents);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = (id: number) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        setIsDeleting(true);
        // Simulate API call
        setTimeout(() => {
            setEvents(events.filter(event => event.id !== id));
            setIsDeleting(false);
        }, 500);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Events" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold">Events</h1>
                    <Button onClick={() => router.visit('/events/create')}>
                        Create Event
                    </Button>
                </div>

                <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-xl shadow-sm">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {events.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell>
                                        <Button 
                                            variant="link" 
                                            className="p-0 h-auto text-left font-medium"
                                            onClick={() => router.visit(`/events/${event.id}`)}
                                        >
                                            {event.title}
                                        </Button>
                                    </TableCell>
                                    <TableCell>{new Date(event.date).toLocaleDateString()}</TableCell>
                                    <TableCell>{event.location}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => router.visit(`/events/${event.id}/edit`)}
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                disabled={isDeleting}
                                                onClick={() => handleDelete(event.id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {events.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        No events found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AppLayout>
    );
}
