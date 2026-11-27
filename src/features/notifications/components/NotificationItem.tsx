
import type { Notification } from '../../../types/Notification'
import type { User } from '../../../types/UserModel'

interface NotificationItemProps {
    notification: Notification
    actor: User | null
    onMarkAsRead: (id: string) => void
    onDelete: (id: string) => void
}

function NotificationItem({
    notification,
    actor,
    onMarkAsRead,
    onDelete
}: NotificationItemProps) {

    const getMessage = () => {
        switch (notification.type) {
            case 'LIKE':
                return 'le gustó tu publicación'

            case 'COMMENT':
                return 'comentó tu publicación'

            case 'REPLY':
                return 'respondió a un comentario'

            case 'FOLLOW':
                return 'comenzó a seguirte'

            default:
                return 'interactuó contigo'
        }
    }

    const getInitials = () => {
        if (!actor) return '?'

        return `${actor.first_name.charAt(0)}${actor.last_name.charAt(0)}`
    }

    const formattedDate = new Intl.DateTimeFormat('es-PE', {
        dateStyle: 'medium',
        timeStyle: 'short'
    }).format(new Date(notification.created_at))

    return (
        <article className={`flex items-center gap-4 p-4 rounded-xl border transition ${
            notification.is_read
                ? 'bg-white border-slate-200'
                : 'bg-blue-50 border-blue-200'
        }`}>

            {/* Foto del usuario */}
            {actor?.avatar_url ? (
                <img
                    src={actor.avatar_url}
                    alt="Foto de perfil"
                    className="w-12 h-12 rounded-full object-cover"
                />
            ) : (
                <div className="w-12 h-12 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                    {getInitials()}
                </div>
            )}

            {/* Información */}
            <div className="flex-1 min-w-0">
                <p className="text-sm text-slate-800">
                    <strong>
                        {actor
                            ? `${actor.first_name} ${actor.last_name}`
                            : 'Usuario'}
                    </strong>{' '}
                    {getMessage()}
                </p>

                <p className="text-xs text-slate-500 mt-1">
                    {formattedDate}
                </p>

                {!notification.is_read && (
                    <span className="inline-block mt-2 text-xs font-semibold text-blue-600">
                        Nueva
                    </span>
                )}
            </div>

            {/* Acciones */}
            <div className="flex items-center gap-2">
                {!notification.is_read && (
                    <button
                        onClick={() => onMarkAsRead(notification.id)}
                        title="Marcar como leída"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                        Leer
                    </button>
                )}

                <button
                    onClick={() => onDelete(notification.id)}
                    title="Eliminar notificación"
                    className="text-red-500 hover:text-red-700 text-sm"
                >
                    Eliminar
                </button>
            </div>

        </article>
    )
}

export default NotificationItem

