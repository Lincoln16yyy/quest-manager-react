import { CONQUISTAS } from '../constants.js';

/**
 * Dado o conjunto de IDs já desbloqueados e os stats atuais do jogador,
 * retorna as conquistas NOVAS que devem ser desbloqueadas agora.
 * Função pura: fácil de testar, sem efeitos colaterais.
 */
export function verificarNovasConquistas(desbloqueadas, stats) {
  return CONQUISTAS.filter((c) => !desbloqueadas.includes(c.id) && c.condicao(stats));
}
