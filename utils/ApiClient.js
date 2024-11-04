import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://localhost:3000/api',
});

// Método para establecer el token
export const setAuthToken = (token) => {
    if (token) {
        apiClient.defaults.headers.Authorization = `Bearer ${token}`;
    } else {
        delete apiClient.defaults.headers.Authorization; // Elimina el token si no hay
    }
};

// Interceptor para manejar errores
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        // Aquí puedes manejar errores globalmente
        return Promise.reject(error);
    }
);

export default apiClient;
