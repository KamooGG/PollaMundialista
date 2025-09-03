import { useEffect, useState } from "react";
import { apiListPartidos, apiSetResultado, apiCrearPartido } from "../api";

export default function AdminResults() {
    const [partidos, setPartidos] = useState([]);
    const [nuevo, setNuevo] = useState({ local: "", visitante: "", fecha: "" });

    const load = () =>
        apiListPartidos()
            .then((r) => setPartidos(r.data || []))
            .catch(() => setPartidos([]));
    useEffect(() => {
        load();
    }, []);

    const setScore = async (id, local, visitante) => {
        try {
            await apiSetResultado(id, {
                local: Number(local),
                visitante: Number(visitante),
            });
            await load();
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
            });
            setNuevo({ local: "", visitante: "", fecha: "" });
            await load();
        } catch (err) {
            alert(err?.response?.data?.error || "Error creando partido");
        }
    };

    return (
        <section className="card">
            <h2>Admin – Resultados y Partidos</h2>

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
                            p?.resultado?.local ?? "",
                            p?.resultado?.visitante ?? "",
                        ];
                        return (
                            <div className="trow" key={p._id}>
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
                                        id={`rl-${p._id}`}
                                    />
                                    <input
                                        type="number"
                                        min="0"
                                        placeholder="V"
                                        defaultValue={v}
                                        id={`rv-${p._id}`}
                                    />
                                    <button
                                        onClick={() => {
                                            const el = document.getElementById(
                                                `rl-${p._id}`
                                            );
                                            const ev = document.getElementById(
                                                `rv-${p._id}`
                                            );
                                            setScore(p._id, el.value, ev.value);
                                        }}
                                    >
                                        Guardar
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
