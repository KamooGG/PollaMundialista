import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
})

api.interceptors.request.use((config) => {
    const admin = import.meta.env.VITE_ADMIN_SECRET
    if (admin) config.headers['x-admin-secret'] = admin
    const token = localStorage.getItem('pf_token')
    if (token) config.headers['Authorization'] = `Bearer ${token}`
    return config
})

// Auth
export const apiAuthRegister = (payload) => api.post('/auth/register', payload).then(r => r.data)
export const apiAuthVerify = (token) => api.get(`/auth/verify?token=${encodeURIComponent(token)}`).then(r => r.data)
export const apiAuthLogin = (payload) => api.post('/auth/login', payload).then(r => r.data)

// Usuarios
export const apiCreateUsuario = (data) => api.post('/usuarios', data).then(r => r.data)
export const apiListUsuarios = () => api.get('/usuarios').then(r => r.data)

// Jornadas
export const apiCrearJornada = (data) => api.post('/jornadas', data).then(r => r.data)
export const apiListJornadas = () => api.get('/jornadas').then(r => r.data)
export const apiPartidosDeJornada = (id) => api.get(`/jornadas/${id}/partidos`).then(r => r.data)

// Partidos
export const apiListPartidos = (params) => api.get('/partidos', { params }).then(r => r.data)
export const apiCrearPartido = (data) => api.post('/partidos', data).then(r => r.data)
export const apiSetResultado = (id, r) => api.put(`/partidos/${id}/resultado`, r).then(r => r.data)

// Predicciones
export const apiCrearPrediccion = (data) => api.post('/predicciones', data).then(r => r.data)
export const apiPrediccionesUsuario = (uid) => api.get(`/predicciones/usuario/${uid}`).then(r => r.data)
export const apiPrediccionesPorPartido = (pid) => api.get(`/predicciones/partido/${pid}`).then(r => r.data)

// Ranking
export const apiRanking = () => api.get('/ranking').then(r => r.data)

export default api
