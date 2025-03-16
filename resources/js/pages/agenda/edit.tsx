import { useState } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { AgendaItemForm } from '@/components/agenda/agenda-item-form';
import { type AgendaItem, type CreateAgendaItemData, type UpdateAgendaItemData } from '@/types/agenda-item';
import { type Event } from '@/types/event';

interface Props {
    event: Event;
    agendaItem: AgendaItem;
}

export default function Edit({ event, agendaItem }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Agenda',
            href: `/events/${event.id}/agenda`,
        },
        {
            title: 'Edit',
            href: `/events/${event.id}/agenda/${agendaItem.id}/edit`,
        },
    ];

    const handleSubmit = (data: CreateAgendaItemData | UpdateAgendaItemData) => {
        setIsSubmitting(true);
        router.put(`/events/${event.id}/agenda/${agendaItem.id}`, data, {
            onFinish: () => setIsSubmitting(false),
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Head title="Edit Agenda Item" />
                <div className="mx-auto w-full max-w-3xl">
                    <AgendaItemForm 
                        agendaItem={agendaItem}
                        eventId={event.id}
                        onSubmit={handleSubmit} 
                        isSubmitting={isSubmitting} 
                    />
                </div>
            </div>
        </AppLayout>
    );
} 