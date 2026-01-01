import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

export const authAPI = {
    login: (credentials: any) => api.post('/auth/login', credentials),
    register: (userData: any) => api.post('/auth/register', userData),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data: any) => api.put('/auth/profile', data),
};

export const productAPI = {
    getAll: (params?: any) => api.get('/products', { params }),
    getById: (id: string) => api.get(`/products/${id}`),
    create: (productData: FormData) => api.post('/products', productData),
    update: (id: string, productData: any) => api.put(`/products/${id}`, productData),
    enhance: (formData: FormData) => api.post('/products/enhance', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    delete: (id: string) => api.delete(`/products/${id}`),
};

export const orderAPI = {
    create: (data: any) => api.post('/orders', data),
    getMyOrders: () => api.get('/orders/my-orders'),
};

export default api;
