// Chaves do localStorage centralizadas em um lugar só.
// Se um dia precisar renomear, muda aqui e não no código inteiro.
export const STORAGE_KEYS = {
  quests: 'quests-lincoln',
  level: 'level-lincoln',
  xp: 'xp-lincoln',
  concluidas: 'stats-concluidas-lincoln',
  criadas: 'stats-criadas-lincoln',
  streak: 'streak-lincoln',
  ultimoDia: 'ultimo-dia-lincoln',
  somMudo: 'som-mudo-lincoln',
};

export const DIFICULDADES = {
  comum: { rotulo: 'Comum', xp: 10 },
  rara: { rotulo: 'Rara', xp: 25 },
  epica: { rotulo: 'Épica', xp: 50 },
};

// Ordenados do maior requisito para o menor.
export const TITULOS = [
  { nivelMinimo: 35, titulo: 'Mestre Supremo' },
  { nivelMinimo: 20, titulo: 'Lenda Viva' },
  { nivelMinimo: 10, titulo: 'Mercenário de Elite' },
  { nivelMinimo: 5, titulo: 'Caçador de Recompensas' },
  { nivelMinimo: 1, titulo: 'Novato da Guilda' },
];

export const obterTitulo = (nivelAtual) =>
  TITULOS.find(({ nivelMinimo }) => nivelAtual >= nivelMinimo).titulo;
