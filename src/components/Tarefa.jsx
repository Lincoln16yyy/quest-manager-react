import { useState, useRef } from 'react';
import { DIFICULDADES } from '../constants';

function Tarefa({ item, onAlternar, onRemover, onEditar, onEditarDificuldade }) {
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
  const salvarTexto = () => {
    const texto = textoEditado.trim();
    if (texto !== '' && texto !== item.texto) {
      onEditar(item.id, texto);
    }
  };

  const salvarEdicao = () => {
    if (cancelouRef.current) return; // cancelada via Esc
    salvarTexto();
    setEditando(false);
  };

  // Tab do input para os botões de dificuldade dispara blur: salva o texto,
  // mas mantém o modo de edição (caso contrário os botões desmontam no meio)
  const aoSairDoInput = (e) => {
    if (e.relatedTarget?.dataset?.dificuldade) {
      if (!cancelouRef.current) salvarTexto();
      return;
    }
    salvarEdicao();
  };

  return (
    <li
      className={`item-tarefa ${classeDificuldade} ${item.concluida ? 'concluida' : ''} ${
        editando ? 'editando' : ''
      }`}
    >
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
            onBlur={aoSairDoInput}
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

        {editando ? (
          <div className="dificuldade-edicao" role="group" aria-label="Editar dificuldade da quest">
            {Object.entries(DIFICULDADES).map(([chave, { rotulo, xp: xpDificuldade }]) => (
              <button
                key={chave}
                type="button"
                data-dificuldade={chave}
                className={`btn-dificuldade ${chave} ${classeDificuldade === chave ? 'ativa' : ''}`}
                aria-pressed={classeDificuldade === chave}
                // Impede o blur do input: sem isso o clique desmontaria
                // o botão antes do onClick disparar
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => onEditarDificuldade(item.id, chave)}
                title={`${rotulo} · ${xpDificuldade} XP`}
              >
                {rotulo}
              </button>
            ))}
          </div>
        ) : (
          <span className={`tag-dificuldade ${classeDificuldade}`}>
            {rotulo} · {xp} XP
          </span>
        )}
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
