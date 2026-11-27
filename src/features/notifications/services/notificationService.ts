
import { supabase } from '../../../lib/supabase'
import type { Notification, NotificationType } from '../../../types/Notification'

interface CreateNotificationParams {
    recipientId: string
    type: NotificationType
    postId?: string | null
    commentId?: string | null
}

// Obtener el usuario autenticado
async function getCurrentUserId(): Promise<string> {
    const { data, error } = await supabase.auth.getUser()

    if (error) throw error

    if (!data.user) {
        throw new Error('No hay un usuario autenticado')
    }

    return data.user.id
}

// CREAR NOTIFICACIÓN (función compartida)
export async function createNotification({
    recipientId,
    type,
    postId = null,
    commentId = null
}: CreateNotificationParams) {

    const actorId = await getCurrentUserId()

    if (actorId === recipientId) return

    const { error } = await supabase
        .from('notifications')
        .insert({
            recipient_id: recipientId,
            actor_id: actorId,
            type,
            post_id: postId,
            comment_id: commentId
        })

    if (error) throw error
}

// 1. CONSULTAR NOTIFICACIONES
export async function getNotifications(): Promise<Notification[]> {
    const userId = await getCurrentUserId()

    const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('recipient_id', userId)
        .order('created_at', { ascending: false })

    if (error) throw error

    return (data ?? []) as Notification[]
}

// 2. MARCAR UNA NOTIFICACIÓN COMO LEÍDA
export async function markAsRead(notificationId: string) {
    const userId = await getCurrentUserId()

    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('id', notificationId)
        .eq('recipient_id', userId)

    if (error) throw error
}

// 3. MARCAR TODAS COMO LEÍDAS
export async function markAllAsRead() {
    const userId = await getCurrentUserId()

    const { error } = await supabase
        .from('notifications')
        .update({ is_read: true })
        .eq('recipient_id', userId)
        .eq('is_read', false)

    if (error) throw error
}

// 4. ELIMINAR UNA NOTIFICACIÓN
export async function deleteNotification(notificationId: string) {
    const userId = await getCurrentUserId()

    const { error } = await supabase
        .from('notifications')
        .delete()
        .eq('id', notificationId)
        .eq('recipient_id', userId)

    if (error) throw error
}
