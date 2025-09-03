import { useEffect, useMemo, useState } from "react";
import { useLocalStorage } from "./hooks/useLocalStorage";
import MatchList from "./components/MatchList";
import Scoreboard from "./components/Scoreboard";
import AdminResults from "./components/AdminResults";
import { apiCreateUsuario, apiListUsuarios } from "./api";

export default function App() {
    const [userId, setUserId] = useLocalStorage("pf_userId", "");
    const [userName, setUserName] = useLocalStorage("pf_userName", "");
    const [usuarios, setUsuarios] = useState([]);
    const [tab, setTab] = useState("pred"); // pred | score | admin

    useEffect(() => {
        apiListUsuarios()
            .then((r) => setUsuarios(r.data))
            .catch(() => setUsuarios([]));
    }, []);

    const hasUser = useMemo(() => Boolean(userId), [userId]);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        if (!userName.trim()) return;
        try {
            const { data } = await apiCreateUsuario({
                nombre: userName,
                email: `${crypto.randomUUID()}@mock.local`,
            });
            setUserId(data._id);
            setUserName(data.nombre);
            setUsuarios((prev) => [...prev, data]);
        } catch (err) {
            alert(err?.response?.data?.error || "Error creando usuario");
        }
    };

    return (
        <div className="container">
            <header className="header">
                <h1>⚽ Polla Futbolera</h1>
                <nav className="tabs">
                    <button
                        className={tab === "pred" ? "active" : ""}
                        onClick={() => setTab("pred")}
                    >
                        Predicciones
                    </button>
                    <button
                        className={tab === "score" ? "active" : ""}
                        onClick={() => setTab("score")}
                    >
                        Puntajes
                    </button>
                    <button
                        className={tab === "admin" ? "active" : ""}
                        onClick={() => setTab("admin")}
                    >
                        Admin Resultados
                    </button>
                </nav>
            </header>

            <section className="userbar">
                {hasUser ? (
                    <div className="userpill">
                        👤 {userName} <small>({userId})</small>
                    </div>
                ) : (
                    <form className="userform" onSubmit={handleCreateUser}>
                        <input
                            type="text"
                            placeholder="Tu nombre"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                        <button type="submit">Crear usuario</button>
                    </form>
                )}
            </section>

            <main>
                {tab === "pred" && (
                    <MatchList userId={userId} disabled={!hasUser} />
                )}
                {tab === "score" && (
                    <Scoreboard
                        userId={userId}
                        disabled={!hasUser}
                        usuarios={usuarios}
                    />
                )}
                {tab === "admin" && <AdminResults />}
            </main>

            <footer className="footer">
                <small>
                    Made with React + Vite · API:{" "}
                    {import.meta.env.VITE_API_URL || "http://localhost:4000"}
                </small>
            </footer>
        </div>
    );
}
