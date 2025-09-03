export default function PredictionRow({ partido, value = {}, onChange }) {
    const fecha = new Date(partido.fecha);
    const fechaStr = isNaN(fecha) ? "-" : fecha.toLocaleString();
    const res = partido.resultado || {};

    return (
        <div className="trow">
            <div>{fechaStr}</div>
            <div className="team">{partido.local}</div>
            <div className="team">{partido.visitante}</div>
            <div className="pred">
                <input
                    type="number"
                    min="0"
                    placeholder="L"
                    value={value.local ?? ""}
                    onChange={(e) =>
                        onChange(partido._id, "local", e.target.value)
                    }
                />
                <span>-</span>
                <input
                    type="number"
                    min="0"
                    placeholder="V"
                    value={value.visitante ?? ""}
                    onChange={(e) =>
                        onChange(partido._id, "visitante", e.target.value)
                    }
                />
            </div>
            <div className="score">
                {res?.local ?? "-"}
                <span>-</span>
                {res?.visitante ?? "-"}
            </div>
        </div>
    );
}
