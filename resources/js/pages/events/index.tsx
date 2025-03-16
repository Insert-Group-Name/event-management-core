import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';


interface Event {
    id: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    created_at: string;
    updated_at: string;
}

interface PaginatedData<T> {
    data: T[];
    current_page: number;
    from: number;
    last_page: number;
    per_page: number;
    to: number;
    total: number;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
}

interface Props {
    events: PaginatedData<Event>;
}

export default function Index({ events }: Props) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = (id: number) => {
        if (!confirm('Are you sure you want to delete this event?')) return;

        setIsDeleting(true);
        router.delete(`/events/${id}`, {
            onFinish: () => setIsDeleting(false),
        });
    };

    const handlePageChange = (page: number) => {
        router.get(
            '/events',
            { page },
            {
                preserveState: true,
                preserveScroll: true,
            },
        );
    };

    return (
        <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
            <Head title="Events" />
            <div className="mx-auto flex h-full w-full max-w-7xl flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-semibold">Events</h1>
                    <Button onClick={() => router.visit('/events/create')}>Create Event</Button>
                </div>

                <div className="overflow-hidden rounded-xl bg-white shadow-sm dark:bg-gray-800">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Start Date</TableHead>
                                <TableHead>End Date</TableHead>
                                <TableHead className="w-[100px]">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {events.data.map((event) => (
                                <TableRow key={event.id}>
                                    <TableCell>
                                        <Button
                                            variant="link"
                                            className="h-auto p-0 text-left font-medium"
                                            onClick={() => router.visit(`/events/${event.id}`)}
                                        >
                                            {event.name}
                                        </Button>
                                    </TableCell>
                                    <TableCell>{new Date(event.start_date).toLocaleDateString()}</TableCell>
                                    <TableCell>{new Date(event.end_date).toLocaleDateString()}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="destructive" size="sm" disabled={isDeleting} onClick={() => handleDelete(event.id)}>
                                                Delete
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => router.visit(`/events/${event.id}/edit`)}>
                                                Edit
                                            </Button>
                                            <Button variant="outline" size="sm" onClick={() => router.visit(`/events/${event.id}/dashboard`)}>
                                                View
                                            </Button>
                                            <Button variant="default" size="sm" onClick={() => router.visit(`/events/${event.id}/view`)}>
                                                View Out
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {events.data.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center">
                                        No events found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>

                {events.last_page > 1 && (
                    <div className="mt-4 flex justify-center gap-2">
                        {events.links
                            .filter((link) => link.url !== null)
                            .map((link, i) => (
                                <Button
                                    key={i}
                                    variant={link.active ? 'default' : 'outline'}
                                    size="sm"
                                    onClick={() =>
                                        handlePageChange(
                                            link.label === '&laquo; Previous'
                                                ? events.current_page - 1
                                                : link.label === 'Next &raquo;'
                                                  ? events.current_page + 1
                                                  : parseInt(link.label),
                                        )
                                    }
                                    disabled={link.url === null}
                                >
                                    <span dangerouslySetInnerHTML={{ __html: link.label }}></span>
                                </Button>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
}
