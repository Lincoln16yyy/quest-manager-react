// Lógica pura de datas e sequência diária (streak): fácil de testar.

/** Chave de data local no formato "aaaa-m-d" (sem problemas de fuso). */
export const chaveData = (data = new Date()) =>
  `${data.getFullYear()}-${data.getMonth() + 1}-${data.getDate()}`;

export const chaveOntem = () => {
  const ontem = new Date();
  ontem.setDate(ontem.getDate() - 1);
  return chaveData(ontem);
};

/**
 * Registra a conclusão de uma quest no dia de hoje.
 * - Já completou algo hoje → nada muda
 * - Completou ontem → sequência aumenta
 * - Pulou um dia ou mais → sequência recomeça em 1
 */
export function calcularStreak({ streak, ultimoDia }, hoje = chaveData(), ontem = chaveOntem()) {
  if (ultimoDia === hoje) return { streak, ultimoDia, mudou: false };
  if (ultimoDia === ontem) return { streak: streak + 1, ultimoDia: hoje, mudou: true };
  return { streak: 1, ultimoDia: hoje, mudou: true };
}

/**
 * Sequência exibida na tela: se o último dia com conclusão não foi
 * hoje nem ontem, a sequência já era — exibe 0.
 */
export function streakVisivel({ streak, ultimoDia }, hoje = chaveData(), ontem = chaveOntem()) {
  return ultimoDia === hoje || ultimoDia === ontem ? streak : 0;
}
