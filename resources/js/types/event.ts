export interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    created_at: string;
    updated_at: string;
}

export type CreateEventData = Omit<Event, 'id' | 'created_at' | 'updated_at'>;
export type UpdateEventData = Partial<CreateEventData>; 