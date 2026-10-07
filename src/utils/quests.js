// Contadores derivados da lista ATUAL de quests.
// São a base do Poder e das conquistas: só contam quests concluídas
// que ainda existem — criar → concluir → apagar não gera farm.

export const contarConcluidas = (quests) =>
  quests.filter((q) => q.concluida).length;

export const contarEpicasConcluidas = (quests) =>
  quests.filter((q) => q.concluida && (q.dificuldade || 'comum') === 'epica').length;
