
import { useState, type SubmitEvent } from 'react';
import { Link } from 'react-router-dom';
import { registerUser } from '../services/authService';
import { validateEmail, validateFirstName, validateLastName, validatePassword, validateTerms } from '../utils/authValidations';

function RegisterPage() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);


    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    async function handleSubmit(e: SubmitEvent<HTMLFormElement>) {
        e.preventDefault();

        setMessage('');
        setErrorMessage('');

        const validations = [validateFirstName(firstName), validateLastName(lastName), validateEmail(email), validatePassword(password), validateTerms(acceptedTerms)];
        const firstError = validations.find(error => error !== null);
        if (firstError) {
            setErrorMessage(firstError);
            return;
        };

        try {
            setLoading(true);

            await registerUser(firstName.trim(), lastName.trim(), email.trim(), password);

            setMessage('¡Registro exitoso! Revisa tu correo para confirmar tu cuenta.');
        } catch (error) {
            console.error(error);
            setErrorMessage(error instanceof Error ? error.message : 'Ocurrió un error al registrarte.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-slate-100">

            {/* Panel izquierdo */}
            <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden bg-gradient-to-br from-[#102f66] via-[#16458e] to-[#2475ed] p-12 text-white lg:flex">

                {/* Círculos decorativos */}
                <div className="pointer-events-none absolute -right-24 -top-36 h-[480px] w-[480px] rounded-full border border-white/60" />
                <div className="pointer-events-none absolute -right-12 -top-24 h-[400px] w-[400px] rounded-full border border-white/60" />

                {/* Logo */}
                <div className="relative z-10 flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-white" />
                    <span className="text-xl font-medium tracking-wide">CERTUS Tech-Connect</span>
                </div>

                {/* Presentación */}
                <div className="relative z-10 max-w-xl">
                    <div className="mb-7 flex items-center gap-2">
                        <span className="h-0.5 w-5 bg-sky-400" />
                        <span className="text-[10px] font-semibold tracking-[0.2em] text-blue-200">TU COMUNIDAD ACADÉMICA DE TI</span>
                    </div>

                    <h1 className="text-4xl font-bold leading-tight tracking-tight xl:text-[42px]">Conecta, aprende y compite con tu comunidad de TI</h1>

                    <p className="mt-6 max-w-md text-sm leading-6 text-blue-100">
                        Un espacio para compartir proyectos, resolver dudas y encontrar
                        tu próximo equipo. De tu primera línea de código a tu siguiente
                        gran reto.
                    </p>

                    {/* Elementos visuales */}
                    <div className="mt-7 flex gap-2">
                        {['♧', '</>', '🏆'].map((item, index) => (
                            <div key={index} className="flex h-9 w-24 items-center justify-center rounded-lg bg-white text-lg font-semibold text-blue-600">{item}</div>
                        ))}
                    </div>

                    {/* Bloque de código */}
                    <div className="mt-6 rounded-xl border border-white/70 bg-blue-950/20 p-5">
                        <div className="flex justify-between text-[10px] tracking-widest text-blue-200">
                            <span>comunidad.ts</span>
                            <span className="text-sky-300">›_</span>
                        </div>

                        <p className="mt-4 text-xs text-blue-100">const futuro = conectar(ideas, personas);</p>
                        <p className="mt-3 text-xs text-sky-300">// El siguiente paso lo construimos juntos.</p>
                    </div>
                </div>

                {/* Footer izquierdo */}
                <div className="relative z-10 flex justify-between text-[10px] text-blue-200">
                    <span>Para estudiantes y egresados de TI</span>
                    <span>© 2026</span>
                </div>
            </section>

            {/* Panel derecho */}
            <section className="flex min-h-screen flex-col items-center justify-center px-5 py-10 lg:px-12">
                {/* Tarjeta de registro */}
                <div className="w-full max-w-[466px] rounded-xl bg-white p-7 shadow-[0_12px_40px_rgba(15,23,42,0.07)] sm:p-9">

                    {/* Pestañas */}
                    <div className="mb-6 grid grid-cols-2 rounded-lg bg-slate-100 p-1">
                        <Link to="/login" className="rounded-md py-2.5 text-center text-xs font-semibold text-slate-500 transition hover:text-blue-600">Inicio de sesión</Link>
                        <div className="rounded-md bg-white py-2.5 text-center text-xs font-semibold text-blue-600 shadow-sm">Registro</div>
                    </div>

                    {/* Encabezado */}
                    <h2 className="text-2xl font-bold tracking-tight text-[#142f5e]">Tu comunidad te espera</h2>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                        Crea tu cuenta y empieza a conectar con personas que comparten
                        tu pasión por la tecnología.
                    </p>

                    {/* Formulario */}
                    <form onSubmit={handleSubmit} className="mt-6 space-y-4">

                        {/* Nombres */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Nombres</label>

                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value.replace(/^\s+/, ''))}
                                placeholder="Ingresa tus nombres"
                                autoComplete="given-name"
                                required
                                className="w-full rounded-lg border border-slate-200 px-3.5 py-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                            <p className="mt-2 text-[10px] text-slate-400">Mínimo 3 caracteres.</p>
                        </div>

                        {/* Apellidos */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Apellidos</label>

                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value.replace(/^\s+/, ''))}
                                placeholder="Ingresa tus apellidos"
                                autoComplete="family-name"
                                required
                                className="w-full rounded-lg border border-slate-200 px-3.5 py-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />
                            <p className="mt-2 text-[10px] text-slate-400">Mínimo 3 caracteres.</p>
                        </div>

                        {/* Correo */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Correo institucional</label>

                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value.replace(/^\s+/, ''))}
                                placeholder="tucorreo@certus.edu.pe"
                                autoComplete="email"
                                required
                                className="w-full rounded-lg border border-slate-200 px-3.5 py-3 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                            />

                            <p className="mt-2 text-[10px] text-slate-400">Usa tu correo institucional para unirte a la comunidad.</p>
                        </div>

                        {/* Contraseña */}
                        <div>
                            <label className="mb-1.5 block text-xs font-semibold text-slate-700">Contraseña</label>

                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value.replace(/\s/g, ''))}
                                    placeholder="Crea una contraseña segura"
                                    autoComplete="new-password"
                                    minLength={8}
                                    required
                                    className="w-full rounded-lg border border-slate-200 px-3.5 py-3 pr-14 text-xs text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                />

                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-xs text-gray-500 hover:text-gray-700">
                                    {showPassword ? 'Ocultar' : 'Ver'}
                                </button>
                            </div>

                            <p className="mt-2 text-[10px] text-slate-400">Mínimo 8 caracteres: 1 letra minúscula, 1 letra mayúscula, 1 número y 1 símbolo.</p>
                        </div>

                        {/* Términos */}
                        <label className="flex cursor-pointer items-start gap-2 text-[10px] leading-5 text-slate-500">
                            <input
                                type="checkbox"
                                checked={acceptedTerms}
                                onChange={(e) => setAcceptedTerms(e.target.checked)}
                                className="mt-1 h-3.5 w-3.5 shrink-0 accent-blue-600"
                            />

                            <span>
                                Acepto los Términos de uso y la Política de privacidad de
                                Tech-Connect.
                            </span>
                        </label>

                        {/* Mensajes */}
                        {errorMessage && (<p className="rounded-lg bg-red-50 p-3 text-xs text-red-600">{errorMessage}</p>)}

                        {message && (<p className="rounded-lg bg-green-50 p-3 text-xs text-green-700">{message}</p>)}

                        {/* Botón */}
                        <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50">
                            <span>➜</span>
                            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
                        </button>

                    </form>

                    {/* Enlace al login */}
                    <div className="mt-6 border-t border-slate-200 pt-6 text-center text-[11px] text-slate-500">
                        ¿Ya tienes una cuenta?{' '}
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-700">Inicia sesión</Link>
                    </div>
                </div>

                {/* Ayuda */}
                <div className="mt-6 text-center text-[11px] text-slate-500">
                    ¿Necesitas ayuda para ingresar?{' '}
                    <a href="mailto:soporte@certus.edu.pe" className="font-semibold text-blue-600">Contáctanos</a>
                </div>
            </section>
        </div>
    );
};

export default RegisterPage;