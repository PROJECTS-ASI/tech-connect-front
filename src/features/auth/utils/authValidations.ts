export function validateFirstName(firstName: string): string | null {
    const value = firstName.trim();

    if (!value) {
        return 'El campo nombres es obligatorio.';
    };
    if (value.length < 3) {
        return 'Nombres debe tener al menos 3 caracteres.';
    };
    if (!/^[\p{L}]+(?:[ '-][\p{L}]+)*$/u.test(value)) {
        return 'Nombres solo puede contener letras.';
    };

    return null;
};

export function validateLastName(lastName: string): string | null {
    const value = lastName.trim();

    if (!value) {
        return 'El campo apellidos es obligatorio.';
    };
    if (value.length < 3) {
        return 'Apellidos debe tener al menos 3 caracteres.';
    };
    if (!/^[\p{L}]+(?:[ '-][\p{L}]+)*$/u.test(value)) {
        return 'Apellidos solo puede contener letras.';
    };

    return null;
};

export function validateEmail(email: string): string | null {
    const value = email.trim();

    if (!value) {
        return 'El correo electrónico es obligatorio.';
    };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        return 'Ingresa un correo electrónico válido.';
    };
    /*if (!value.toLowerCase().endsWith('@certus.edu.pe')) {
        return 'Debes utilizar tu correo institucional de CERTUS.';
    };*/
    return null;
};

export function validatePassword(password: string): string | null {
    if (!password) {
        return 'La contraseña es obligatoria.';
    };
    if (password.length < 8) {
        return 'La contraseña debe tener al menos 8 caracteres.';
    };
    if (!/[a-z]/.test(password)) {
        return 'Debe contener al menos una letra minúscula.';
    };
    if (!/[A-Z]/.test(password)) {
        return 'Debe contener al menos una letra mayúscula.';
    };
    if (!/[0-9]/.test(password)) {
        return 'Debe contener al menos un número.';
    };
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|<>?,./`~]/.test(password)) {
        return 'Debe contener al menos un carácter especial (ej. !, @, #, $).';
    };
    if (/\s/.test(password)) {
        return 'La contraseña no debe contener espacios.';
    };

    return null;
};

export function validateTerms(acceptedTerms: boolean): string | null {
    if (!acceptedTerms) {
        return 'Debes aceptar los términos y condiciones.';
    };

    return null;
};