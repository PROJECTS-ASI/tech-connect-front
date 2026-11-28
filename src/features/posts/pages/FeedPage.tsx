
import { useEffect, useState } from 'react'
import { ImagePlus, Send, MessageCircle, Heart, X, Trash2 } from 'lucide-react'
import { supabase } from '../../../lib/supabase'
import { createPost, deletePost } from '../services/postService'
import { uploadPostImage } from '../services/postImageService'

interface FeedPost {
    id: string
    user_id: string
    content: string
    image_url: string | null
    type: 'POST' | 'EVENT' | 'HACKATHON'
    created_at: string
    users: {
        first_name: string
        last_name: string
        avatar_url: string | null
    }
};

function FeedPage() {
    const [firstName, setFirstName] = useState('Usuario');
    const [posts, setPosts] = useState<FeedPost[]>([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    const [content, setContent] = useState('');
    const [publishing, setPublishing] = useState(false);
    const [publishMessage, setPublishMessage] = useState('');
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    useEffect(() => {
        async function loadFeed() {
            try {
                const { data: { user }, error: authError } = await supabase.auth.getUser();
                if (authError || !user) {
                    setErrorMessage('No se pudo identificar al usuario.');
                    return;
                };
                setCurrentUserId(user.id);

                // Obtener perfil del usuario autenticado
                const { data: profile, error: profileError } = await supabase.from('users').select('first_name').eq('id', user.id).maybeSingle();
                if (profileError) throw profileError;
                if (profile) {
                    setFirstName(profile.first_name);
                };

                // Obtener publicaciones del feed
                const { data, error } = await supabase.from('posts').select(`id,user_id,content,image_url,type,created_at,users(first_name,last_name,avatar_url)`).eq('type', 'POST').order('created_at', { ascending: false });
                if (error) throw error;

                setPosts((data ?? []) as unknown as FeedPost[]);
            } catch (error) {
                console.error('Error al cargar el feed:', error)
                setErrorMessage('No se pudieron cargar las publicaciones.')
            } finally {
                setLoading(false)
            }
        };

        loadFeed();
    }, []);

    async function handleCreatePost() {
        setPublishMessage('');

        if (!content.trim() && !selectedImage) {
            setPublishMessage('Escribe algo o selecciona una imagen.');
            return;
        };

        try {
            setPublishing(true);

            let imageUrl: string | null = null;
            if (selectedImage) {
                imageUrl = await uploadPostImage(selectedImage);
            };
            await createPost(content, imageUrl);

            setContent('')
            removeSelectedImage()
            setPublishMessage('¡Publicación creada correctamente!')

            // Actualizamos el feed para mostrar la nueva publicación.
            const { data, error } = await supabase.from('posts').select(`id,user_id,content,image_url,type,created_at,users(first_name,last_name,avatar_url)`).eq('type', 'POST').order('created_at', { ascending: false });
            if (error) throw error;

            setPosts((data ?? []) as unknown as FeedPost[]);
        } catch (error) {
            console.error('Error al crear publicación:', error);
            setPublishMessage('No se pudo crear la publicación.');
        } finally {
            setPublishing(false);
        }
    };
    
    async function handleDeletePost(postId: string) {
        const confirmed = window.confirm('¿Estás seguro de que deseas eliminar esta publicación?')
        if (!confirmed) return;

        try {
            await deletePost(postId);

            setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
        } catch (error) {
            console.error('Error al eliminar publicación:', error);
            alert('No se pudo eliminar la publicación.');
        }
    };

    function handleImageChange(event: React.ChangeEvent<HTMLInputElement>) {
        const file = event.target.files?.[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            setPublishMessage('Solo se permiten imágenes JPG, PNG o WEBP.')
            event.target.value = '';
            return;
        };

        if (file.size > 5 * 1024 * 1024) {
            setPublishMessage('La imagen no debe superar los 5 MB.');
            event.target.value = '';
            return;
        };

        setPublishMessage('');
        setSelectedImage(file);
        setImagePreview(URL.createObjectURL(file));
    };

    function removeSelectedImage() {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        };

        setSelectedImage(null);
        setImagePreview(null);
    };

    function formatDate(date: string) {
        return new Date(date).toLocaleString('es-PE', {
            timeZone: 'America/Lima',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="p-5 lg:p-7">
            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_260px] gap-6 max-w-[1200px] mx-auto">
                {/* Feed principal */}
                <section className="min-w-0">
                    {/* Bienvenida */}
                    <div className="mb-6">
                        <p className="text-xs font-medium text-blue-600 mb-1">TU ESPACIO PROFESIONAL</p>
                        <h1 className="text-2xl font-bold text-[#102F60]">¡Hola, {firstName}! 👋</h1>
                        <p className="text-sm text-slate-500 mt-1">Descubre lo que está pasando en tu comunidad.</p>
                    </div>

                    {/* Crear publicación (interfaz provisional) */}
                    <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm mb-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-semibold">{firstName.charAt(0).toUpperCase()}</div>
                            
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="¿Qué estás aprendiendo o compartiendo hoy?"
                                rows={3}
                                maxLength={5000}
                                className="flex-1 resize-none rounded-lg bg-slate-100 px-4 py-3 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-blue-100 focus:bg-white transition"
                            />
                        </div>
                        
                        {imagePreview && (
                            <div className="relative mt-3 w-fit">
                                <img src={imagePreview} alt="Vista previa" className="max-h-64 max-w-full rounded-lg object-contain"/>

                                <button
                                    type="button"
                                    onClick={removeSelectedImage}
                                    className="absolute -right-2 -top-2 rounded-full bg-slate-900 p-1 text-white hover:bg-red-600 transition"
                                    aria-label="Eliminar imagen seleccionada"
                                >
                                    <X size={14} />
                                </button>
                            </div>
                        )}

                        <div className="border-t border-slate-100 pt-3 mt-3 flex justify-between items-center">
                            <label className="flex items-center gap-2 text-xs text-slate-600 hover:text-blue-600 transition">
                                <ImagePlus size={17} />
                                Agregar imagen
                                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleImageChange} className="hidden"/>
                            </label>
                            
                            <button 
                                type="button"
                                onClick={handleCreatePost} 
                                disabled={publishing || (!content.trim() && !selectedImage)}
                                className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Send size={14} />
                                {publishing ? 'Publicando...' : 'Publicar'}
                            </button>
                        </div>

                        {publishMessage && (
                            <p className="mt-3 text-xs text-slate-500">{publishMessage}</p>
                        )}
                    </div>

                    {/* Publicaciones */}
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-base font-bold text-[#102F60]">Publicaciones recientes</h2>
                        </div>

                        {loading && (
                            <div className="bg-white rounded-xl p-8 text-center border border-slate-200">
                                <p className="text-sm text-slate-500">Cargando publicaciones...</p>
                            </div>
                        )}

                        {!loading && errorMessage && (
                            <div className="bg-white rounded-xl p-6 border border-red-100">
                                <p className="text-sm text-red-600">{errorMessage}</p>
                            </div>
                        )}

                        {!loading && !errorMessage && posts.length === 0 && (
                            <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
                                <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center mx-auto mb-4 text-blue-600"> <MessageCircle size={25} /></div>
                                <h3 className="text-sm font-semibold text-slate-800">Todavía no hay publicaciones</h3>
                                <p className="text-xs text-slate-500 mt-2">¡Sé el primero en compartir algo con la comunidad!</p>
                            </div>
                        )}

                        {!loading && !errorMessage && posts.map((post) => (
                            <article key={post.id} className="bg-white rounded-xl border border-slate-200 p-4 shadow-sm">
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        {post.users?.avatar_url ? (
                                            <img src={post.users.avatar_url} alt="Avatar" className="w-10 h-10 rounded-full object-cover"/>
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center text-sm font-semibold">
                                                {post.users?.first_name?.charAt(0) ?? 'U'}
                                            </div>
                                        )}

                                        <div>
                                            <p className="text-xs font-semibold text-slate-800">{post.users?.first_name} {post.users?.last_name}</p>
                                            <p className="text-[10px] text-slate-400 mt-0.5">{formatDate(post.created_at)}</p>
                                        </div>
                                    </div>

                                    {currentUserId === post.user_id && (
                                        <button
                                            type="button"
                                            onClick={() => handleDeletePost(post.id)}
                                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                                            title="Eliminar publicación"
                                        >
                                            <Trash2 size={17} />
                                        </button>
                                    )}
                                </div>

                                <p className="text-sm text-slate-700 whitespace-pre-wrap">{post.content}</p>

                                {post.image_url && (
                                    <img src={post.image_url} 
                                    alt="Imagen de la publicación" 
                                    className="w-full max-h-[500px] object-contain rounded-lg"/>
                                )}

                                <div className="border-t border-slate-100 mt-4 pt-3 flex items-center gap-5 text-xs text-slate-500">
                                    <span className="flex items-center gap-1.5">
                                        <Heart size={16} />
                                        Me gusta
                                    </span>

                                    <span className="flex items-center gap-1.5">
                                        <MessageCircle size={16} />
                                        Comentar
                                    </span>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

                {/* Panel derecho */}
                <aside className="hidden xl:block space-y-4">
                    <div className="bg-[#102F60] rounded-xl p-5 text-white">
                        <p className="text-[10px] font-semibold tracking-wider text-blue-300">CERTUS TECH-CONNECT</p>
                        <h3 className="text-lg font-bold mt-3 leading-snug">Aprende, comparte y conecta.</h3>
                        <p className="text-xs text-blue-100 mt-2 leading-relaxed">Construye tu comunidad profesional y descubre nuevas oportunidades.</p>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                        <h3 className="text-sm font-bold text-[#102F60]">Próximos eventos</h3>
                        <p className="text-xs text-slate-500 mt-2">Aquí encontrarás los próximos eventos y hackathons.</p>
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-4">
                        <h3 className="text-sm font-bold text-[#102F60]">Amplía tu comunidad</h3>
                        <p className="text-xs text-slate-500 mt-2">Conecta con otros estudiantes y descubre nuevos perfiles.</p>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default FeedPage;