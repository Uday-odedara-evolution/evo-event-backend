export interface EventType {
  name: string;
  id: number;
  event_date: Date;
  event_category_id: number;
  creator_id: number;
  image_url: string;
}

export interface CreateEventBodyType {
  name: string;
  date: string;
  categoryId: number;
  creatorId: number;
}

export interface UpdateEventBodyType {
  name?: string;
  date?: string;
  categoryId?: number;
  id: number;
}
