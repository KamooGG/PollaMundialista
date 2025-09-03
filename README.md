## 🚀 Instrucciones de uso

1) **Crear proyecto**
```bash
mkdir polla-frontend && cd polla-frontend
# Copia los archivos anteriores en esta estructura
npm i
```

2) **Configura el backend** (de tu proyecto anterior) y ejecuta en `http://localhost:4000`.

3) **Configura variables**
Copia `.env.example` a `.env` y ajusta `VITE_API_URL` si aplica.

4) **Levanta el frontend**
```bash
npm run dev
```
Abre `http://localhost:5173`.

---

## ✅ Flujo rápido de prueba
- En la pestaña **Predicciones**, crea tu usuario (mock) con tu nombre.
- Si no tienes partidos, ve a **Admin Resultados** y crea 2–3 partidos.
- Ingresa tus predicciones y guarda.
- En **Admin Resultados**, carga los resultados reales.
- En **Puntajes**, elige tu usuario y verifica el total y el desglose.

---

## 🔒 Notas y siguientes pasos
- Este frontend no tiene auth real; puedes agregar JWT más adelante.
- Para múltiples usuarios concurrentes, considera reglas para editar predicciones solo antes del inicio del partido (en backend) y un endpoint `GET /predicciones/partido/:id` para ranking por partido.
- Para ranking global, crea un endpoint `/ranking` en backend que agregue puntos por usuario.
- Si usarás despliegue, habilita CORS en backend para tu dominio.