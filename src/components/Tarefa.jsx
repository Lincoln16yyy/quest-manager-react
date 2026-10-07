import { useState, useRef } from 'react';
import { DIFICULDADES } from '../constants';

function Tarefa({ item, onAlternar, onRemover, onEditar }) {
  // Se for uma tarefa antiga que não tinha dificuldade, assume "comum"
  const classeDificuldade = item.dificuldade || 'comum';
  const { rotulo, xp } = DIFICULDADES[classeDificuldade];

  const [editando, setEditando] = useState(false);
  const [textoEditado, setTextoEditado] = useState(item.texto);
  // Esc marca esta flag: o blur disparado ao desmontar o input não pode salvar
  const cancelouRef = useRef(false);

  const iniciarEdicao = () => {
    cancelouRef.current = false;
    setTextoEditado(item.texto);
    setEditando(true);
  };

  const cancelarEdicao = () => {
    cancelouRef.current = true;
    setEditando(false);
  };

  // Idempotente: pode ser chamada pelo Enter e pelo blur sem efeito duplo
  const salvarEdicao = () => {
    if (cancelouRef.current) return; // cancelada via Esc
    const texto = textoEditado.trim();
    if (texto !== '' && texto !== item.texto) {
      onEditar(item.id, texto);
    }
    setEditando(false);
  };

  return (
    <li className={`item-tarefa ${classeDificuldade} ${item.concluida ? 'concluida' : ''}`}>
      <div className="conteudo-tarefa">
        <input
          type="checkbox"
          checked={item.concluida}
          onChange={() => onAlternar(item.id)}
          className="checkbox-tarefa"
          aria-label={`Concluir quest "${item.texto}"`}
        />

        {editando ? (
          <input
            type="text"
            className="input-edicao"
            value={textoEditado}
            onChange={(e) => setTextoEditado(e.target.value)}
            onBlur={salvarEdicao}
            onKeyDown={(e) => {
              if (e.key === 'Enter') salvarEdicao();
              if (e.key === 'Escape') cancelarEdicao();
            }}
            maxLength={120}
            autoFocus
            aria-label="Editar texto da quest"
          />
        ) : (
          <span
            className="texto-tarefa"
            onDoubleClick={iniciarEdicao}
            title="Duplo clique para editar"
          >
            {item.texto}
          </span>
        )}

        <span className={`tag-dificuldade ${classeDificuldade}`}>
          {rotulo} · {xp} XP
        </span>
      </div>

      <div className="acoes-tarefa">
        {!editando && (
          <button
            type="button"
            onClick={iniciarEdicao}
            className="btn-editar"
            aria-label={`Editar quest "${item.texto}"`}
            title="Editar quest"
          >
            ✏️
          </button>
        )}
        <button
          type="button"
          onClick={() => onRemover(item.id)}
          className="btn-remover"
          aria-label={`Remover quest "${item.texto}"`}
          title="Remover quest"
        >
          ✕
        </button>
      </div>
    </li>
  );
}

export default Tarefa;
