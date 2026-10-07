import { useEffect } from 'react';

const DURACAO_PADRAO = 4000;

/**
 * Notificação flutuante genérica.
 * toast = { emoji, titulo, texto, duracao?, acao?: { rotulo, onClick } }
 */
function Toast({ toast, onFechar }) {
  // Fecha sozinho depois de alguns segundos
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onFechar, toast.duracao ?? DURACAO_PADRAO);
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
      {toast.acao && (
        <button
          type="button"
          className="acao-toast"
          onClick={() => {
            toast.acao.onClick();
            onFechar();
          }}
        >
          {toast.acao.rotulo}
        </button>
      )}
      <button type="button" onClick={onFechar} aria-label="Fechar notificação">
        ✕
      </button>
    </div>
  );
}

export default Toast;
