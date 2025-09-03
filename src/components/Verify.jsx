import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { apiAuthVerify } from "../api";

export default function Verify() {
    const [params] = useSearchParams();
    const [msg, setMsg] = useState("Verificando...");
    const token = params.get("token");

    useEffect(() => {
        if (!token) {
            setMsg("Falta el token. Revisa tu correo.");
            return;
        }
        (async () => {
            try {
                await apiAuthVerify(token);
                setMsg("Cuenta verificada ✅ ¡Ya puedes iniciar sesión!");
            } catch {
                setMsg("El enlace no es válido o expiró.");
            }
        })();
    }, [token]);

    return (
        <section className="container">
            <div className="card">
                <h2>Verificación de correo</h2>
                <div className="alert">{msg}</div>
                <div className="actions">
                    <Link to="/login">
                        <button>Ir a Iniciar sesión</button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
