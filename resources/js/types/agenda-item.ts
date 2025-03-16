export interface AgendaItem {
    id: number;
    title: string;
    description: string;
    start_time: string;
    end_time: string;
    event_id: number;
    order: number;
    location?: string;
    speaker?: string;
    created_at: string;
    updated_at: string;
}

export type CreateAgendaItemData = Omit<AgendaItem, 'id' | 'created_at' | 'updated_at'>;
export type UpdateAgendaItemData = Partial<CreateAgendaItemData>; 