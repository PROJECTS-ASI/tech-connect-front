
import useNotifications from '../hooks/useNotifications'
import NotificationItem from '../components/NotificationItem'

function NotificationsPage() {
    const {
        notifications,
        actors,
        loading,
        error,
        unreadCount,
        handleMarkAsRead,
        handleMarkAllAsRead,
        handleDelete
    } = useNotifications()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-slate-500">Cargando notificaciones...</p>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-slate-100 p-6">
            <div className="max-w-3xl mx-auto">

                <header className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900">
                            Notificaciones
                        </h1>
                        <p className="text-sm text-slate-500 mt-1">
                            Tienes {unreadCount} notificaciones sin leer
                        </p>
                    </div>

                    {unreadCount > 0 && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="text-sm font-semibold text-blue-600 hover:text-blue-800"
                        >
                            Marcar todas como leídas
                        </button>
                    )}
                </header>

                {error && (
                    <p className="mb-4 text-sm text-red-600">
                        {error}
                    </p>
                )}

                {notifications.length === 0 ? (
                    <div className="bg-white rounded-xl p-10 text-center border border-slate-200">
                        <h2 className="text-lg font-semibold text-slate-700">
                            No tienes notificaciones
                        </h2>
                        <p className="text-sm text-slate-500 mt-2">
                            Aquí aparecerán las novedades de tu cuenta.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map(notification => (
                            <NotificationItem
                                key={notification.id}
                                notification={notification}
                                actor={actors[notification.actor_id] ?? null}
                                onMarkAsRead={handleMarkAsRead}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}

            </div>
        </main>
    )
}

export default NotificationsPage
