
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import RegisterPage from '../features/auth/pages/RegisterPage'
import LoginPage from '../features/auth/pages/LoginPage'
import NotificationsPage from '../features/notifications/pages/NotificationsPage'

function PagePlaceholder({ title }: { title: string }) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950">
            <h1 className="text-3xl font-bold text-white">{title}</h1>
        </div>
    )
}

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Navigate to="/login" replace />} />

                <Route path="/login" element={<LoginPage />} />

                <Route path="/register" element={<RegisterPage />} />

                <Route path="/feed" element={<PagePlaceholder title="Publicaciones" />} />

                <Route path="/events" element={<PagePlaceholder title="Eventos y hackathons" />} />

                <Route path="/notifications" element={<NotificationsPage />} />

                <Route path="/profile/:id" element={<PagePlaceholder title="Perfil de usuario" />} />

                <Route path="*" element={<PagePlaceholder title="Página no encontrada" />} />
            </Routes>
        </BrowserRouter>
    )
}

export default AppRouter
