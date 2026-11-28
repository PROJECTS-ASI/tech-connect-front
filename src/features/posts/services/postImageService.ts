
import { supabase } from '../../../lib/supabase'

const BUCKET_NAME = import.meta.env.VITE_BUCKET_NAME_IMAGES;
const MAX_FILE_SIZE = 5 * 1024 * 1024

const ALLOWED_TYPES = [ 'image/jpeg', 'image/png', 'image/webp' ];

export async function uploadPostImage(file: File): Promise<string> {
    if (!ALLOWED_TYPES.includes(file.type)) {
        throw new Error('Solo se permiten imágenes JPG, PNG o WEBP.');
    };
    if (file.size > MAX_FILE_SIZE) {
        throw new Error('La imagen no debe superar los 5 MB.');
    };

    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
        throw new Error('Debes iniciar sesión para subir imágenes.');
    };

    const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${crypto.randomUUID()}.${fileExtension}`;
    const filePath = `posts/${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(filePath, file, { contentType: file.type, upsert: false });
    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);

    return data.publicUrl
};