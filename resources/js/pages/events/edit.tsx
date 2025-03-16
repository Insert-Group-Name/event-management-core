import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { EventForm } from '@/components/events/event-form';
import { type Event, type UpdateEventData } from '@/types/event';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

interface Props {
    event: Event;
}

export default function Edit({ event }: Props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Events',
            href: '/events',
        },
        {
            title: `Edit: ${event.name}`,
            href: `/events/${event.id}/edit`,
        },
    ];

    const handleSubmit = (data: UpdateEventData) => {
        setIsSubmitting(true);
        
        router.put(`/events/${event.id}`, {
            name: data.name,
            description: data.description,
            start_date: data.start_date,
            end_date: data.end_date,
            location: data.location
        }, {
            onSuccess: () => {
                setIsSubmitting(false);
            },
            onError: () => {
                setIsSubmitting(false);
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Edit Event: ${event.name}`} />
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