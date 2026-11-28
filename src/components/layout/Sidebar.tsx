
import { NavLink } from 'react-router-dom'
import { Home, Trophy, Users, BookOpen, Hash, ArrowRight } from 'lucide-react'

const navigationItems = [
    {
        label: 'Inicio',
        path: '/feed',
        icon: Home
    },
    {
        label: 'Concursos',
        path: '/events',
        icon: Trophy,
        badge: '6'
    },
    {
        label: 'Descubrir personas',
        path: '/discover',
        icon: Users
    },
    {
        label: 'Mi perfil',
        path: '/profile/me',
        icon: BookOpen
    }
];

const communities = [ 'Desarrollo de software', 'Ciberseguridad', 'Datos e IA' ];

function Sidebar() {
    return (
        <aside className="hidden lg:flex flex-col w-[190px] shrink-0 min-h-[calc(100vh-68px)] px-3 py-6 bg-slate-100">
            {/* Navegación principal */}
            <nav className="flex flex-col gap-1">
                {navigationItems.map((item) => {
                    const Icon = item.icon

                    return (
                        <NavLink key={item.path} to={item.path} className={({ isActive }) =>
                            `flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-colors 
                            ${ isActive ? 'bg-[#102F60] text-white' : 'text-slate-700 hover:bg-slate-200' }`
                        }>
                        
                            <Icon size={16} />
                            <span className="flex-1"> {item.label} </span>

                            {item.badge && ( <span className="text-[10px]"> {item.badge} </span>)}
                        </NavLink>
                    );
                })}
            </nav>

            {/* Comunidades */}
            <div className="mt-6 pt-5 border-t border-slate-200">
                <h3 className="text-[9px] font-bold tracking-[0.15em] text-slate-500 mb-3 px-2">TUS COMUNIDADES</h3>

                <div className="flex flex-col gap-3">
                    {communities.map((community) => (
                        <button key={community} type="button"
                            className="flex items-center gap-2 px-2 text-left text-[10px] text-slate-700 hover:text-blue-600 transition"
                        >
                            <Hash size={13} className="text-blue-500 shrink-0" />
                            <span>{community}</span>
                        </button>
                    ))}

                </div>

                <button type="button" className="flex items-center gap-1 px-2 mt-4 text-[10px] font-semibold text-blue-600 hover:text-blue-700">
                    Explorar comunidades
                    <ArrowRight size={12} />
                </button>
            </div>

            {/* Tarjeta de concursos */}
            <div className="mt-6 rounded-xl bg-[#102F60] p-3 text-white">
                <Trophy size={19} className="text-blue-400 mb-2" />

                <h3 className="text-xs font-semibold leading-relaxed">Tu próximo reto empieza aquí.</h3>
                <p className="text-[10px] text-blue-100 leading-relaxed mt-2">Forma un equipo y pon en práctica lo que aprendes.</p>

                <NavLink to="/events" className="inline-flex items-center gap-1 mt-3 text-[10px] text-blue-300 hover:text-white transition">
                    Explorar concursos
                    <ArrowRight size={11} />
                </NavLink>
            </div>

            {/* Enlaces inferiores */}
            <div className="mt-auto pt-6 px-2 flex flex-col gap-2 text-[9px] text-slate-500">
                <button type="button" className="text-left hover:text-blue-600"> Ayuda · Normas de la comunidad</button>
                <button type="button" className="text-left hover:text-blue-600"> Privacidad · Términos de uso</button>
                <p className="mt-1">CERTUS Tech-Connect © 2026</p>
            </div>
        </aside>
    );
};

export default Sidebar;