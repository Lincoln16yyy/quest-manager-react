import { TEMAS } from '../constants';

function SeletorTema({ tema, onMudarTema }) {
  return (
    <div className="seletor-tema" role="radiogroup" aria-label="Tema de cores">
      <span className="rotulo-tema" aria-hidden="true">
        🎨 Tema:
      </span>
      {TEMAS.map((t) => (
        <button
          key={t.id}
          type="button"
          role="radio"
          aria-checked={tema === t.id}
          className={`btn-tema ${tema === t.id ? 'ativo' : ''}`}
          onClick={() => onMudarTema(t.id)}
        >
          {t.emoji} {t.nome}
        </button>
      ))}
    </div>
  );
}

export default SeletorTema;
