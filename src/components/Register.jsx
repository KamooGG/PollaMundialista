import { useState, useEffect } from "react";
import { apiAuthRegister, apiAuthVerify } from "../api";

export default function Register() {
    const [form, setForm] = useState({
        email: "",
        password: "",
        nombre: "",
        alias: "",
    });
    const [msg, setMsg] = useState(null);
    const [preview, setPreview] = useState(null);

    const onChange = (k, v) => setForm((f) => ({ ...f, [k]: v }));

    const submit = async (e) => {
        e.preventDefault();
        setMsg(null);
        setPreview(null);
        try {
            const res = await apiAuthRegister(form);
            setMsg("¡Listo! Revisa tu correo y confirma tu cuenta.");
            if (res.devVerificationLink) setPreview(res.devVerificationLink);
        } catch (err) {
            setMsg(
                err?.response?.data?.error || err.message || "Error registrando"
            );
        }
    };

    // Si montas esta pantalla en /verify, verifica automáticamente si hay ?token
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const token = params.get("token");
        if (!token) return;
        (async () => {
            try {
                await apiAuthVerify(token);
                setMsg("Cuenta verificada ✅ ¡Ya puedes jugar!");
            } catch {
                setMsg("El enlace no es válido o expiró");
            }
        })();
    }, []);

    return (
        <section className="card">
            <h2>Crear cuenta</h2>
            <form
                className="userform"
                onSubmit={submit}
                style={{
                    flexDirection: "column",
                    alignItems: "flex-start",
                    gap: 8,
                }}
            >
                <input
                    placeholder="Correo"
                    type="email"
                    value={form.email}
                    onChange={(e) => onChange("email", e.target.value)}
                    required
                />
                <input
                    placeholder="Contraseña"
                    type="password"
                    value={form.password}
                    onChange={(e) => onChange("password", e.target.value)}
                    required
                />
                <input
                    placeholder="Nombre"
                    value={form.nombre}
                    onChange={(e) => onChange("nombre", e.target.value)}
                    required
                />
                <input
                    placeholder="Alias (3-20, letras/números/_)"
                    value={form.alias}
                    onChange={(e) => onChange("alias", e.target.value)}
                    required
                />
                <button type="submit">Registrarme</button>
            </form>

            {msg && (
                <div className="alert" style={{ marginTop: 8 }}>
                    {msg}
                </div>
            )}
            {preview && (
                <div className="row" style={{ gap: 8, marginTop: 8 }}>
                    <a href={preview} target="_blank">
                        Abrir correo de prueba
                    </a>
                </div>
            )}
        </section>
    );
}
