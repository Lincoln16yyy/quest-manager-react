function Tarefa({ item, index, alternarConcluida, removerTarefa }) {
  return (
    <li className={`item-tarefa ${item.concluida ? 'concluida' : ''}`}>
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