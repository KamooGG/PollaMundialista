import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
})

// Adjunta secreto admin (local) si existe
api.interceptors.request.use((config) => {
    const admin = import.meta.env.VITE_ADMIN_SECRET
    if (admin) config.headers['x-admin-secret'] = admin
    return config
})

// Usuarios
export const apiCreateUsuario = (data) => api.post('/usuarios', data)
export const apiListUsuarios = () => api.get('/usuarios')

// Jornadas
export const apiCrearJornada = (data) => api.post('/jornadas', data)
export const apiListJornadas = () => api.get('/jornadas')
export const apiPartidosDeJornada = (id) => api.get(`/jornadas/${id}/partidos`)

// Partidos
export const apiListPartidos = (params) => api.get('/partidos', { params })
export const apiCrearPartido = (data) => api.post('/partidos', data)
export const apiSetResultado = (partidoId, resultado) => api.put(`/partidos/${partidoId}/resultado`, resultado)

// Predicciones
export const apiCrearPrediccion = (data) => api.post('/predicciones', data)
export const apiPrediccionesUsuario = (usuarioId) => api.get(`/predicciones/usuario/${usuarioId}`)
export const apiPrediccionesPorPartido = (partidoId) => api.get(`/predicciones/partido/${partidoId}`)

// Ranking
export const apiRanking = () => api.get('/ranking')

export default api
