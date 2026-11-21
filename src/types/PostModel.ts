export interface Post {
    id: string
    user_id: string
    content: string
    image_url: string | null
    type: 'POST' | 'EVENT' | 'HACKATHON'
    event_date: string | null
    created_at: string
    updated_at: string
};