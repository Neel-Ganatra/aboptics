import axios from 'axios';

// Force localhost in development
const rawUrl = import.meta.env.MODE === 'development'
    ? "http://localhost:3000/api"
    : (import.meta.env.VITE_API_URL || "https://aboptics-backend.onrender.com/api");

// Strip all trailing /api segments and slashes, then append exactly one /api
export const API_URL = `${rawUrl.replace(/(\/api)+[\/]*$/, '')}/api`;

console.log('Current API URL:', API_URL);

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

export const appointmentAPI = {
    create: (data: any) => api.post('/appointments', data),
    getAll: () => api.get('/appointments'),
    getMyHistory: () => api.get('/appointments/my'),
};

export const adminAPI = {
    getStats: () => api.get('/admin/stats'),
    getOrders: () => api.get('/admin/orders'),
    updateOrderStatus: (id: number | string, status: string) => api.put(`/admin/orders/${id}/status`, { status }),
};

export const orderAPI = {
    create: (data: any) => api.post('/orders', data),
    getMyOrders: () => api.get('/orders/my-orders'),
};

export default api;
