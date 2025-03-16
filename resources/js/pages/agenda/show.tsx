import { Head, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { type AgendaItem } from '@/types/agenda-item';
import { type Event } from '@/types/event';

interface Props {
    event: Event;
    agendaItem: AgendaItem;
}

export default function Show({ event, agendaItem }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Agenda',
            href: `/events/${event.id}/agenda`,
        },
        {
            title: agendaItem.title,
            href: `/events/${event.id}/agenda/${agendaItem.id}`,
        },
    ];

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Head title={agendaItem.title} />
                <div className="mx-auto w-full max-w-3xl">
                    <Card>
                        <CardHeader>
                            <CardTitle>{agendaItem.title}</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h3>
                                <p className="mt-1">{agendaItem.description || 'No description provided.'}</p>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Start Time</h3>
                                    <p className="mt-1">{formatDateTime(agendaItem.start_time)}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">End Time</h3>
                                    <p className="mt-1">{formatDateTime(agendaItem.end_time)}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</h3>
                                    <p className="mt-1">{agendaItem.location || 'No location specified.'}</p>
                                </div>
                                <div>
                                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Speaker</h3>
                                    <p className="mt-1">{agendaItem.speaker || 'No speaker specified.'}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Display Order</h3>
                                <p className="mt-1">{agendaItem.order}</p>
                            </div>
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button variant="outline" onClick={() => router.visit(`/events/${event.id}/agenda`)}>
                                Back to Agenda
                            </Button>
                            <Button onClick={() => router.visit(`/events/${event.id}/agenda/${agendaItem.id}/edit`)}>
                                Edit
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
} 