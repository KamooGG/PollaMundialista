import { useEffect, useMemo, useState } from "react";
import { Routes, Route, Link, NavLink, useNavigate } from "react-router-dom";
import { useLocalStorage } from "./hooks/useLocalStorage";
import MatchList from "./components/MatchList";
import Scoreboard from "./components/Scoreboard";
import AdminResults from "./components/AdminResults";
import Register from "./components/Register";
import Login from "./components/Login";
import Verify from "./components/Verify";
import { apiCreateUsuario, apiListUsuarios } from "./api";

export default function App() {
    const [userId, setUserId] = useLocalStorage("pf_userId", "");
    const [userName, setUserName] = useLocalStorage("pf_userName", "");
    const [usuarios, setUsuarios] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        apiListUsuarios()
            .then(setUsuarios)
            .catch(() => setUsuarios([]));
    }, []);

    const hasUser = useMemo(() => Boolean(userId), [userId]);

    const handleCreateUser = async (e) => {
        e.preventDefault();
        if (!userName.trim()) return;
        try {
            const data = await apiCreateUsuario({
                nombre: userName,
                email: `${crypto.randomUUID()}@mock.local`,
            });
            setUserId(data._id || data.id);
            setUserName(data.nombre);
            setUsuarios((prev) => [...prev, data]);
        } catch (err) {
            alert(err?.response?.data?.error || "Error creando usuario");
        }
    };

    const logout = () => {
        localStorage.removeItem("pf_token");
        localStorage.removeItem("pf_userId");
        localStorage.removeItem("pf_userName");
        setUserId("");
        setUserName("");
        navigate("/login");
    };

    return (
        <div className="container">
            <header className="header">
                <h1>⚽ Polla Futbolera</h1>
                <nav className="tabs">
                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) => (isActive ? "active" : "")}
                    >
                        Predicciones
                    </NavLink>
                    <NavLink
                        to="/score"
                        className={({ isActive }) => (isActive ? "active" : "")}
                    >
                        Puntajes
                    </NavLink>
                    <NavLink
                        to="/admin"
                        className={({ isActive }) => (isActive ? "active" : "")}
                    >
                        Admin
                    </NavLink>
                    <NavLink
                        to="/register"
                        className={({ isActive }) => (isActive ? "active" : "")}
                    >
                        Registro
                    </NavLink>
                    <NavLink
                        to="/login"
                        className={({ isActive }) => (isActive ? "active" : "")}
                    >
                        Login
                    </NavLink>
                </nav>
            </header>

            <section className="userbar">
                {hasUser ? (
                    <div
                        className="row"
                        style={{ gap: 8, alignItems: "center" }}
                    >
                        <div className="userpill">
                            👤 {userName} <small>({userId})</small>
                        </div>
                        <button onClick={logout}>Cerrar sesión</button>
                    </div>
                ) : (
                    <form className="userform" onSubmit={handleCreateUser}>
                        <input
                            type="text"
                            placeholder="Tu nombre (mock)"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                        <button type="submit">Crear usuario (mock)</button>
                        <Link to="/register" style={{ marginLeft: 8 }}>
                            o Registrarme →
                        </Link>
                    </form>
                )}
            </section>

            <main>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <MatchList userId={userId} disabled={!hasUser} />
                        }
                    />
                    <Route
                        path="/score"
                        element={
                            <Scoreboard
                                userId={userId}
                                disabled={!hasUser}
                                usuarios={usuarios}
                            />
                        }
                    />
                    <Route path="/admin" element={<AdminResults />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/login"
                        element={
                            <Login
                                onLoggedIn={(u) => {
                                    setUserId(u.id);
                                    setUserName(u.nombre);
                                }}
                            />
                        }
                    />
                    <Route path="/verify" element={<Verify />} />
                </Routes>
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
