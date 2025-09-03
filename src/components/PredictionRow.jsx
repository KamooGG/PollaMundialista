export default function PredictionRow({ partido, pid, value = {}, onChange }) {
    const fecha = new Date(partido.fecha);
    const fechaStr = isNaN(fecha) ? "-" : fecha.toLocaleString();
    const resLocal = partido.resultadoLocal ?? partido.resultado?.local ?? null;
    const resVisitante =
        partido.resultadoVisitante ?? partido.resultado?.visitante ?? null;

    const lockAheadMin = Number(import.meta.env.VITE_LOCK_AHEAD_MINUTES || 0);
    const locked =
        !isNaN(fecha) && Date.now() >= fecha.getTime() - lockAheadMin * 60000;

    return (
        <div className="trow">
            <div>
                {fechaStr}{" "}
                {locked && <span className="badge badge-closed">Cerrado</span>}
            </div>
            <div className="team">{partido.local}</div>
            <div className="team">{partido.visitante}</div>
            <div className="pred">
                <input
                    type="number"
                    min="0"
                    placeholder="L"
                    value={value.local ?? ""}
                    onChange={(e) => onChange(pid, "local", e.target.value)}
                    disabled={locked}
                />
                <span>-</span>
                <input
                    type="number"
                    min="0"
                    placeholder="V"
                    value={value.visitante ?? ""}
                    onChange={(e) => onChange(pid, "visitante", e.target.value)}
                    disabled={locked}
                />
            </div>
            <div className="score">
                {resLocal ?? "-"}
                <span>-</span>
                {resVisitante ?? "-"}
            </div>
        </div>
    );
}
