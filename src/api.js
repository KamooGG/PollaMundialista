import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000',
})

// Usuarios
export const apiCreateUsuario = (data) => api.post('/usuarios', data)
export const apiListUsuarios = () => api.get('/usuarios')

// Partidos
export const apiListPartidos = () => api.get('/partidos')
export const apiCrearPartido = (data) => api.post('/partidos', data)
export const apiSetResultado = (partidoId, resultado) => api.put(`/partidos/${partidoId}/resultado`, resultado)

// Predicciones
export const apiCrearPrediccion = (data) => api.post('/predicciones', data)
export const apiPrediccionesUsuario = (usuarioId) => api.get(`/predicciones/usuario/${usuarioId}`)

export default api