function Tarefa({ item, index, alternarConcluida, removerTarefa }) {
  // Se for uma tarefa antiga que não tinha dificuldade, assume "comum"
  const classeDificuldade = item.dificuldade || 'comum';

  return (
    <li className={`item-tarefa ${classeDificuldade} ${item.concluida ? 'concluida' : ''}`}>
      <div className="conteudo-tarefa">
        <input
          type="checkbox"
          checked={item.concluida}
          onChange={() => alternarConcluida(index)}
          className="checkbox-tarefa"
        />
        <span>{item.texto}</span>
      </div>

      <button onClick={() => removerTarefa(index)} className="btn-remover">
        X
      </button>
    </li>
  );
}

export default Tarefa;