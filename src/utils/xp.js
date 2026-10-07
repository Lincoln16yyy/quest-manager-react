// Lógica pura de progressão: sem estado, sem efeitos colaterais.
// Fica fácil de testar e de entender.

export const XP_POR_NIVEL = 100;
export const NIVEL_MAXIMO = 9999;

export const xpNecessarioPara = (nivel) => nivel * XP_POR_NIVEL;

// XP total acumulado para chegar ao INÍCIO de um nível.
// Progressão aritmética: 100·1 + 100·2 + ... + 100·(n-1) = 50·n·(n-1)
const xpAcumuladoAte = (nivel) => 50 * nivel * (nivel - 1);

/**
 * Aplica um ganho (ou perda) de XP e retorna o novo { level, xp }.
 * Usa fórmula fechada em vez de loop: funciona até para XP absurdo
 * (ex.: 1e300 vindo de um backup adulterado) sem travar a aba.
 * O nível nunca passa de NIVEL_MAXIMO nem fica abaixo de 1.
 */
export function aplicarXp({ level, xp }, quantidade) {
  const total = xpAcumuladoAte(level) + xp + quantidade;

  if (total <= 0) return { level: 1, xp: 0 };

  // Inverte a fórmula: maior n tal que 50·n·(n-1) <= total
  let novoLevel = Math.floor((1 + Math.sqrt(1 + total / 12.5)) / 2);

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
