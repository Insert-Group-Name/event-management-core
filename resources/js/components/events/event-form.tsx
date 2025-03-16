import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type Event, type CreateEventData, type UpdateEventData } from '@/types/event';

interface EventFormProps {
    event?: Event;
    onSubmit: (data: CreateEventData | UpdateEventData) => void;
    isSubmitting?: boolean;
}

export function EventForm({ event, onSubmit, isSubmitting }: EventFormProps) {
    const [formData, setFormData] = useState<CreateEventData>({
        name: event?.name || '',
        description: event?.description || '',
        start_date: event?.start_date || '',
        end_date: event?.end_date || '',
        location: event?.location || '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>{event ? 'Edit Event' : 'Create Event'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Event Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter event name"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            placeholder="Enter event description"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="start_date">Start Date</Label>
                        <Input
                            id="start_date"
                            name="start_date"
                            type="datetime-local"
                            value={formData.start_date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="end_date">End Date</Label>
                        <Input
                            id="end_date"
                            name="end_date"
                            type="datetime-local"
                            value={formData.end_date}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <Input
                            id="location"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            placeholder="Enter event location"
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : event ? 'Update Event' : 'Create Event'}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
} 