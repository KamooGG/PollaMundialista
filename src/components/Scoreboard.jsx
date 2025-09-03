import { useEffect, useState } from "react";
import { apiPrediccionesUsuario, apiRanking } from "../api";

export default function Scoreboard({ userId, disabled, usuarios = [] }) {
    const [userSel, setUserSel] = useState(userId || "");
    const [data, setData] = useState({ total: 0, resultados: [] });
    const [ranking, setRanking] = useState([]);
    const [auto, setAuto] = useState(
        Boolean(Number(import.meta.env.VITE_RANKING_POLL_MS || 0))
    );
    const pollMs = Number(import.meta.env.VITE_RANKING_POLL_MS || 0);

    useEffect(() => {
        if (userId) setUserSel(userId);
    }, [userId]);

    const loadUser = async (uid) => {
        if (!uid) return;
        try {
            const data = await apiPrediccionesUsuario(uid);
            setData(data);
        } catch (err) {
            alert(err?.response?.data?.error || "Error cargando puntaje");
        }
    };

    const loadRanking = async () => {
        try {
            const data = await apiRanking();
            setRanking(data);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        loadRanking();
    }, []);
    useEffect(() => {
        if (userSel) loadUser(userSel);
    }, [userSel]);

    useEffect(() => {
        if (!auto || pollMs <= 0) return;
        const id = setInterval(loadRanking, pollMs);
        return () => clearInterval(id);
    }, [auto, pollMs]);

    return (
        <section className="card">
            <h2>Puntajes</h2>
            {disabled && (
                <div className="alert">
                    Crea un usuario para ver tu puntaje. También puedes
                    consultar otro usuario.
                </div>
            )}

            <div className="row" style={{ gap: 8, alignItems: "center" }}>
                <label>Usuario:</label>
                <select
                    value={userSel}
                    onChange={(e) => setUserSel(e.target.value)}
                >
                    <option value="">-- Selecciona --</option>
                    {usuarios.map((u) => (
                        <option key={u._id || u.id} value={u._id || u.id}>
                            {u.nombre}
                        </option>
                    ))}
                </select>
                <button disabled={!userSel} onClick={() => loadUser(userSel)}>
                    Refrescar
                </button>
                <button onClick={loadRanking}>Actualizar ranking</button>
                <label style={{ marginLeft: 8 }}>
                    <input
                        type="checkbox"
                        checked={auto}
                        onChange={(e) => setAuto(e.target.checked)}
                    />{" "}
                    Autorefrescar
                </label>
            </div>

            <div className="score-total">
                Total: <strong>{data.total ?? 0}</strong> pts
            </div>

            <div className="table" style={{ marginBottom: 16 }}>
                <div className="thead">
                    <div>Partido</div>
                    <div>Tu predicción</div>
                    <div>Resultado real</div>
                    <div>Puntos</div>
                </div>
                <div className="tbody">
                    {(data.resultados || []).map((r, idx) => (
                        <div className="trow" key={idx}>
                            <div>
                                {r.partido?.local} vs {r.partido?.visitante}
                            </div>
                            <div className="score">
                                {r.prediccion?.local}-{r.prediccion?.visitante}
                            </div>
                            <div className="score">
                                {r.partido?.resultado?.local ?? "-"}-
                                {r.partido?.resultado?.visitante ?? "-"}
                            </div>
                            <div className="score">{r.puntos ?? "-"}</div>
                        </div>
                    ))}
                </div>
            </div>

            <h3 style={{ marginTop: 0 }}>🏆 Ranking global</h3>
            <div className="table">
                <div className="thead">
                    <div>#</div>
                    <div>Usuario</div>
                    <div>Total</div>
                    <div>Exactos</div>
                    <div>Tendencias</div>
                </div>
                <div className="tbody">
                    {ranking.map((r, i) => (
                        <div className="trow" key={r.usuarioId}>
                            <div>{i + 1}</div>
                            <div>{r.nombre}</div>
                            <div className="score">{r.total}</div>
                            <div className="score">{r.exactos}</div>
                            <div className="score">{r.tendencias}</div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
