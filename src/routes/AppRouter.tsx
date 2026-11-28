
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'

import RegisterPage from '../features/auth/pages/RegisterPage'
import LoginPage from '../features/auth/pages/LoginPage'
import MainLayout from '../components/layout/MainLayout'
import FeedPage from '../features/posts/pages/FeedPage';

function PagePlaceholder({ title }: { title: string }) {
    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        </div>
    );
};

function AppRouter() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Rutas públicas */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Rutas internas */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<Navigate to="/feed" replace />} />

                    <Route path="/feed" element={<FeedPage />} />

                    <Route path="/events" element={<PagePlaceholder title="Eventos y hackathons" />}/>

                    <Route path="/discover" element={<PagePlaceholder title="Descubrir personas" />}/>

                    <Route path="/notifications" element={<PagePlaceholder title="Notificaciones" />}/>

                    <Route path="/profile/:id" element={<PagePlaceholder title="Perfil de usuario" />} />
                </Route>

                {/* Ruta no encontrada */}
                <Route path="*" element={<PagePlaceholder title="Página no encontrada" />}/>
            </Routes>
        </BrowserRouter>
    );
};

export default AppRouter;