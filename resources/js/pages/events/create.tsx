import { useState } from 'react';
import { Head } from '@inertiajs/react';
import { router } from '@inertiajs/react';
import { EventForm } from '@/components/events/event-form';
import { type CreateEventData } from '@/types/event';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Events',
        href: '/events',
    },
    {
        title: 'Create',
        href: '/events/create',
    },
];

export default function Create() {
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const handleSubmit = (data: CreateEventData | Partial<CreateEventData>) => {
        setIsSubmitting(true);
        
        router.post('/events', {
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
            <Head title="Create Event" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <h1 className="text-2xl font-semibold mb-6">Create Event</h1>
                <EventForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
            </div>
        </AppLayout>
    );
} 