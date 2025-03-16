import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
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
import { type Event } from '@/types/event';

interface Attendee {
    id: number;
    name: string;
    email: string;
    created_at: string;
}

interface Props {
    event: Event;
    attendees: Attendee[];
}

export default function Index({ event, attendees }: Props) {
    const [isDeleting, setIsDeleting] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Attendees',
            href: `/events/${event.id}/attendees`,
        },
    ];

    const handleDelete = (id: number) => {
        if (!confirm('Are you sure you want to delete this attendee?')) return;

        setIsDeleting(true);
        router.delete(`/events/${event.id}/attendees/${id}`, {
            onFinish: () => setIsDeleting(false),
        });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Head title={`Attendees - ${event.name}`} />
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold">Attendees for {event.name}</h1>
                        <Button onClick={() => router.visit(`/events/${event.id}/attendees/create`)}>
                            Add Attendee
                        </Button>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-xl shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Checked In</TableHead>
                                    <TableHead className="w-[150px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {attendees.map((attendee) => (
                                    <TableRow key={attendee.id}>
                                        <TableCell>
                                            <Button 
                                                variant="link" 
                                                className="p-0 h-auto text-left font-medium"
                                                onClick={() => router.visit(`/events/${event.id}/attendees/${attendee.id}`)}
                                            >
                                                {attendee.name}
                                            </Button>
                                        </TableCell>
                                        <TableCell>{attendee.email}</TableCell>
                                        <TableCell>{formatDate(attendee.created_at)}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => router.visit(`/events/${event.id}/attendees/${attendee.id}`)}
                                                >
                                                    View
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {attendees.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={4} className="text-center">
                                            No attendees found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
} 