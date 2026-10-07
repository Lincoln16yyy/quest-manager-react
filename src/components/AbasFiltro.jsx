const ABAS = [
  { id: 'todas', rotulo: 'Todas' },
  { id: 'ativas', rotulo: 'Ativas' },
  { id: 'concluidas', rotulo: 'Concluídas' },
];

function AbasFiltro({ filtro, onMudarFiltro }) {
  return (
    <div className="abas-container" role="group" aria-label="Filtrar quests">
      {ABAS.map(({ id, rotulo }) => (
        <button
          key={id}
          type="button"
          className={`btn-aba ${filtro === id ? 'ativo' : ''}`}
          onClick={() => onMudarFiltro(id)}
          aria-pressed={filtro === id}
        >
          {rotulo}
        </button>
      ))}
    </div>
  );
}

export default AbasFiltro;
