
import { supabase } from '../../../lib/supabase'

const BUCKET_NAME = import.meta.env.VITE_BUCKET_NAME_IMAGES;

export async function createPost(content: string, imageUrl: string | null = null) {
    const trimmedContent = content.trim()
    if (!trimmedContent && !imageUrl) {
        throw new Error('La publicación no puede estar vacía.');
    };

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        throw new Error('Debes iniciar sesión para publicar.');
    };

    let objPost = {
        user_id: user.id,
        content: trimmedContent,
        image_url: imageUrl,
        type: 'POST',
    };
    const { data, error } = await supabase.from('posts').insert(objPost).select().single();
    if (error) throw error;

    return data;
};

export async function deletePost(postId: string) {
    // 1. Obtener la publicación
    const { data: post, error: fetchError } = await supabase.from('posts').select('image_url').eq('id', postId).single();
    if (fetchError) throw fetchError;

    // 2. Eliminar imagen de Storage si existe
    if (post.image_url) {
        const imageUrl = new URL(post.image_url)
        const path = decodeURIComponent(imageUrl.pathname.split(`/object/public/${BUCKET_NAME}/`)[1]);

        console.log('URL de imagen:', post.image_url)
        console.log('Bucket:', BUCKET_NAME)
        console.log('Ruta a eliminar:', path)

        const { data, error: storageError } = await supabase.storage.from(BUCKET_NAME).remove([path]);

        console.log('Resultado de eliminación:', data)
        console.log('Error de Storage:', storageError)
        
        if (storageError) throw storageError;
    };

    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (error) throw error;
};