import { useEffect, useState } from "react";
import {
    apiListPartidos,
    apiSetResultado,
    apiCrearPartido,
    apiListJornadas,
    apiCrearJornada,
    apiPrediccionesPorPartido,
} from "../api";
import MatchPredictions from "./MatchPredictions";

export default function AdminResults() {
    const [partidos, setPartidos] = useState([]);
    const [jornadas, setJornadas] = useState([]);
    const [nuevo, setNuevo] = useState({
        local: "",
        visitante: "",
        fecha: "",
        jornadaId: "",
    });
    const [filtroJornada, setFiltroJornada] = useState("");
    const [showPredsFor, setShowPredsFor] = useState(null);

    const loadJornadas = async () => {
        const { data } = await apiListJornadas();
        setJornadas(data || []);
    };
    const loadPartidos = async (jid) => {
        const { data } = await apiListPartidos(
            jid ? { jornadaId: jid } : undefined
        );
        setPartidos(data || []);
    };

    useEffect(() => {
        loadJornadas();
        loadPartidos();
    }, []);
    useEffect(() => {
        if (filtroJornada) loadPartidos(filtroJornada);
        else loadPartidos();
    }, [filtroJornada]);

    const setScore = async (id, local, visitante) => {
        try {
            await apiSetResultado(id, {
                local: Number(local),
                visitante: Number(visitante),
            });
            await loadPartidos(filtroJornada);
        } catch (err) {
            alert(err?.response?.data?.error || "Error guardando resultado");
        }
    };

    const crearPartido = async () => {
        if (!nuevo.local || !nuevo.visitante || !nuevo.fecha)
            return alert("Completa todos los campos");
        try {
            await apiCrearPartido({
                local: nuevo.local,
                visitante: nuevo.visitante,
                fecha: new Date(nuevo.fecha),
                jornadaId: nuevo.jornadaId
                    ? Number(nuevo.jornadaId)
                    : undefined,
            });
            setNuevo({ local: "", visitante: "", fecha: "", jornadaId: "" });
            await loadPartidos(filtroJornada);
        } catch (err) {
            alert(err?.response?.data?.error || "Error creando partido");
        }
    };

    const crearJornada = async () => {
        const nombre = prompt("Nombre de la jornada:");
        if (!nombre) return;
        try {
            await apiCrearJornada({ nombre });
            await loadJornadas();
        } catch (err) {
            alert(err?.response?.data?.error || "Error creando jornada");
        }
    };

    return (
        <section className="card">
            <h2>Admin – Resultados, Partidos y Jornadas</h2>

            <div className="row" style={{ gap: 8, marginBottom: 12 }}>
                <label>Filtrar por jornada:</label>
                <select
                    value={filtroJornada}
                    onChange={(e) => setFiltroJornada(e.target.value)}
                >
                    <option value="">Todas</option>
                    {jornadas.map((j) => (
                        <option key={j.id} value={j.id}>
                            {j.nombre}
                        </option>
                    ))}
                </select>
                <button onClick={crearJornada}>+ Jornada</button>
            </div>

            <div className="admin-new">
                <input
                    placeholder="Local"
                    value={nuevo.local}
                    onChange={(e) =>
                        setNuevo((p) => ({ ...p, local: e.target.value }))
                    }
                />
                <input
                    placeholder="Visitante"
                    value={nuevo.visitante}
                    onChange={(e) =>
                        setNuevo((p) => ({ ...p, visitante: e.target.value }))
                    }
                />
                <input
                    type="datetime-local"
                    value={nuevo.fecha}
                    onChange={(e) =>
                        setNuevo((p) => ({ ...p, fecha: e.target.value }))
                    }
                />
                <select
                    value={nuevo.jornadaId}
                    onChange={(e) =>
                        setNuevo((p) => ({ ...p, jornadaId: e.target.value }))
                    }
                >
                    <option value="">Sin jornada</option>
                    {jornadas.map((j) => (
                        <option key={j.id} value={j.id}>
                            {j.nombre}
                        </option>
                    ))}
                </select>
                <button onClick={crearPartido}>Crear partido</button>
            </div>

            <div className="table">
                <div className="thead">
                    <div>Fecha/Hora</div>
                    <div>Local</div>
                    <div>Visitante</div>
                    <div>Resultado</div>
                    <div>Acción</div>
                </div>
                <div className="tbody">
                    {partidos.map((p) => {
                        const fechaStr = new Date(p.fecha).toLocaleString();
                        const [l, v] = [
                            p?.resultadoLocal ?? p?.resultado?.local ?? "",
                            p?.resultadoVisitante ??
                                p?.resultado?.visitante ??
                                "",
                        ];
                        const pid = p._id || p.id;
                        return (
                            <div className="trow" key={pid}>
                                <div>{fechaStr}</div>
                                <div>{p.local}</div>
                                <div>{p.visitante}</div>
                                <div className="score">
                                    {l === "" ? "-" : l}
                                    <span>-</span>
                                    {v === "" ? "-" : v}
                                </div>
                                <div className="row">
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="L"
                                        defaultValue={l}
                                        id={`rl-${pid}`}
                                    />
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="V"
                                        defaultValue={v}
                                        id={`rv-${pid}`}
                                    />
                                    <button
                                        onClick={() => {
                                            const el = document.getElementById(
                                                `rl-${pid}`
                                            );
                                            const ev = document.getElementById(
                                                `rv-${pid}`
                                            );
                                            setScore(pid, el.value, ev.value);
                                        }}
                                    >
                                        Guardar
                                    </button>
                                    <button
                                        onClick={() =>
                                            setShowPredsFor(
                                                showPredsFor === pid
                                                    ? null
                                                    : pid
                                            )
                                        }
                                    >
                                        Ver predicciones
                                    </button>
                                </div>
                                {showPredsFor === pid && (
                                    <div
                                        style={{
                                            gridColumn: "1 / -1",
                                            marginTop: 8,
                                        }}
                                    >
                                        <MatchPredictions
                                            partidoId={pid}
                                            fetcher={apiPrediccionesPorPartido}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
