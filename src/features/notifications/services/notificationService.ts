import { supabase } from '../../../lib/supabase'
import type { NotificationType } from '../../../types/Notification'

interface CreateNotificationParams {
    recipientId: string
    type: NotificationType
    postId?: string | null
    commentId?: string | null
};

export async function createNotification({ recipientId, type, postId = null, commentId = null }: CreateNotificationParams) {
    let objNotification = {
        recipient_id: recipientId,
        actor_id: (await supabase.auth.getUser()).data.user?.id,
        type,
        post_id: postId,
        comment_id: commentId
    };

    const { error } = await supabase.from('notifications').insert(objNotification);

    if (error) {
        console.log(error);
        throw error;
    };
};