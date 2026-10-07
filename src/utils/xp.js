// Lógica pura de progressão: sem estado, sem efeitos colaterais.
// Fica fácil de testar e de entender.

export const XP_POR_NIVEL = 100;

export const xpNecessarioPara = (nivel) => nivel * XP_POR_NIVEL;

/**
 * Aplica um ganho (ou perda) de XP e retorna o novo { level, xp },
 * resolvendo quantas subidas/descidas de nível forem necessárias.
 * O nível nunca fica abaixo de 1 e o XP nunca fica negativo no nível 1.
 */
export function aplicarXp({ level, xp }, quantidade) {
  let novoLevel = level;
  let novoXp = xp + quantidade;

  // Subiu de nível (pode subir vários de uma vez)
  while (novoXp >= xpNecessarioPara(novoLevel)) {
    novoXp -= xpNecessarioPara(novoLevel);
    novoLevel += 1;
  }

  // Desceu de nível ao perder XP
  while (novoXp < 0 && novoLevel > 1) {
    novoLevel -= 1;
    novoXp += xpNecessarioPara(novoLevel);
  }

  // No nível 1 o XP simplesmente zera, nunca fica negativo
  if (novoXp < 0) novoXp = 0;

  return { level: novoLevel, xp: novoXp };
}
