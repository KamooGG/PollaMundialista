import { useEffect, useState } from "react";

export default function MatchPredictions({ partidoId, fetcher }) {
    const [data, setData] = useState(null);
    const load = async () => {
        const { data: _data } = await fetcher(partidoId) // si fetcher devuelve axios response
            .catch(async (e) => {
                // si fetcher ya devuelve json directo (no axios), úsalo tal cual
                return { data: await fetcher(partidoId) };
            });
        setData(_data || _data); // soporta ambas formas
    };
    useEffect(() => {
        load();
    }, [partidoId]);

    if (!data) return <div className="alert">Cargando predicciones...</div>;

    return (
        <div className="card">
            <h4>
                Predicciones – {data.partido.local} vs {data.partido.visitante}
            </h4>
            <div className="table">
                <div className="thead">
                    <div>Usuario</div>
                    <div>Predicción</div>
                    <div>Puntos</div>
                    <div></div>
                </div>
                <div className="tbody">
                    {data.predicciones.map((p) => (
                        <div className="trow" key={p.usuarioId}>
                            <div>{p.nombre}</div>
                            <div className="score">
                                {p.prediccion.local}-{p.prediccion.visitante}
                            </div>
                            <div className="score">{p.puntos ?? "-"}</div>
                            <div></div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="actions">
                <button onClick={load}>Refrescar</button>
            </div>
        </div>
    );
}
