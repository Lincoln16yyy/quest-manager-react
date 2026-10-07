import { useEffect } from 'react';

const DURACAO_TOAST = 4000;

function ToastConquista({ conquista, onFechar }) {
  // Fecha sozinho depois de alguns segundos
  useEffect(() => {
    if (!conquista) return;
    const timer = setTimeout(onFechar, DURACAO_TOAST);
    return () => clearTimeout(timer);
  }, [conquista, onFechar]);

  if (!conquista) return null;

  return (
    <div className="toast-conquista" role="status">
      <span className="emoji-toast" aria-hidden="true">
        {conquista.emoji}
      </span>
      <div className="texto-toast">
        <strong>Conquista desbloqueada!</strong>
        <p>
          {conquista.nome} — {conquista.descricao}
        </p>
      </div>
      <button type="button" onClick={onFechar} aria-label="Fechar notificação">
        ✕
      </button>
    </div>
  );
}

export default ToastConquista;
