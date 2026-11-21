export type NotificationType = | 'LIKE' | 'COMMENT' | 'REPLY' | 'FOLLOW';

export interface Notification {
    id: string
    recipient_id: string
    actor_id: string
    type: NotificationType
    post_id: string | null
    comment_id: string | null
    is_read: boolean
    created_at: string
};