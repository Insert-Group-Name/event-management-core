export interface Event {
    id: number;
    name: string;
    description: string;
    start_date: string;
    end_date: string;
    location?: string;
    user_id?: number;
    created_at: string;
    updated_at: string;
}

export type CreateEventData = Omit<Event, 'id' | 'created_at' | 'updated_at' | 'user_id'>;
export type UpdateEventData = Partial<CreateEventData>; 