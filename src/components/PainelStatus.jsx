function PainelStatus({ poder, concluidas, taxaSucesso, sequencia }) {
  return (
    <div className="status-panel">
      <div className="status-card">
        <span className="status-label">⚔️ PODER</span>
        <strong className="status-value de-poder">{poder}</strong>
      </div>
      <div className="status-card">
        <span className="status-label">🏆 CONCLUÍDAS</span>
        <strong className="status-value">{concluidas}</strong>
      </div>
      <div className="status-card">
        <span className="status-label">📈 TAXA DE VITÓRIA</span>
        <strong className="status-value">{taxaSucesso}%</strong>
      </div>
      <div className="status-card">
        <span className="status-label">🔥 SEQUÊNCIA</span>
        <strong className="status-value de-sequencia">
          {sequencia} {sequencia === 1 ? 'dia' : 'dias'}
        </strong>
      </div>
    </div>
  );
}

export default PainelStatus;
