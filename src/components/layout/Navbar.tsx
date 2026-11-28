
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Code2, Search, CircleHelp, Bell, ChevronDown } from 'lucide-react'

import { supabase } from '../../lib/supabase'

interface UserProfile {
    first_name: string
    last_name: string
    academic_cycle: string | null
    avatar_url: string | null
};

function Navbar() {
    const [profile, setProfile] = useState<UserProfile | null>(null);

    useEffect(() => {
        async function loadProfile() {
            const { data: { user }, error: authError } = await supabase.auth.getUser();

            if (authError || !user) return;

            const { data, error } = await supabase.from('users').select('first_name, last_name, academic_cycle, avatar_url').eq('id', user.id).maybeSingle();

            if (error) {
                console.error('Error al obtener el perfil:', error);
                return;
            };
            setProfile(data)
        };

        loadProfile();
    }, []);

    const fullName = profile ? `${profile.first_name} ${profile.last_name}` : 'Usuario';
    const initials = profile ? `${profile.first_name.charAt(0)}${profile.last_name.charAt(0)}`.toUpperCase() : 'U';

    return (
        <header className="h-[68px] w-full bg-white border-b border-slate-200 flex items-center px-6 gap-6">

            {/* Logo */}
            <Link to="/feed" className="flex items-center gap-2 shrink-0">
                <div className="w-9 h-9 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                    <Code2 size={22} />
                </div>

                <div className="leading-tight">
                    <h1 className="text-base font-bold text-[#102F60] tracking-wide">CERTUS</h1>
                    <span className="text-[10px] text-slate-500 tracking-wide">Tech-Connect</span>
                </div>
            </Link>

            {/* Buscador */}
            <div className="flex-1 max-w-[340px] relative ml-8">
                <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />

                <input
                    type="text"
                    placeholder="Buscar por usuario o publicación"
                    className="w-full h-9 rounded-lg bg-slate-100 pl-10 pr-3 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition"
                />
            </div>

            {/* Acciones y usuario */}
            <div className="ml-auto flex items-center gap-5">
                <button type="button" aria-label="Ayuda" className="text-slate-500 hover:text-blue-600 transition" >
                    <CircleHelp size={19} />
                </button>

                <Link to="/notifications" aria-label="Notificaciones" className="relative text-slate-500 hover:text-blue-600 transition" >
                    <Bell size={19} />
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-blue-600 border border-white" />
                </Link>

                <div className="h-7 border-l border-slate-200" />

                {/* Usuario */}
                <button type="button" className="flex items-center gap-3">
                    {profile?.avatar_url ? ( <img src={profile.avatar_url} alt="Foto de perfil" className="w-9 h-9 rounded-full object-cover" />) : (
                        <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-semibold">
                            {initials}
                        </div>
                    )}

                    <div className="hidden sm:block text-left leading-tight">
                        <p className="text-xs font-semibold text-slate-800"> {fullName}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5"> {profile?.academic_cycle || 'Estudiante de TI'}</p>
                    </div>

                    <ChevronDown size={16} className="text-slate-500" />
                </button>
            </div>
        </header>
    );
};

export default Navbar;