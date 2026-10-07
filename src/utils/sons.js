// Som de level up sintetizado com a Web Audio API: nenhum arquivo de áudio.

let contexto = null;

const obterContexto = () => {
  if (!contexto) {
    const ContextoAudio = window.AudioContext || window.webkitAudioContext;
    contexto = new ContextoAudio();
  }
  return contexto;
};

const tocarNota = (ctx, frequencia, inicio, duracao) => {
  const oscilador = ctx.createOscillator();
  const ganho = ctx.createGain();

  oscilador.type = 'triangle';
  oscilador.frequency.value = frequencia;

  // Envelope: ataque rápido e saída suave, em volume baixo
  ganho.gain.setValueAtTime(0, inicio);
  ganho.gain.linearRampToValueAtTime(0.15, inicio + 0.02);
  ganho.gain.exponentialRampToValueAtTime(0.001, inicio + duracao);

  oscilador.connect(ganho).connect(ctx.destination);
  oscilador.start(inicio);
  oscilador.stop(inicio + duracao);
};

/** Arpejo alegre de level up: Dó → Mi → Sol → Dó agudo. */
export function tocarLevelUp() {
  try {
    const ctx = obterContexto();
    if (ctx.state === 'suspended') ctx.resume();
    const agora = ctx.currentTime;
    tocarNota(ctx, 523.25, agora, 0.15);
    tocarNota(ctx, 659.25, agora + 0.1, 0.15);
    tocarNota(ctx, 783.99, agora + 0.2, 0.15);
    tocarNota(ctx, 1046.5, agora + 0.3, 0.3);
  } catch {
    // Navegador sem suporte a áudio: o jogo continua em silêncio
  }
}
