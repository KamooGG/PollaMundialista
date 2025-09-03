import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiAuthLogin } from "../api";

export default function Login({ onLoggedIn }) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [msg, setMsg] = useState(null);
    const navigate = useNavigate();

    const submit = async (e) => {
        e.preventDefault();
        setMsg(null);
        try {
            const { token, user } = await apiAuthLogin({ email, password });
            localStorage.setItem("pf_token", token);
            localStorage.setItem("pf_userId", user.id);
            localStorage.setItem("pf_userName", user.nombre);
            if (onLoggedIn) onLoggedIn(user);
            navigate("/");
        } catch (err) {
            setMsg(
                err?.response?.data?.error ||
                    err.message ||
                    "Error de inicio de sesión"
            );
        }
    };

    return (
        <section className="card">
            <h2>Iniciar sesión</h2>
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
                    type="email"
                    placeholder="Correo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Entrar</button>
            </form>
            {msg && (
                <div className="alert" style={{ marginTop: 8 }}>
                    {msg}
                </div>
            )}
        </section>
    );
}
