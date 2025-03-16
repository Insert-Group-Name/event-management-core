import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { AgendaItemForm } from '@/components/agenda/agenda-item-form';
import { type CreateAgendaItemData, type UpdateAgendaItemData } from '@/types/agenda-item';
import { type Event } from '@/types/event';

interface Props {
    event: Event;
}

export default function Create({ event }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Agenda',
            href: `/events/${event.id}/agenda`,
        },
        {
            title: 'Create',
            href: `/events/${event.id}/agenda/create`,
        },
    ];

    const handleSubmit = (data: CreateAgendaItemData | UpdateAgendaItemData) => {
        setIsSubmitting(true);
        router.post(`/events/${event.id}/agenda`, data as CreateAgendaItemData, {
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Head title="Create Agenda Item" />
                <div className="mx-auto w-full max-w-3xl">
                    <AgendaItemForm 
                        eventId={event.id}
                        onSubmit={handleSubmit} 
                        isSubmitting={isSubmitting} 
                    />
                </div>
            </div>
        </AppLayout>
    );
} 