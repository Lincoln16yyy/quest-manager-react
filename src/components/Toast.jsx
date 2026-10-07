import { useEffect } from 'react';

const DURACAO_TOAST = 4000;

/** Notificação flutuante genérica: { emoji, titulo, texto }. */
function Toast({ toast, onFechar }) {
  // Fecha sozinho depois de alguns segundos
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onFechar, DURACAO_TOAST);
    return () => clearTimeout(timer);
  }, [toast, onFechar]);

  if (!toast) return null;

  return (
    <div className="toast-notificacao" role="status">
      <span className="emoji-toast" aria-hidden="true">
        {toast.emoji}
      </span>
      <div className="texto-toast">
        <strong>{toast.titulo}</strong>
        <p>{toast.texto}</p>
      </div>
      <button type="button" onClick={onFechar} aria-label="Fechar notificação">
        ✕
      </button>
    </div>
  );
}

export default Toast;
