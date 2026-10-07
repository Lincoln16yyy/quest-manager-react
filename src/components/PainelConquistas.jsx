import { CONQUISTAS } from '../constants';

function PainelConquistas({ desbloqueadas }) {
  return (
    <section className="painel-conquistas" aria-label="Conquistas">
      <h2 className="titulo-secao">
        🏅 Conquistas
        <span className="contador-conquistas">
          {desbloqueadas.length}/{CONQUISTAS.length}
        </span>
      </h2>

      <ul className="grade-conquistas">
        {CONQUISTAS.map((conquista) => {
          const desbloqueada = desbloqueadas.includes(conquista.id);
          return (
            <li
              key={conquista.id}
              className={`card-conquista ${desbloqueada ? 'desbloqueada' : 'bloqueada'}`}
            >
              <span className="emoji-conquista" aria-hidden="true">
                {conquista.emoji}
              </span>
              <strong>{conquista.nome}</strong>
              <small>{conquista.descricao}</small>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default PainelConquistas;
