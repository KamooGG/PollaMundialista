import { useEffect, useMemo, useState } from "react";
import { apiCrearPrediccion, apiListPartidos, apiListJornadas } from "../api";
import PredictionRow from "./PredictionRow";

export default function MatchList({ userId, disabled }) {
    const [partidos, setPartidos] = useState([]);
    const [preds, setPreds] = useState({});
    const [jornadas, setJornadas] = useState([]);
    const [filtroJornada, setFiltroJornada] = useState("");

    const canSubmit = useMemo(
        () => !disabled && Object.keys(preds).length > 0,
        [disabled, preds]
    );

    const loadPartidos = async (jid) => {
        const data = await apiListPartidos(
            jid ? { jornadaId: jid } : undefined
        );
        setPartidos(data || []);
    };

    useEffect(() => {
        apiListJornadas()
            .then(setJornadas)
            .catch(() => setJornadas([]));
        loadPartidos();
    }, []);

    useEffect(() => {
        if (filtroJornada) loadPartidos(filtroJornada);
        else loadPartidos();
    }, [filtroJornada]);

    const onChange = (partidoId, campo, val) => {
        setPreds((p) => ({
            ...p,
            [partidoId]: { ...p[partidoId], [campo]: Number(val) },
        }));
    };

    const onSubmit = async () => {
        if (disabled) return;
        try {
            const ops = Object.entries(preds);
            await Promise.all(
                ops.map(([partidoId, pred]) =>
                    apiCrearPrediccion({
                        usuarioId: Number(userId) || userId,
                        partidoId: Number(partidoId) || partidoId,
                        prediccion: pred,
                    })
                )
            );
            alert("✅ Predicciones guardadas");
        } catch (err) {
            alert(err?.response?.data?.error || "Error guardando predicciones");
        }
    };

    return (
        <section className="card">
            <h2>Partidos</h2>
            {disabled && (
                <div className="alert">
                    Crea un usuario para poder predecir.
                </div>
            )}

            <div className="row" style={{ gap: 8, marginBottom: 8 }}>
                <label>Jornada:</label>
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
            </div>

            <div className="table">
                <div className="thead">
                    <div>Fecha/Hora</div>
                    <div>Local</div>
                    <div>Visitante</div>
                    <div>Tu predicción</div>
                    <div>Resultado real</div>
                </div>
                <div className="tbody">
                    {partidos.map((p) => {
                        const pid = p._id || p.id;
                        return (
                            <PredictionRow
                                key={pid}
                                pid={pid}
                                partido={p}
                                value={preds[pid]}
                                onChange={onChange}
                            />
                        );
                    })}
                </div>
            </div>

            <div className="actions">
                <button disabled={!canSubmit} onClick={onSubmit}>
                    Guardar predicciones
                </button>
            </div>
        </section>
    );
}
