// Lógica pura de progressão: sem estado, sem efeitos colaterais.
// Fica fácil de testar e de entender.

import {
  XP_POR_NIVEL,
  NIVEL_MAXIMO,
  BONUS_STREAK_POR_CENTO,
  BONUS_STREAK_MAXIMO,
} from '../constants.js';

// As constantes vivem em constants.js (centralizadas); re-exportadas aqui
// para quem já importava de xp.js não quebrar.
export { XP_POR_NIVEL, NIVEL_MAXIMO };

export const xpNecessarioPara = (nivel) => nivel * XP_POR_NIVEL;

// XP total acumulado para chegar ao INÍCIO de um nível.
// Progressão aritmética: k·1 + k·2 + ... + k·(n-1) = k·n·(n-1)/2
const xpAcumuladoAte = (nivel) => (XP_POR_NIVEL * nivel * (nivel - 1)) / 2;

/**
 * Bônus concedido pela sequência diária: +BONUS_STREAK_POR_CENTO% por dia
 * de streak, limitado a BONUS_STREAK_MAXIMO%. Puro e previsível — o valor
 * é guardado na quest (xpGanho) para que desmarcar/apagar devolva exatamente
 * o que foi concedido (sem explorar marcar/desmarcar).
 */
export function bonusStreak(xpBase, streak) {
  const dias = Number.isFinite(streak) ? Math.max(0, Math.floor(streak)) : 0;
  const percentual = Math.min(dias * BONUS_STREAK_POR_CENTO, BONUS_STREAK_MAXIMO);
  return Math.round((xpBase * percentual) / 100);
}

/**
 * Aplica um ganho (ou perda) de XP e retorna o novo { level, xp }.
 * Usa fórmula fechada em vez de loop: funciona até para XP absurdo
 * (ex.: 1e300 vindo de um backup adulterado) sem travar a aba.
 * O nível nunca passa de NIVEL_MAXIMO nem fica abaixo de 1.
 */
export function aplicarXp({ level, xp }, quantidade) {
  const total = xpAcumuladoAte(level) + xp + quantidade;

  if (total <= 0) return { level: 1, xp: 0 };

  // Inverte a fórmula: maior n tal que k·n·(n-1)/2 <= total
  let novoLevel = Math.floor((1 + Math.sqrt(1 + (8 * total) / XP_POR_NIVEL)) / 2);

  // Teto ANTES de corrigir: para totais astronômicos (1e300) a estimativa
  // float pode errar por bilhões de níveis — correr o loop sem teto travaria
  novoLevel = Math.min(NIVEL_MAXIMO, Math.max(1, novoLevel));

  // Corrige possível erro de ponto flutuante (com o teto, são poucos passos)
  while (novoLevel > 1 && xpAcumuladoAte(novoLevel) > total) novoLevel--;
  while (novoLevel < NIVEL_MAXIMO && total >= xpAcumuladoAte(novoLevel + 1)) novoLevel++;

  const novoXp = Math.min(
    total - xpAcumuladoAte(novoLevel),
    xpNecessarioPara(novoLevel) - 1
  );

  return { level: novoLevel, xp: novoXp };
}
