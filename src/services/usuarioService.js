const API_URL = 'http://3.137.221.201/api/usuarios/';

export const getUsuarios = async () => {
    const response = await fetch(API_URL);
    return response.json();
};

export const createUsuario = async (usuario) => {
    const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario),
    });
    return response.json();
};
