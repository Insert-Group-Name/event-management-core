import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { type AgendaItem, type CreateAgendaItemData, type UpdateAgendaItemData } from '@/types/agenda-item';

interface AgendaItemFormProps {
    agendaItem?: AgendaItem;
    eventId: number;
    onSubmit: (data: CreateAgendaItemData | UpdateAgendaItemData) => void;
    isSubmitting?: boolean;
}

export function AgendaItemForm({ agendaItem, eventId, onSubmit, isSubmitting }: AgendaItemFormProps) {
    const [formData, setFormData] = useState<CreateAgendaItemData>({
        title: agendaItem?.title || '',
        description: agendaItem?.description || '',
        start_time: agendaItem?.start_time || '',
        end_time: agendaItem?.end_time || '',
        location: agendaItem?.location || '',
        speaker: agendaItem?.speaker || '',
        order: agendaItem?.order || 0,
        event_id: eventId,
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ 
            ...prev, 
            [name]: name === 'order' ? parseInt(value) || 0 : value 
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardHeader>
                    <CardTitle>{agendaItem ? 'Edit Agenda Item' : 'Create Agenda Item'}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Enter agenda item title"
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
                            placeholder="Enter agenda item description"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="start_time">Start Time</Label>
                        <Input
                            id="start_time"
                            name="start_time"
                            type="datetime-local"
                            value={formData.start_time}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="end_time">End Time</Label>
                        <Input
                            id="end_time"
                            name="end_time"
                            type="datetime-local"
                            value={formData.end_time}
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
                            placeholder="Enter location"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="speaker">Speaker</Label>
                        <Input
                            id="speaker"
                            name="speaker"
                            value={formData.speaker}
                            onChange={handleChange}
                            placeholder="Enter speaker name"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="order">Display Order</Label>
                        <Input
                            id="order"
                            name="order"
                            type="number"
                            value={formData.order.toString()}
                            onChange={handleChange}
                            placeholder="Enter display order"
                        />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" disabled={isSubmitting}>
                        {isSubmitting ? 'Saving...' : agendaItem ? 'Update Agenda Item' : 'Create Agenda Item'}
                    </Button>
                </CardFooter>
            </Card>
        </form>
    );
} 