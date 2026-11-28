
import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabase'
import type { Notification } from '../../../types/Notification'
import type { User } from '../../../types/UserModel'

import {
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification
} from '../services/notificationService'

function useNotifications() {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [actors, setActors] = useState<Record<string, User>>({})
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Cargar notificaciones y usuarios que las generaron
    const loadNotifications = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)

            const data = await getNotifications()
            setNotifications(data)

            const actorIds = [...new Set(data.map(item => item.actor_id))]

            if (actorIds.length === 0) {
                setActors({})
                return
            }

            const { data: users, error: usersError } = await supabase
                .from('users')
                .select('*')
                .in('id', actorIds)

            if (usersError) throw usersError

            const actorsMap: Record<string, User> = {}

            ;(users ?? []).forEach(user => {
                actorsMap[user.id] = user as User
            })

            setActors(actorsMap)

        } catch (err) {
            console.error('Error al cargar notificaciones:', err)
            setError('No se pudieron cargar las notificaciones')
        } finally {
            setLoading(false)
        }
    }, [])

    // Marcar una notificación como leída
    const handleMarkAsRead = async (id: string) => {
        try {
            await markAsRead(id)

            setNotifications(prev =>
                prev.map(item =>
                    item.id === id
                        ? { ...item, is_read: true }
                        : item
                )
            )
        } catch (err) {
            console.error('Error al marcar como leída:', err)
            setError('No se pudo actualizar la notificación')
        }
    }

    // Marcar todas como leídas
    const handleMarkAllAsRead = async () => {
        try {
            await markAllAsRead()

            setNotifications(prev =>
                prev.map(item => ({ ...item, is_read: true }))
            )
        } catch (err) {
            console.error('Error al marcar todas como leídas:', err)
            setError('No se pudieron actualizar las notificaciones')
        }
    }

    // Eliminar una notificación
    const handleDelete = async (id: string) => {
        try {
            await deleteNotification(id)

            setNotifications(prev =>
                prev.filter(item => item.id !== id)
            )
        } catch (err) {
            console.error('Error al eliminar notificación:', err)
            setError('No se pudo eliminar la notificación')
        }
    }

    useEffect(() => {
        loadNotifications()
    }, [loadNotifications])

    const unreadCount = notifications.filter(
        item => !item.is_read
    ).length

    return {
        notifications,
        actors,
        loading,
        error,
        unreadCount,
        loadNotifications,
        handleMarkAsRead,
        handleMarkAllAsRead,
        handleDelete
    }
}

export default useNotifications
