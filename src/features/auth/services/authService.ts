
import { supabase } from '../../../lib/supabase'

// Registrar un usuario
export async function registerUser(firstName: string, lastName: string, email: string, password: string) {
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                first_name: firstName,
                last_name: lastName,
            },
            emailRedirectTo: `${window.location.origin}/login`,
        },
    })

    if (error) throw error;

    return data;
};

// Iniciar sesión
export async function loginUser(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) throw error;

    return data;
};

// Cerrar sesión
export async function logoutUser() {
    const { error } = await supabase.auth.signOut();

    if (error) throw error;
};