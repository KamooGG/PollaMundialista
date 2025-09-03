import { useEffect, useMemo, useState } from "react";
import { apiCrearPrediccion, apiListPartidos } from "../api";
import PredictionRow from "./PredictionRow";

export default function MatchList({ userId, disabled }) {
    const [partidos, setPartidos] = useState([]);
    const [preds, setPreds] = useState({}); // { partidoId: {local, visitante} }
    const canSubmit = useMemo(
        () => !disabled && Object.keys(preds).length > 0,
        [disabled, preds]
    );

    useEffect(() => {
        apiListPartidos()
            .then((r) => setPartidos(r.data || []))
            .catch(() => setPartidos([]));
    }, []);

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
                        usuarioId: userId,
                        partidoId,
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

            <div className="table">
                <div className="thead">
                    <div>Fecha/Hora</div>
                    <div>Local</div>
                    <div>Visitante</div>
                    <div>Tu predicción</div>
                    <div>Resultado real</div>
                </div>
                <div className="tbody">
                    {partidos.map((p) => (
                        <PredictionRow
                            key={p._id}
                            partido={p}
                            value={preds[p._id]}
                            onChange={onChange}
                        />
                    ))}
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
