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
import { type AgendaItem } from '@/types/agenda-item';
import { type Event } from '@/types/event';

interface Props {
    event: Event;
    agendaItems: AgendaItem[];
}

export default function Index({ event, agendaItems }: Props) {
    const [isDeleting, setIsDeleting] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Agenda',
            href: `/events/${event.id}/agenda`,
        },
    ];

    const handleDelete = (id: number) => {
        if (!confirm('Are you sure you want to delete this agenda item?')) return;

        setIsDeleting(true);
        router.delete(`/events/${event.id}/agenda/${id}`, {
            onFinish: () => setIsDeleting(false),
        });
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Head title={`Agenda - ${event.name}`} />
                <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-semibold">Agenda for {event.name}</h1>
                        <Button onClick={() => router.visit(`/events/${event.id}/agenda/create`)}>
                            Add Agenda Item
                        </Button>
                    </div>

                    <div className="bg-white dark:bg-gray-800 overflow-hidden rounded-xl shadow-sm">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Title</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Speaker</TableHead>
                                    <TableHead className="w-[150px]">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {agendaItems.map((item) => (
                                    <TableRow key={item.id}>
                                        <TableCell>
                                            <Button 
                                                variant="link" 
                                                className="p-0 h-auto text-left font-medium"
                                                onClick={() => router.visit(`/events/${event.id}/agenda/${item.id}`)}
                                            >
                                                {item.title}
                                            </Button>
                                        </TableCell>
                                        <TableCell>{formatDate(item.start_time)}</TableCell>
                                        <TableCell>{formatTime(item.start_time)} - {formatTime(item.end_time)}</TableCell>
                                        <TableCell>{item.location || '-'}</TableCell>
                                        <TableCell>{item.speaker || '-'}</TableCell>
                                        <TableCell>
                                            <div className="flex gap-2">
                                                <Button
                                                    variant="destructive"
                                                    size="sm"
                                                    disabled={isDeleting}
                                                    onClick={() => handleDelete(item.id)}
                                                >
                                                    Delete
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => router.visit(`/events/${event.id}/agenda/${item.id}/edit`)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => router.visit(`/events/${event.id}/agenda/${item.id}`)}
                                                >
                                                    View
                                                </Button>
                                                <Button
                                                    variant="default"
                                                    size="sm"
                                                    onClick={() => router.visit(`/events/${event.id}/agenda/${item.id}`)}
                                                >
                                                    Slides
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {agendaItems.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={6} className="text-center">
                                            No agenda items found.
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
