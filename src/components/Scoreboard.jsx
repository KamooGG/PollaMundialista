import { useEffect, useState } from "react";
import { apiPrediccionesUsuario } from "../api";

export default function Scoreboard({ userId, disabled, usuarios = [] }) {
    const [userSel, setUserSel] = useState(userId || "");
    const [data, setData] = useState({ total: 0, resultados: [] });

    useEffect(() => {
        if (userId) setUserSel(userId);
    }, [userId]);

    const load = async (uid) => {
        if (!uid) return;
        try {
            const { data } = await apiPrediccionesUsuario(uid);
            setData(data);
        } catch (err) {
            alert(err?.response?.data?.error || "Error cargando puntaje");
        }
    };

    useEffect(() => {
        if (userSel) load(userSel);
    }, [userSel]);

    return (
        <section className="card">
            <h2>Puntajes</h2>
            {disabled && (
                <div className="alert">
                    Crea un usuario para ver tu puntaje. También puedes
                    consultar otro usuario.
                </div>
            )}

            <div className="row">
                <label>Usuario:</label>
                <select
                    value={userSel}
                    onChange={(e) => setUserSel(e.target.value)}
                >
                    <option value="">-- Selecciona --</option>
                    {usuarios.map((u) => (
                        <option key={u._id} value={u._id}>
                            {u.nombre}
                        </option>
                    ))}
                </select>
                <button disabled={!userSel} onClick={() => load(userSel)}>
                    Refrescar
                </button>
            </div>

            <div className="score-total">
                Total: <strong>{data.total ?? 0}</strong> pts
            </div>

            <div className="table">
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
        </section>
    );
}
